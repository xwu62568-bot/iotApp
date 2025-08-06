import React, { useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/colors';
import { Fonts, TextStyles } from '../../constants/fonts';
import { ScenesStackParamList } from '../../navigation';
import { addScene, selectSceneLoading } from '../../store/slices/sceneSlice';
import { t } from '../../services/api/localization';
import { Scene } from '../../store/slices/sceneSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

type AddSceneScreenNavigationProp = StackNavigationProp<ScenesStackParamList, 'AddScene'>;

interface AddSceneScreenProps {
  navigation: AddSceneScreenNavigationProp;
}

const AddSceneScreen: React.FC<AddSceneScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectSceneLoading);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<Scene['type']>('manual');
  const [enabled, setEnabled] = useState(true);

  const [nameError, setNameError] = useState('');

  // 场景类型选项
  const sceneTypes: { type: Scene['type']; label: string; icon: string; description: string }[] = [
    { 
      type: 'manual', 
      label: '手动场景', 
      icon: 'hand-left',
      description: '手动触发执行的场景'
    },
    { 
      type: 'scheduled', 
      label: '定时场景', 
      icon: 'time',
      description: '按时间自动执行的场景'
    },
    { 
      type: 'triggered', 
      label: '触发场景', 
      icon: 'flash',
      description: '满足条件时自动触发的场景'
    },
  ];

  // 验证表单
  const validateForm = (): boolean => {
    if (!name.trim()) {
      setNameError('请输入场景名称');
      return false;
    } else {
      setNameError('');
      return true;
    }
  };

  // 处理添加场景
  const handleAddScene = async () => {
    if (!validateForm()) {
      return;
    }

    const newScene: Omit<Scene, 'id' | 'createdAt' | 'updatedAt'> = {
      name: name.trim(),
      description: description.trim() || undefined,
      type,
      enabled,
      conditions: [],
      actions: [],
    };

    try {
      await dispatch(addScene(newScene));
      Alert.alert('成功', '场景创建成功', [
        {
          text: '确定',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('错误', '创建场景失败，请重试');
    }
  };

  // 渲染场景类型选择
  const renderSceneTypeSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>场景类型</Text>
      {sceneTypes.map((sceneType) => (
        <TouchableOpacity
          key={sceneType.type}
          style={[
            styles.typeItem,
            type === sceneType.type && styles.typeItemSelected,
          ]}
          onPress={() => setType(sceneType.type)}
        >
          <View style={styles.typeHeader}>
            <View style={styles.typeIconContainer}>
              <Ionicons
                name={sceneType.icon as any}
                size={24}
                color={type === sceneType.type ? Colors.primary[500] : Colors.neutral[500]}
              />
            </View>
            <View style={styles.typeInfo}>
              <Text style={[
                styles.typeLabel,
                type === sceneType.type && styles.typeLabelSelected,
              ]}>
                {sceneType.label}
              </Text>
              <Text style={styles.typeDescription}>
                {sceneType.description}
              </Text>
            </View>
            {type === sceneType.type && (
              <Ionicons name="checkmark-circle" size={24} color={Colors.primary[500]} />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 场景类型选择 */}
        {renderSceneTypeSelector()}

        {/* 基本信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>基本信息</Text>
          <Input
            label="场景名称"
            placeholder="请输入场景名称"
            value={name}
            onChangeText={setName}
            error={nameError}
            fullWidth
          />
          <Input
            label="场景描述"
            placeholder="请输入场景描述（可选）"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            fullWidth
          />
        </View>

        {/* 场景状态 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>场景状态</Text>
          <TouchableOpacity
            style={styles.statusItem}
            onPress={() => setEnabled(!enabled)}
          >
            <View style={styles.statusInfo}>
              <Text style={styles.statusLabel}>启用场景</Text>
              <Text style={styles.statusDescription}>
                创建后立即启用此场景
              </Text>
            </View>
            <View style={[
              styles.toggleSwitch,
              { backgroundColor: enabled ? Colors.primary[500] : Colors.neutral[300] }
            ]}>
              <View style={[
                styles.toggleThumb,
                { transform: [{ translateX: enabled ? 20 : 0 }] }
              ]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* 添加按钮 */}
        <View style={styles.buttonContainer}>
          <Button
            title="创建场景"
            onPress={handleAddScene}
            loading={loading}
            fullWidth
            size="large"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...TextStyles.h5,
    color: Colors.light.onSurface,
    marginBottom: 12,
  },
  typeItem: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeItemSelected: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
  },
  typeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  typeInfo: {
    flex: 1,
  },
  typeLabel: {
    ...TextStyles.body1,
    color: Colors.light.onSurface,
    fontWeight: '600',
    marginBottom: 4,
  },
  typeLabelSelected: {
    color: Colors.primary[500],
  },
  typeDescription: {
    ...TextStyles.caption,
    color: Colors.neutral[600],
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    ...TextStyles.body1,
    color: Colors.light.onSurface,
    marginBottom: 4,
  },
  statusDescription: {
    ...TextStyles.caption,
    color: Colors.neutral[600],
  },
  toggleSwitch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.light.surface,
  },
  buttonContainer: {
    marginBottom: 24,
  },
});

export default AddSceneScreen; 