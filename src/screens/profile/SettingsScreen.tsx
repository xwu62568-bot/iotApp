import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/colors';
import { Fonts, TextStyles } from '../../constants/fonts';
import { ProfileStackParamList } from '../../navigation';
import { 
  selectUser, 
  updateUserPreferences,
} from '../../store/slices/authSlice';
import { t } from '../../services/api/localization';

type SettingsScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'Settings'>;

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  // 设置项状态
  const [pushNotifications, setPushNotifications] = useState(
    user?.preferences?.notifications?.push ?? true
  );
  const [emailNotifications, setEmailNotifications] = useState(
    user?.preferences?.notifications?.email ?? true
  );
  const [smsNotifications, setSmsNotifications] = useState(
    user?.preferences?.notifications?.sms ?? false
  );
  const [deviceStatusNotifications, setDeviceStatusNotifications] = useState(
    user?.preferences?.notifications?.deviceStatus ?? true
  );
  const [sceneNotifications, setSceneNotifications] = useState(
    user?.preferences?.notifications?.scene ?? true
  );

  const [darkMode, setDarkMode] = useState(
    user?.preferences?.theme === 'dark'
  );
  const [biometricAuth, setBiometricAuth] = useState(
    user?.preferences?.biometricAuth ?? false
  );
  const [autoLock, setAutoLock] = useState(
    user?.preferences?.autoLock ?? true
  );

  // 更新用户偏好设置
  const updatePreference = (key: string, value: any) => {
    dispatch(updateUserPreferences({
      [key]: value,
    }));
  };

  // 处理推送通知设置
  const handlePushNotifications = (value: boolean) => {
    setPushNotifications(value);
    updatePreference('notifications', {
      ...user?.preferences?.notifications,
      push: value,
    });
  };

  // 处理邮件通知设置
  const handleEmailNotifications = (value: boolean) => {
    setEmailNotifications(value);
    updatePreference('notifications', {
      ...user?.preferences?.notifications,
      email: value,
    });
  };

  // 处理短信通知设置
  const handleSmsNotifications = (value: boolean) => {
    setSmsNotifications(value);
    updatePreference('notifications', {
      ...user?.preferences?.notifications,
      sms: value,
    });
  };

  // 处理设备状态通知设置
  const handleDeviceStatusNotifications = (value: boolean) => {
    setDeviceStatusNotifications(value);
    updatePreference('notifications', {
      ...user?.preferences?.notifications,
      deviceStatus: value,
    });
  };

  // 处理场景通知设置
  const handleSceneNotifications = (value: boolean) => {
    setSceneNotifications(value);
    updatePreference('notifications', {
      ...user?.preferences?.notifications,
      scene: value,
    });
  };

  // 处理深色模式设置
  const handleDarkMode = (value: boolean) => {
    setDarkMode(value);
    updatePreference('theme', value ? 'dark' : 'light');
  };

  // 处理生物识别认证设置
  const handleBiometricAuth = (value: boolean) => {
    setBiometricAuth(value);
    updatePreference('biometricAuth', value);
  };

  // 处理自动锁定设置
  const handleAutoLock = (value: boolean) => {
    setAutoLock(value);
    updatePreference('autoLock', value);
  };

  // 渲染设置项
  const renderSettingItem = (
    icon: string,
    title: string,
    subtitle: string,
    value: boolean,
    onValueChange: (value: boolean) => void
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIconContainer}>
          <Ionicons name={icon as any} size={20} color={Colors.primary[500]} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: Colors.neutral[300],
          true: Colors.primary[200],
        }}
        thumbColor={value ? Colors.primary[500] : Colors.neutral[100]}
      />
    </View>
  );

  // 渲染按钮项
  const renderButtonItem = (
    icon: string,
    title: string,
    subtitle: string,
    onPress: () => void
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIconContainer}>
          <Ionicons name={icon as any} size={20} color={Colors.primary[500]} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.neutral[400]} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 通知设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>通知设置</Text>
          <View style={styles.settingContainer}>
            {renderSettingItem(
              'notifications-outline',
              '推送通知',
              '接收应用推送通知',
              pushNotifications,
              handlePushNotifications
            )}
            {renderSettingItem(
              'mail-outline',
              '邮件通知',
              '接收邮件通知',
              emailNotifications,
              handleEmailNotifications
            )}
            {renderSettingItem(
              'chatbubble-outline',
              '短信通知',
              '接收短信通知',
              smsNotifications,
              handleSmsNotifications
            )}
            {renderSettingItem(
              'hardware-chip-outline',
              '设备状态通知',
              '设备上线、离线等状态变化',
              deviceStatusNotifications,
              handleDeviceStatusNotifications
            )}
            {renderSettingItem(
              'layers-outline',
              '场景执行通知',
              '智能场景执行结果通知',
              sceneNotifications,
              handleSceneNotifications
            )}
          </View>
        </View>

        {/* 显示设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>显示设置</Text>
          <View style={styles.settingContainer}>
            {renderSettingItem(
              'moon-outline',
              '深色模式',
              '使用深色主题',
              darkMode,
              handleDarkMode
            )}
          </View>
        </View>

        {/* 安全设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>安全设置</Text>
          <View style={styles.settingContainer}>
            {renderSettingItem(
              'finger-print-outline',
              '生物识别认证',
              '使用指纹或面部识别登录',
              biometricAuth,
              handleBiometricAuth
            )}
            {renderSettingItem(
              'lock-closed-outline',
              '自动锁定',
              '应用进入后台时自动锁定',
              autoLock,
              handleAutoLock
            )}
            {renderButtonItem(
              'key-outline',
              '修改密码',
              '更改您的登录密码',
              () => Alert.alert('修改密码', '修改密码功能')
            )}
          </View>
        </View>

        {/* 其他设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>其他设置</Text>
          <View style={styles.settingContainer}>
            {renderButtonItem(
              'cloud-download-outline',
              '数据同步',
              '同步设备和场景数据',
              () => Alert.alert('数据同步', '正在同步数据...')
            )}
            {renderButtonItem(
              'trash-outline',
              '清除缓存',
              '清除应用缓存数据',
              () => {
                Alert.alert(
                  '清除缓存',
                  '确定要清除所有缓存数据吗？',
                  [
                    { text: '取消', style: 'cancel' },
                    { text: '清除', onPress: () => Alert.alert('成功', '缓存已清除') },
                  ]
                );
              }
            )}
            {renderButtonItem(
              'refresh-outline',
              '重置设置',
              '恢复到默认设置',
              () => {
                Alert.alert(
                  '重置设置',
                  '确定要重置所有设置吗？此操作不可撤销。',
                  [
                    { text: '取消', style: 'cancel' },
                    { text: '重置', style: 'destructive', onPress: () => Alert.alert('成功', '设置已重置') },
                  ]
                );
              }
            )}
          </View>
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
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...TextStyles.h6,
    color: Colors.neutral[700],
    marginHorizontal: 16,
    marginBottom: 8,
  },
  settingContainer: {
    backgroundColor: Colors.light.surface,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...TextStyles.body1,
    color: Colors.light.onSurface,
    marginBottom: 2,
  },
  settingSubtitle: {
    ...TextStyles.caption,
    color: Colors.neutral[500],
  },
});

export default SettingsScreen;