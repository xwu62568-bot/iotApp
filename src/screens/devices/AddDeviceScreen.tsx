import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { Colors } from '../../constants/colors';
import { Fonts, TextStyles } from '../../constants/fonts';
import { DevicesStackParamList } from '../../navigation';
import { addDevice, selectDeviceLoading } from '../../store/slices/deviceSlice';
import { t } from '../../services/api/localization';
import { Device, DeviceType } from '../../types/device';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

type AddDeviceScreenNavigationProp = StackNavigationProp<DevicesStackParamList, 'AddDevice'>;

interface AddDeviceScreenProps {
  navigation: AddDeviceScreenNavigationProp;
}

const AddDeviceScreen: React.FC<AddDeviceScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectDeviceLoading);

  const [name, setName] = useState('');
  const [type, setType] = useState<DeviceType>('light');
  const [model, setModel] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const [nameError, setNameError] = useState('');
  const [modelError, setModelError] = useState('');
  const [manufacturerError, setManufacturerError] = useState('');

  // 设备类型选项
  const deviceTypes: { type: DeviceType; label: string; icon: string }[] = [
    { type: 'light', label: '智能灯', icon: 'bulb' },
    { type: 'switch', label: '智能开关', icon: 'toggle' },
    { type: 'sensor', label: '传感器', icon: 'thermometer' },
    { type: 'camera', label: '摄像头', icon: 'camera' },
    { type: 'thermostat', label: '温控器', icon: 'thermometer' },
    { type: 'lock', label: '智能锁', icon: 'lock-closed' },
    { type: 'speaker', label: '音箱', icon: 'volume-high' },
    { type: 'fan', label: '风扇', icon: 'air' },
    { type: 'curtain', label: '窗帘', icon: 'resize' },
    { type: 'other', label: '其他', icon: 'hardware-chip' },
  ];

  // 房间选项
  const roomOptions = [
    '客厅', '卧室', '厨房', '卫生间', '书房', '阳台', '餐厅', '儿童房', '主卧', '次卧'
  ];

  // 验证表单
  const validateForm = (): boolean => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('请输入设备名称');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!model.trim()) {
      setModelError('请输入设备型号');
      isValid = false;
    } else {
      setModelError('');
    }

    if (!manufacturer.trim()) {
      setManufacturerError('请输入制造商');
      isValid = false;
    } else {
      setManufacturerError('');
    }

    return isValid;
  };

  // 选择图片
  const handleSelectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('权限被拒绝', '需要相册权限来选择设备图片');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('错误', '选择图片失败');
    }
  };

  // 处理添加设备
  const handleAddDevice = async () => {
    if (!validateForm()) {
      return;
    }

    const newDevice: Omit<Device, 'id' | 'createdAt' | 'updatedAt'> = {
      name: name.trim(),
      type,
      model: model.trim(),
      manufacturer: manufacturer.trim(),
      status: 'offline',
      connectionType: 'wifi',
      firmwareVersion: '1.0.0',
      lastSeen: new Date().toISOString(),
      roomName: roomName || undefined,
      capabilities: [],
      properties: {},
      settings: {
        notifications: true,
      },
      metadata: {
        description: description.trim() || undefined,
        image: image || undefined,
        tags: [type, roomName].filter(Boolean),
      },
    };

    try {
      await dispatch(addDevice(newDevice));
      Alert.alert('成功', '设备添加成功', [
        {
          text: '确定',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('错误', '添加设备失败，请重试');
    }
  };

  // 渲染设备类型选择
  const renderDeviceTypeSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>设备类型</Text>
      <View style={styles.typeGrid}>
        {deviceTypes.map((deviceType) => (
          <TouchableOpacity
            key={deviceType.type}
            style={[
              styles.typeItem,
              type === deviceType.type && styles.typeItemSelected,
            ]}
            onPress={() => setType(deviceType.type)}
          >
            <Ionicons
              name={deviceType.icon as any}
              size={24}
              color={type === deviceType.type ? Colors.primary[500] : Colors.neutral[500]}
            />
            <Text
              style={[
                styles.typeLabel,
                type === deviceType.type && styles.typeLabelSelected,
              ]}
            >
              {deviceType.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // 渲染房间选择
  const renderRoomSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>所在房间</Text>
      <View style={styles.roomGrid}>
        {roomOptions.map((room) => (
          <TouchableOpacity
            key={room}
            style={[
              styles.roomItem,
              roomName === room && styles.roomItemSelected,
            ]}
            onPress={() => setRoomName(room)}
          >
            <Text
              style={[
                styles.roomLabel,
                roomName === room && styles.roomLabelSelected,
              ]}
            >
              {room}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 设备类型选择 */}
        {renderDeviceTypeSelector()}

        {/* 基本信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>基本信息</Text>
          <Input
            label="设备名称"
            placeholder="请输入设备名称"
            value={name}
            onChangeText={setName}
            error={nameError}
            fullWidth
          />
          <Input
            label="设备型号"
            placeholder="请输入设备型号"
            value={model}
            onChangeText={setModel}
            error={modelError}
            fullWidth
          />
          <Input
            label="制造商"
            placeholder="请输入制造商"
            value={manufacturer}
            onChangeText={setManufacturer}
            error={manufacturerError}
            fullWidth
          />
        </View>

        {/* 房间选择 */}
        {renderRoomSelector()}

        {/* 设备图片 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>设备图片</Text>
          <TouchableOpacity
            style={styles.imageSelector}
            onPress={handleSelectImage}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.selectedImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera-outline" size={32} color={Colors.neutral[400]} />
                <Text style={styles.imagePlaceholderText}>选择设备图片</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* 设备描述 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>设备描述</Text>
          <Input
            label="描述"
            placeholder="请输入设备描述（可选）"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            fullWidth
          />
        </View>

        {/* 添加按钮 */}
        <View style={styles.buttonContainer}>
          <Button
            title="添加设备"
            onPress={handleAddDevice}
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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeItem: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeItemSelected: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
  },
  typeLabel: {
    ...TextStyles.caption,
    color: Colors.neutral[600],
    marginTop: 8,
    textAlign: 'center',
  },
  typeLabelSelected: {
    color: Colors.primary[500],
    fontWeight: '600',
  },
  roomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  roomItem: {
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  roomItemSelected: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  roomLabel: {
    ...TextStyles.body3,
    color: Colors.neutral[600],
  },
  roomLabelSelected: {
    color: Colors.light.onPrimary,
    fontWeight: '600',
  },
  imageSelector: {
    width: '100%',
    height: 120,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.neutral[200],
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    ...TextStyles.body3,
    color: Colors.neutral[500],
    marginTop: 8,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  buttonContainer: {
    marginBottom: 24,
  },
});

export default AddDeviceScreen; 