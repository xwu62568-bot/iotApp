import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/colors';
import { Fonts, TextStyles } from '../../constants/fonts';
import { DevicesStackParamList } from '../../navigation';
import { 
  fetchDevices, 
  selectDevices, 
  selectDeviceLoading, 
  selectDeviceError,
  selectOnlineDevices,
  selectOfflineDevices,
} from '../../store/slices/deviceSlice';
import { t } from '../../services/api/localization';
import { Device, DeviceStatus } from '../../types/device';

type DevicesScreenNavigationProp = StackNavigationProp<DevicesStackParamList, 'DevicesList'>;

interface DevicesScreenProps {
  navigation: DevicesScreenNavigationProp;
}

const DevicesScreen: React.FC<DevicesScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const devices = useSelector(selectDevices);
  const loading = useSelector(selectDeviceLoading);
  const error = useSelector(selectDeviceError);
  const onlineDevices = useSelector(selectOnlineDevices);
  const offlineDevices = useSelector(selectOfflineDevices);

  const [refreshing, setRefreshing] = useState(false);

  // 加载设备列表
  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  // 下拉刷新
  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchDevices());
    setRefreshing(false);
  };

  // 获取设备状态颜色
  const getStatusColor = (status: DeviceStatus): string => {
    switch (status) {
      case 'online':
        return Colors.deviceStatus.online;
      case 'offline':
        return Colors.deviceStatus.offline;
      case 'error':
        return Colors.deviceStatus.error;
      case 'maintenance':
        return Colors.deviceStatus.maintenance;
      default:
        return Colors.neutral[400];
    }
  };

  // 获取设备图标
  const getDeviceIcon = (type: Device['type']): string => {
    switch (type) {
      case 'light':
        return 'bulb';
      case 'switch':
        return 'toggle';
      case 'sensor':
        return 'thermometer';
      case 'camera':
        return 'camera';
      case 'thermostat':
        return 'thermometer';
      case 'lock':
        return 'lock-closed';
      case 'speaker':
        return 'volume-high';
      case 'fan':
        return 'air';
      case 'curtain':
        return 'resize';
      default:
        return 'hardware-chip';
    }
  };

  // 渲染设备项
  const renderDeviceItem = ({ item }: { item: Device }) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => navigation.navigate('DeviceDetail', { deviceId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.deviceIconContainer}>
        <Ionicons 
          name={getDeviceIcon(item.type) as any} 
          size={32} 
          color={Colors.primary[500]} 
        />
        <View 
          style={[
            styles.statusIndicator, 
            { backgroundColor: getStatusColor(item.status) }
          ]} 
        />
      </View>
      
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{item.name}</Text>
        <Text style={styles.deviceType}>{item.type}</Text>
        <Text style={styles.deviceStatus}>
          {item.status === 'online' ? '在线' : 
           item.status === 'offline' ? '离线' : 
           item.status === 'error' ? '错误' : '维护中'}
        </Text>
      </View>
      
      <View style={styles.deviceActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            // 这里可以添加快速控制功能
            Alert.alert('快速控制', `控制 ${item.name}`);
          }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color={Colors.neutral[500]} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // 渲染空状态
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="bulb-outline" size={64} color={Colors.neutral[300]} />
      <Text style={styles.emptyStateTitle}>暂无设备</Text>
      <Text style={styles.emptyStateSubtitle}>
        点击下方按钮添加您的第一个智能设备
      </Text>
    </View>
  );

  // 渲染统计信息
  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{devices.length}</Text>
        <Text style={styles.statLabel}>总设备</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: Colors.deviceStatus.online }]}>
          {onlineDevices.length}
        </Text>
        <Text style={styles.statLabel}>在线</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: Colors.deviceStatus.offline }]}>
          {offlineDevices.length}
        </Text>
        <Text style={styles.statLabel}>离线</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 统计信息 */}
      {devices.length > 0 && renderStats()}
      
      {/* 设备列表 */}
      <FlatList
        data={devices}
        renderItem={renderDeviceItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          devices.length === 0 && styles.emptyListContainer
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary[500]]}
            tintColor={Colors.primary[500]}
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* 添加设备按钮 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddDevice')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color={Colors.light.onPrimary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...TextStyles.h3,
    color: Colors.light.onSurface,
    marginBottom: 4,
  },
  statLabel: {
    ...TextStyles.caption,
    color: Colors.neutral[600],
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  deviceIconContainer: {
    position: 'relative',
    marginRight: 16,
  },
  statusIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.light.surface,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    ...TextStyles.h5,
    color: Colors.light.onSurface,
    marginBottom: 4,
  },
  deviceType: {
    ...TextStyles.body3,
    color: Colors.neutral[600],
    marginBottom: 2,
  },
  deviceStatus: {
    ...TextStyles.caption,
    color: Colors.neutral[500],
  },
  deviceActions: {
    marginLeft: 8,
  },
  actionButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    ...TextStyles.h4,
    color: Colors.neutral[400],
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    ...TextStyles.body2,
    color: Colors.neutral[500],
    textAlign: 'center',
    lineHeight: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default DevicesScreen; 