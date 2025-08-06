import { Platform } from 'react-native';

export interface PermissionConfig {
  name: string;
  title: string;
  message: string;
  required: boolean;
  platforms: ('ios' | 'android')[];
}

export const PERMISSIONS: PermissionConfig[] = [
  {
    name: 'camera',
    title: '相机权限',
    message: '需要相机权限来扫描设备二维码和拍照',
    required: true,
    platforms: ['ios', 'android'],
  },
  {
    name: 'photoLibrary',
    title: '相册权限',
    message: '需要相册权限来选择设备图片',
    required: false,
    platforms: ['ios', 'android'],
  },
  {
    name: 'location',
    title: '位置权限',
    message: '需要位置权限来发现附近的智能设备',
    required: true,
    platforms: ['ios', 'android'],
  },
  {
    name: 'notifications',
    title: '通知权限',
    message: '需要通知权限来接收设备状态变化提醒',
    required: false,
    platforms: ['ios', 'android'],
  },
  {
    name: 'microphone',
    title: '麦克风权限',
    message: '需要麦克风权限来进行语音控制',
    required: false,
    platforms: ['ios', 'android'],
  },
  {
    name: 'bluetooth',
    title: '蓝牙权限',
    message: '需要蓝牙权限来连接蓝牙设备',
    required: false,
    platforms: ['ios', 'android'],
  },
];

// 获取当前平台需要的权限
export const getPlatformPermissions = (): PermissionConfig[] => {
  const currentPlatform = Platform.OS as 'ios' | 'android';
  return PERMISSIONS.filter(permission => 
    permission.platforms.includes(currentPlatform)
  );
};

// 获取必需权限
export const getRequiredPermissions = (): PermissionConfig[] => {
  return PERMISSIONS.filter(permission => permission.required);
};

// 获取可选权限
export const getOptionalPermissions = (): PermissionConfig[] => {
  return PERMISSIONS.filter(permission => !permission.required);
}; 