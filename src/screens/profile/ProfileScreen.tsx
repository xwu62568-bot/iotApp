import React from 'react';
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

import { Colors } from '../../constants/colors';
import { Fonts, TextStyles } from '../../constants/fonts';
import { ProfileStackParamList } from '../../navigation';
import { selectUser, logoutUser } from '../../store/slices/authSlice';
import { t } from '../../services/api/localization';

type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'ProfileMain'>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  // 处理登出
  const handleLogout = () => {
    Alert.alert(
      '退出登录',
      '确定要退出登录吗？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '退出',
          style: 'destructive',
          onPress: () => {
            dispatch(logoutUser());
          },
        },
      ]
    );
  };

  // 渲染用户信息
  const renderUserInfo = () => (
    <View style={styles.userInfoContainer}>
      <View style={styles.avatarContainer}>
        {user?.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={40} color={Colors.neutral[400]} />
          </View>
        )}
      </View>
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{user?.name || '用户'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        {user?.phone && (
          <Text style={styles.userPhone}>{user.phone}</Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          // 导航到编辑个人信息页面
          Alert.alert('编辑信息', '编辑个人信息功能');
        }}
      >
        <Ionicons name="pencil" size={20} color={Colors.primary[500]} />
      </TouchableOpacity>
    </View>
  );

  // 渲染菜单项
  const renderMenuItem = (
    icon: string,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    showArrow: boolean = true
  ) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconContainer}>
          <Ionicons name={icon as any} size={20} color={Colors.primary[500]} />
        </View>
        <View style={styles.menuItemContent}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color={Colors.neutral[400]} />
      )}
    </TouchableOpacity>
  );

  // 渲染设置菜单
  const renderSettingsMenu = () => (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>设置</Text>
      <View style={styles.menuContainer}>
        {renderMenuItem(
          'settings-outline',
          '应用设置',
          '通知、隐私、主题等',
          () => navigation.navigate('Settings')
        )}
        {renderMenuItem(
          'language-outline',
          '语言设置',
          user?.preferences?.language === 'zh-CN' ? '简体中文' : 'English',
          () => navigation.navigate('Language')
        )}
        {renderMenuItem(
          'notifications-outline',
          '通知设置',
          '设备状态、场景执行等',
          () => {
            Alert.alert('通知设置', '通知设置功能');
          }
        )}
        {renderMenuItem(
          'shield-checkmark-outline',
          '隐私设置',
          '数据收集、分析等',
          () => {
            Alert.alert('隐私设置', '隐私设置功能');
          }
        )}
      </View>
    </View>
  );

  // 渲染帮助菜单
  const renderHelpMenu = () => (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>帮助与支持</Text>
      <View style={styles.menuContainer}>
        {renderMenuItem(
          'help-circle-outline',
          '帮助中心',
          '常见问题解答',
          () => {
            Alert.alert('帮助中心', '帮助中心功能');
          }
        )}
        {renderMenuItem(
          'chatbubble-outline',
          '意见反馈',
          '告诉我们您的想法',
          () => {
            Alert.alert('意见反馈', '意见反馈功能');
          }
        )}
        {renderMenuItem(
          'information-circle-outline',
          '关于应用',
          `版本 ${user?.preferences?.version || '1.0.0'}`,
          () => {
            Alert.alert('关于应用', '关于应用信息');
          }
        )}
      </View>
    </View>
  );

  // 渲染账户菜单
  const renderAccountMenu = () => (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>账户</Text>
      <View style={styles.menuContainer}>
        {renderMenuItem(
          'person-outline',
          '账户信息',
          '查看和编辑账户信息',
          () => {
            Alert.alert('账户信息', '账户信息功能');
          }
        )}
        {renderMenuItem(
          'key-outline',
          '修改密码',
          '更改登录密码',
          () => {
            Alert.alert('修改密码', '修改密码功能');
          }
        )}
        {renderMenuItem(
          'log-out-outline',
          '退出登录',
          '安全退出当前账户',
          handleLogout,
          false
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 用户信息 */}
        {renderUserInfo()}

        {/* 设置菜单 */}
        {renderSettingsMenu()}

        {/* 帮助菜单 */}
        {renderHelpMenu()}

        {/* 账户菜单 */}
        {renderAccountMenu()}

        {/* 底部信息 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            智能家居 v1.0.0
          </Text>
          <Text style={styles.footerSubtext}>
            让生活更智能
          </Text>
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
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    ...TextStyles.h4,
    color: Colors.light.onSurface,
    marginBottom: 4,
  },
  userEmail: {
    ...TextStyles.body2,
    color: Colors.neutral[600],
    marginBottom: 2,
  },
  userPhone: {
    ...TextStyles.body3,
    color: Colors.neutral[500],
  },
  editButton: {
    padding: 8,
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...TextStyles.h6,
    color: Colors.neutral[700],
    marginHorizontal: 16,
    marginBottom: 8,
  },
  menuContainer: {
    backgroundColor: Colors.light.surface,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    ...TextStyles.body1,
    color: Colors.light.onSurface,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    ...TextStyles.caption,
    color: Colors.neutral[500],
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  footerText: {
    ...TextStyles.body2,
    color: Colors.neutral[600],
    marginBottom: 4,
  },
  footerSubtext: {
    ...TextStyles.caption,
    color: Colors.neutral[500],
  },
});

export default ProfileScreen; 