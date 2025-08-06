import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/colors';
import { Fonts, TextStyles } from '../../constants/fonts';
import { DevicesStackParamList } from '../../navigation';
import { 
  selectDevices, 
  selectSelectedDevice,
  setSelectedDevice,
  controlDevice,
} from '../../store/slices/deviceSlice';
import { t } from '../../services/api/localization';
import { Device, DeviceStatus } from '../../types/device';
import Button from '../../components/common/Button';

type DeviceDetailScreenNavigationProp = StackNavigationProp<DevicesStackParamList, 'DeviceDetail'>;
type DeviceDetailScreenRouteProp = RouteProp<DevicesStackParamList, 'DeviceDetail'>;

interface DeviceDetailScreenProps {
  navigation: DeviceDetailScreenNavigationProp;
  route: DeviceDetailScreenRouteProp;
}

const DeviceDetailScreen: React.FC<DeviceDetailScreenProps> = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const devices = useSelector(selectDevices);
  const selectedDevice = useSelector(selectSelectedDevice);
  
  const { deviceId } = route.params;
  const device = devices.find(d => d.id === deviceId) || selectedDevice;

  useEffect(() => {
    if (device) {
      dispatch(setSelectedDevice(device));
    }
  }, [device, dispatch]);

  if (!device) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>设备未找到</Text>
        </View>
      </SafeAreaView>
    );
  }

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

  // 处理设备控制
  const handleDeviceControl = (action: string, parameters?: any) => {
    dispatch(controlDevice({
      deviceId: device.id,
      action,
      parameters,
    }));
  };

  // 渲染设备状态
  const renderDeviceStatus = () => (
    <View style={styles.statusContainer}>
      <View style={styles.statusItem}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(device.status) }]} />
        <Text style={styles.statusText}>
          {device.status === 'online' ? '在线' : 
           device.status === 'offline' ? '离线' : 
           device.status === 'error' ? '错误' : '维护中'}
        </Text>
      </View>
      <Text style={styles.lastSeenText}>
        最后在线: {new Date(device.lastSeen).toLocaleString()}
      </Text>
    </View>
  );

  // 渲染设备信息
  const renderDeviceInfo = () => (
    <View style={styles.infoContainer}>
      <Text style={styles.sectionTitle}>设备信息</Text>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>设备名称</Text>
        <Text style={styles.infoValue}>{device.name}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>设备类型</Text>
        <Text style={styles.infoValue}>{device.type}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>制造商</Text>
        <Text style={styles.infoValue}>{device.manufacturer}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>型号</Text>
        <Text style={styles.infoValue}>{device.model}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>固件版本</Text>
        <Text style={styles.infoValue}>{device.firmwareVersion}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>连接方式</Text>
        <Text style={styles.infoValue}>{device.connectionType}</Text>
      </View>
      {device.ipAddress && (
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>IP地址</Text>
          <Text style={styles.infoValue}>{device.ipAddress}</Text>
        </View>
      )}
    </View>
  );

  // 渲染设备属性
  const renderDeviceProperties = () => (
    <View style={styles.propertiesContainer}>
      <Text style={styles.sectionTitle}>设备状态</Text>
      {device.properties.power !== undefined && (
        <View style={styles.propertyItem}>
          <Text style={styles.propertyLabel}>电源</Text>
          <Text style={styles.propertyValue}>
            {device.properties.power ? '开启' : '关闭'}
          </Text>
        </View>
      )}
      {device.properties.brightness !== undefined && (
        <View style={styles.propertyItem}>
          <Text style={styles.propertyLabel}>亮度</Text>
          <Text style={styles.propertyValue}>{device.properties.brightness}%</Text>
        </View>
      )}
      {device.properties.temperature !== undefined && (
        <View style={styles.propertyItem}>
          <Text style={styles.propertyLabel}>温度</Text>
          <Text style={styles.propertyValue}>{device.properties.temperature}°C</Text>
        </View>
      )}
      {device.properties.humidity !== undefined && (
        <View style={styles.propertyItem}>
          <Text style={styles.propertyLabel}>湿度</Text>
          <Text style={styles.propertyValue}>{device.properties.humidity}%</Text>
        </View>
      )}
      {device.properties.battery !== undefined && (
        <View style={styles.propertyItem}>
          <Text style={styles.propertyLabel}>电池电量</Text>
          <Text style={styles.propertyValue}>{device.properties.battery}%</Text>
        </View>
      )}
    </View>
  );

  // 渲染控制按钮
  const renderControlButtons = () => (
    <View style={styles.controlContainer}>
      <Text style={styles.sectionTitle}>设备控制</Text>
      <View style={styles.buttonRow}>
        <Button
          title="开启"
          onPress={() => handleDeviceControl('turnOn')}
          variant="primary"
          style={styles.controlButton}
        />
        <Button
          title="关闭"
          onPress={() => handleDeviceControl('turnOff')}
          variant="outline"
          style={styles.controlButton}
        />
      </View>
      {device.type === 'light' && device.properties.brightness !== undefined && (
        <View style={styles.buttonRow}>
          <Button
            title="调亮"
            onPress={() => handleDeviceControl('setBrightness', { brightness: Math.min(100, (device.properties.brightness || 0) + 20) })}
            variant="secondary"
            style={styles.controlButton}
          />
          <Button
            title="调暗"
            onPress={() => handleDeviceControl('setBrightness', { brightness: Math.max(0, (device.properties.brightness || 0) - 20) })}
            variant="secondary"
            style={styles.controlButton}
          />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 设备头部 */}
        <View style={styles.header}>
          <View style={styles.deviceIconContainer}>
            <Ionicons 
              name={getDeviceIcon(device.type) as any} 
              size={48} 
              color={Colors.primary[500]} 
            />
          </View>
          <Text style={styles.deviceName}>{device.name}</Text>
          {renderDeviceStatus()}
        </View>

        {/* 设备信息 */}
        {renderDeviceInfo()}

        {/* 设备属性 */}
        {renderDeviceProperties()}

        {/* 设备控制 */}
        {renderControlButtons()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...TextStyles.h4,
    color: Colors.error[500],
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: Colors.light.surface,
    marginBottom: 16,
  },
  deviceIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  deviceName: {
    ...TextStyles.h3,
    color: Colors.light.onSurface,
    marginBottom: 8,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    ...TextStyles.body2,
    color: Colors.light.onSurface,
  },
  lastSeenText: {
    ...TextStyles.caption,
    color: Colors.neutral[600],
  },
  infoContainer: {
    backgroundColor: Colors.light.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    ...TextStyles.h5,
    color: Colors.light.onSurface,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  infoLabel: {
    ...TextStyles.body2,
    color: Colors.neutral[600],
  },
  infoValue: {
    ...TextStyles.body2,
    color: Colors.light.onSurface,
    fontWeight: '500',
  },
  propertiesContainer: {
    backgroundColor: Colors.light.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  propertyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  propertyLabel: {
    ...TextStyles.body2,
    color: Colors.neutral[600],
  },
  propertyValue: {
    ...TextStyles.body2,
    color: Colors.light.onSurface,
    fontWeight: '500',
  },
  controlContainer: {
    backgroundColor: Colors.light.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  controlButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default DeviceDetailScreen; 