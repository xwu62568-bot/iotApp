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
import { ScenesStackParamList } from '../../navigation';
import { 
  fetchScenes, 
  selectScenes, 
  selectSceneLoading, 
  selectSceneError,
  selectEnabledScenes,
  executeScene,
} from '../../store/slices/sceneSlice';
import { t } from '../../services/api/localization';
import { Scene } from '../../store/slices/sceneSlice';
import Button from '../../components/common/Button';

type ScenesScreenNavigationProp = StackNavigationProp<ScenesStackParamList, 'ScenesList'>;

interface ScenesScreenProps {
  navigation: ScenesScreenNavigationProp;
}

const ScenesScreen: React.FC<ScenesScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const scenes = useSelector(selectScenes);
  const loading = useSelector(selectSceneLoading);
  const error = useSelector(selectSceneError);
  const enabledScenes = useSelector(selectEnabledScenes);

  const [refreshing, setRefreshing] = useState(false);

  // 加载场景列表
  useEffect(() => {
    dispatch(fetchScenes());
  }, [dispatch]);

  // 下拉刷新
  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchScenes());
    setRefreshing(false);
  };

  // 获取场景类型图标
  const getSceneTypeIcon = (type: Scene['type']): string => {
    switch (type) {
      case 'manual':
        return 'hand-left';
      case 'scheduled':
        return 'time';
      case 'triggered':
        return 'flash';
      default:
        return 'layers';
    }
  };

  // 获取场景类型颜色
  const getSceneTypeColor = (type: Scene['type']): string => {
    switch (type) {
      case 'manual':
        return Colors.primary[500];
      case 'scheduled':
        return Colors.info[500];
      case 'triggered':
        return Colors.warning[500];
      default:
        return Colors.neutral[500];
    }
  };

  // 获取场景类型标签
  const getSceneTypeLabel = (type: Scene['type']): string => {
    switch (type) {
      case 'manual':
        return '手动';
      case 'scheduled':
        return '定时';
      case 'triggered':
        return '触发';
      default:
        return '未知';
    }
  };

  // 处理场景执行
  const handleExecuteScene = (scene: Scene) => {
    Alert.alert(
      '执行场景',
      `确定要执行场景"${scene.name}"吗？`,
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '执行',
          onPress: () => {
            dispatch(executeScene(scene.id));
          },
        },
      ]
    );
  };

  // 处理场景编辑
  const handleEditScene = (scene: Scene) => {
    navigation.navigate('SceneDetail', { sceneId: scene.id });
  };

  // 处理场景删除
  const handleDeleteScene = (scene: Scene) => {
    Alert.alert(
      '删除场景',
      `确定要删除场景"${scene.name}"吗？此操作不可撤销。`,
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            // 这里应该调用删除场景的action
            Alert.alert('成功', '场景已删除');
          },
        },
      ]
    );
  };

  // 渲染场景项
  const renderSceneItem = ({ item }: { item: Scene }) => (
    <View style={styles.sceneItem}>
      <View style={styles.sceneHeader}>
        <View style={styles.sceneIconContainer}>
          <Ionicons 
            name={getSceneTypeIcon(item.type) as any} 
            size={24} 
            color={getSceneTypeColor(item.type)} 
          />
        </View>
        <View style={styles.sceneInfo}>
          <Text style={styles.sceneName}>{item.name}</Text>
          <Text style={styles.sceneDescription}>
            {item.description || '暂无描述'}
          </Text>
          <View style={styles.sceneMeta}>
            <View style={[styles.typeTag, { backgroundColor: getSceneTypeColor(item.type) + '20' }]}>
              <Text style={[styles.typeText, { color: getSceneTypeColor(item.type) }]}>
                {getSceneTypeLabel(item.type)}
              </Text>
            </View>
            <Text style={styles.actionCount}>
              {item.actions.length} 个动作
            </Text>
          </View>
        </View>
        <View style={styles.sceneStatus}>
          <View style={[styles.statusDot, { backgroundColor: item.enabled ? Colors.success[500] : Colors.neutral[400] }]} />
          <Text style={styles.statusText}>
            {item.enabled ? '启用' : '禁用'}
          </Text>
        </View>
      </View>
      
      <View style={styles.sceneActions}>
        <Button
          title="执行"
          onPress={() => handleExecuteScene(item)}
          variant="primary"
          size="small"
          style={styles.actionButton}
        />
        <Button
          title="编辑"
          onPress={() => handleEditScene(item)}
          variant="outline"
          size="small"
          style={styles.actionButton}
        />
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => {
            Alert.alert(
              '更多操作',
              '',
              [
                {
                  text: '取消',
                  style: 'cancel',
                },
                {
                  text: '编辑',
                  onPress: () => handleEditScene(item),
                },
                {
                  text: '删除',
                  style: 'destructive',
                  onPress: () => handleDeleteScene(item),
                },
              ]
            );
          }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color={Colors.neutral[500]} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // 渲染空状态
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="layers-outline" size={64} color={Colors.neutral[300]} />
      <Text style={styles.emptyStateTitle}>暂无场景</Text>
      <Text style={styles.emptyStateSubtitle}>
        点击下方按钮创建您的第一个智能场景
      </Text>
    </View>
  );

  // 渲染统计信息
  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{scenes.length}</Text>
        <Text style={styles.statLabel}>总场景</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: Colors.success[500] }]}>
          {enabledScenes.length}
        </Text>
        <Text style={styles.statLabel}>启用</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: Colors.neutral[500] }]}>
          {scenes.length - enabledScenes.length}
        </Text>
        <Text style={styles.statLabel}>禁用</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 统计信息 */}
      {scenes.length > 0 && renderStats()}
      
      {/* 场景列表 */}
      <FlatList
        data={scenes}
        renderItem={renderSceneItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          scenes.length === 0 && styles.emptyListContainer
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

      {/* 添加场景按钮 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddScene')}
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
  sceneItem: {
    backgroundColor: Colors.light.surface,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sceneHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sceneIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sceneInfo: {
    flex: 1,
  },
  sceneName: {
    ...TextStyles.h5,
    color: Colors.light.onSurface,
    marginBottom: 4,
  },
  sceneDescription: {
    ...TextStyles.body3,
    color: Colors.neutral[600],
    marginBottom: 8,
  },
  sceneMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  typeText: {
    ...TextStyles.caption,
    fontWeight: '600',
  },
  actionCount: {
    ...TextStyles.caption,
    color: Colors.neutral[500],
  },
  sceneStatus: {
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  statusText: {
    ...TextStyles.caption,
    color: Colors.neutral[600],
  },
  sceneActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  moreButton: {
    padding: 8,
    marginLeft: 8,
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

export default ScenesScreen; 