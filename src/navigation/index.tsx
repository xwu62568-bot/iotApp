import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { selectIsAuthenticated } from '../store/slices/authSlice';

// 导入页面组件
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

import DevicesScreen from '../screens/devices/DevicesScreen';
import DeviceDetailScreen from '../screens/devices/DeviceDetailScreen';
import AddDeviceScreen from '../screens/devices/AddDeviceScreen';

import ScenesScreen from '../screens/scenes/ScenesScreen';
import SceneDetailScreen from '../screens/scenes/SceneDetailScreen';
import AddSceneScreen from '../screens/scenes/AddSceneScreen';

import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import LanguageScreen from '../screens/profile/LanguageScreen';

// 导入图标组件
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

// 定义导航类型
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Devices: undefined;
  Scenes: undefined;
  Profile: undefined;
};

export type DevicesStackParamList = {
  DevicesList: undefined;
  DeviceDetail: { deviceId: string };
  AddDevice: undefined;
};

export type ScenesStackParamList = {
  ScenesList: undefined;
  SceneDetail: { sceneId: string };
  AddScene: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Settings: undefined;
  Language: undefined;
};

// 创建导航器
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator<AuthStackParamList>();
const DevicesStack = createStackNavigator<DevicesStackParamList>();
const ScenesStack = createStackNavigator<ScenesStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();

// 认证导航
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Colors.light.background },
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
};

// 设备导航
const DevicesNavigator = () => {
  return (
    <DevicesStack.Navigator
      id={undefined}
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.light.surface,
        },
        headerTintColor: Colors.light.onSurface,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <DevicesStack.Screen 
        name="DevicesList" 
        component={DevicesScreen}
        options={{ title: '设备' }}
      />
      <DevicesStack.Screen 
        name="DeviceDetail" 
        component={DeviceDetailScreen}
        options={{ title: '设备详情' }}
      />
      <DevicesStack.Screen 
        name="AddDevice" 
        component={AddDeviceScreen}
        options={{ title: '添加设备' }}
      />
    </DevicesStack.Navigator>
  );
};

// 场景导航
const ScenesNavigator = () => {
  return (
    <ScenesStack.Navigator
      id={undefined}
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.light.surface,
        },
        headerTintColor: Colors.light.onSurface,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <ScenesStack.Screen 
        name="ScenesList" 
        component={ScenesScreen}
        options={{ title: '场景' }}
      />
      <ScenesStack.Screen 
        name="SceneDetail" 
        component={SceneDetailScreen}
        options={{ title: '场景详情' }}
      />
      <ScenesStack.Screen 
        name="AddScene" 
        component={AddSceneScreen}
        options={{ title: '添加场景' }}
      />
    </ScenesStack.Navigator>
  );
};

// 个人设置导航
const ProfileNavigator = () => {
  return (
    <ProfileStack.Navigator
      id={undefined}
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.light.surface,
        },
        headerTintColor: Colors.light.onSurface,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <ProfileStack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{ title: '个人设置' }}
      />
      <ProfileStack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: '设置' }}
      />
      <ProfileStack.Screen 
        name="Language" 
        component={LanguageScreen}
        options={{ title: '语言设置' }}
      />
    </ProfileStack.Navigator>
  );
};

// 主标签导航
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Devices') {
            iconName = focused ? 'bulb' : 'bulb-outline';
          } else if (route.name === 'Scenes') {
            iconName = focused ? 'layers' : 'layers-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary[500],
        tabBarInactiveTintColor: Colors.neutral[500],
        tabBarStyle: {
          backgroundColor: Colors.light.surface,
          borderTopColor: Colors.neutral[200],
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Devices" 
        component={DevicesNavigator}
        options={{ title: '设备' }}
      />
      <Tab.Screen 
        name="Scenes" 
        component={ScenesNavigator}
        options={{ title: '场景' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileNavigator}
        options={{ title: '我的' }}
      />
    </Tab.Navigator>
  );
};

// 主导航容器
const AppNavigator = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator; 