import React from 'react';
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
import { ScenesStackParamList } from '../../navigation';
import { 
  selectScenes, 
  selectSelectedScene,
  setSelectedScene,
  executeScene,
} from '../../store/slices/sceneSlice';
import { t } from '../../services/api/localization';
import { Scene } from '../../store/slices/sceneSlice';
import Button from '../../components/common/Button';

type SceneDetailScreenNavigationProp = StackNavigationProp<ScenesStackParamList, 'SceneDetail'>;
type SceneDetailScreenRouteProp = RouteProp<ScenesStackParamList, 'SceneDetail'>;

interface SceneDetailScreenProps {
  navigation: SceneDetailScreenNavigationProp;
  route: SceneDetailScreenRouteProp;
}

const SceneDetailScreen: React.FC<SceneDetailScreenProps> = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const scenes = useSelector(selectScenes);
  const selectedScene = useSelector(selectSelectedScene);
  
  const { sceneId } = route.params;
  const scene = scenes.find(s => s.id === sceneId) || selectedScene;

  React.useEffect(() => {
    if (scene) {
      dispatch(setSelectedScene(scene));
    }
  }, [scene, dispatch]);

  if (!scene) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>场景未找到</Text>
        </View>
      </SafeAreaView>
    );
  }

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
  const handleExecuteScene = () => {
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

  // 渲染场景头部
  const renderSceneHeader = () => (
    <View style={styles.header}>
      <View style={styles.sceneIconContainer}>
        <Ionicons 
          name={getSceneTypeIcon(scene.type) as any} 
          size={48} 
          color={getSceneTypeColor(scene.type)} 
        />
      </View>
      <Text style={styles.sceneName}>{scene.name}</Text>
      <Text style={styles.sceneDescription}>
        {scene.description || '暂无描述'}
      </Text>
      <View style={styles.sceneMeta}>
        <View style={[styles.typeTag, { backgroundColor: getSceneTypeColor(scene.type) + '20' }]}>
          <Text style={[styles.typeText, { color: getSceneTypeColor(scene.type) }]}>
            {getSceneTypeLabel(scene.type)}
          </Text>
        </View>
        <View style={[styles.statusTag, { backgroundColor: scene.enabled ? Colors.success[100] : Colors.neutral[100] }]}>
          <Text style={[styles.statusText, { color: scene.enabled ? Colors.success[600] : Colors.neutral[600] }]}>
            {scene.enabled ? '启用' : '禁用'}
          </Text>
        </View>
      </View>
    </View>
  );

  // 渲染场景信息
  const renderSceneInfo = () => (
    <View style={styles.infoContainer}>
      <Text style={styles.sectionTitle}>场景信息</Text>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>创建时间</Text>
        <Text style={styles.infoValue}>
          {new Date(scene.createdAt).toLocaleString()}
        </Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>更新时间</Text>
        <Text style={styles.infoValue}>
          {new Date(scene.updatedAt).toLocaleString()}
        </Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>条件数量</Text>
        <Text style={styles.infoValue}>{scene.conditions.length} 个</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>动作数量</Text>
        <Text style={styles.infoValue}>{scene.actions.length} 个</Text>
      </View>
    </View>
  );

  // 渲染条件列表
  const renderConditions = () => (
    <View style={styles.conditionsContainer}>
      <Text style={styles.sectionTitle}>触发条件</Text>
      {scene.conditions.length === 0 ? (
        <Text style={styles.emptyText}>暂无触发条件</Text>
      ) : (
        scene.conditions.map((condition, index) => (
          <View key={condition.id} style={styles.conditionItem}>
            <View style={styles.conditionIcon}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success[500]} />
            </View>
            <View style={styles.conditionContent}>
              <Text style={styles.conditionTitle}>
                {condition.type === 'time' ? '时间条件' :
                 condition.type === 'device' ? '设备条件' :
                 condition.type === 'sensor' ? '传感器条件' :
                 condition.type === 'location' ? '位置条件' :
                 condition.type === 'weather' ? '天气条件' : '未知条件'}
              </Text>
              <Text style={styles.conditionDescription}>
                {JSON.stringify(condition.parameters)}
              </Text>
            </View>
          </View>
        ))
      )}
    </View>
  );

  // 渲染动作列表
  const renderActions = () => (
    <View style={styles.actionsContainer}>
      <Text style={styles.sectionTitle}>执行动作</Text>
      {scene.actions.length === 0 ? (
        <Text style={styles.emptyText}>暂无执行动作</Text>
      ) : (
        scene.actions.map((action, index) => (
          <View key={action.id} style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Ionicons name="play-circle" size={20} color={Colors.primary[500]} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>
                {action.action === 'turnOn' ? '开启设备' :
                 action.action === 'turnOff' ? '关闭设备' :
                 action.action === 'setBrightness' ? '设置亮度' :
                 action.action === 'setTemperature' ? '设置温度' : action.action}
              </Text>
              <Text style={styles.actionDescription}>
                设备ID: {action.deviceId}
              </Text>
              {Object.keys(action.parameters).length > 0 && (
                <Text style={styles.actionParameters}>
                  参数: {JSON.stringify(action.parameters)}
                </Text>
              )}
            </View>
          </View>
        ))
      )}
    </View>
  );

  // 渲染控制按钮
  const renderControlButtons = () => (
    <View style={styles.controlContainer}>
      <View style={styles.buttonRow}>
        <Button
          title="执行场景"
          onPress={handleExecuteScene}
          variant="primary"
          style={styles.controlButton}
        />
        <Button
          title="编辑场景"
          onPress={() => {
            Alert.alert('编辑场景', '编辑场景功能');
          }}
          variant="outline"
          style={styles.controlButton}
        />
      </View>
      <View style={styles.buttonRow}>
        <Button
          title={scene.enabled ? '禁用场景' : '启用场景'}
          onPress={() => {
            Alert.alert('切换状态', `${scene.enabled ? '禁用' : '启用'}场景功能`);
          }}
          variant="secondary"
          style={styles.controlButton}
        />
        <Button
          title="删除场景"
          onPress={() => {
            Alert.alert(
              '删除场景',
              '确定要删除此场景吗？此操作不可撤销。',
              [
                { text: '取消', style: 'cancel' },
                { text: '删除', style: 'destructive', onPress: () => navigation.goBack() },
              ]
            );
          }}
          variant="danger"
          style={styles.controlButton}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 场景头部 */}
        {renderSceneHeader()}

        {/* 场景信息 */}
        {renderSceneInfo()}

        {/* 触发条件 */}
        {renderConditions()}

        {/* 执行动作 */}
        {renderActions()}

        {/* 控制按钮 */}
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
  sceneIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  sceneName: {
    ...TextStyles.h3,
    color: Colors.light.onSurface,
    marginBottom: 8,
  },
  sceneDescription: {
    ...TextStyles.body2,
    color: Colors.neutral[600],
    textAlign: 'center',
    marginBottom: 16,
  },
  sceneMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  typeText: {
    ...TextStyles.caption,
    fontWeight: '600',
  },
  statusTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    ...TextStyles.caption,
    fontWeight: '600',
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
  conditionsContainer: {
    backgroundColor: Colors.light.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  conditionIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  conditionContent: {
    flex: 1,
  },
  conditionTitle: {
    ...TextStyles.body2,
    color: Colors.light.onSurface,
    fontWeight: '600',
    marginBottom: 4,
  },
  conditionDescription: {
    ...TextStyles.caption,
    color: Colors.neutral[600],
  },
  actionsContainer: {
    backgroundColor: Colors.light.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  actionIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    ...TextStyles.body2,
    color: Colors.light.onSurface,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionDescription: {
    ...TextStyles.caption,
    color: Colors.neutral[600],
    marginBottom: 2,
  },
  actionParameters: {
    ...TextStyles.caption,
    color: Colors.neutral[500],
  },
  emptyText: {
    ...TextStyles.body2,
    color: Colors.neutral[500],
    textAlign: 'center',
    fontStyle: 'italic',
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

export default SceneDetailScreen; 