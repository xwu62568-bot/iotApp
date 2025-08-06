import { Platform, Alert, Linking } from 'react-native';
import * as Camera from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import { getPlatformPermissions, PERMISSIONS } from '../../config/permissions';
import { store } from '../../store';
import { setPermission, setPermissionLoading, setPermissionError } from '../../store/slices/permissionSlice';

export class PermissionService {
  // 请求单个权限
  static async requestPermission(permissionName: string): Promise<boolean> {
    try {
      store.dispatch(setPermissionLoading(true));
      store.dispatch(setPermissionError(null));

      let granted = false;

      switch (permissionName) {
        case 'camera':
          granted = await this.requestCameraPermission();
          break;
        case 'photoLibrary':
          granted = await this.requestPhotoLibraryPermission();
          break;
        case 'location':
          granted = await this.requestLocationPermission();
          break;
        case 'notifications':
          granted = await this.requestNotificationPermission();
          break;
        case 'microphone':
          granted = await this.requestMicrophonePermission();
          break;
        default:
          throw new Error(`Unsupported permission: ${permissionName}`);
      }

      store.dispatch(setPermission({ permission: permissionName, granted }));
      return granted;
    } catch (error) {
      const errorMessage = (error as Error).message;
      store.dispatch(setPermissionError(errorMessage));
      store.dispatch(setPermission({ permission: permissionName, granted: false }));
      return false;
    } finally {
      store.dispatch(setPermissionLoading(false));
    }
  }

  // 请求相机权限
  private static async requestCameraPermission(): Promise<boolean> {
    const { status } = await Camera.requestCameraPermissionsAsync();
    return status === 'granted';
  }

  // 请求相册权限
  private static async requestPhotoLibraryPermission(): Promise<boolean> {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  }

  // 请求位置权限
  private static async requestLocationPermission(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  // 请求通知权限
  private static async requestNotificationPermission(): Promise<boolean> {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  // 请求麦克风权限
  private static async requestMicrophonePermission(): Promise<boolean> {
    const { status } = await Camera.requestMicrophonePermissionsAsync();
    return status === 'granted';
  }

  // 检查权限状态
  static async checkPermission(permissionName: string): Promise<boolean> {
    try {
      let granted = false;

      switch (permissionName) {
        case 'camera':
          const cameraStatus = await Camera.getCameraPermissionsAsync();
          granted = cameraStatus.status === 'granted';
          break;
        case 'photoLibrary':
          const mediaStatus = await MediaLibrary.getPermissionsAsync();
          granted = mediaStatus.status === 'granted';
          break;
        case 'location':
          const locationStatus = await Location.getForegroundPermissionsAsync();
          granted = locationStatus.status === 'granted';
          break;
        case 'notifications':
          const notificationStatus = await Notifications.getPermissionsAsync();
          granted = notificationStatus.status === 'granted';
          break;
        case 'microphone':
          const microphoneStatus = await Camera.getMicrophonePermissionsAsync();
          granted = microphoneStatus.status === 'granted';
          break;
        default:
          return false;
      }

      store.dispatch(setPermission({ permission: permissionName, granted }));
      return granted;
    } catch (error) {
      console.error(`Error checking permission ${permissionName}:`, error);
      return false;
    }
  }

  // 请求所有必需权限
  static async requestRequiredPermissions(): Promise<Record<string, boolean>> {
    const requiredPermissions = PERMISSIONS.filter(p => p.required);
    const results: Record<string, boolean> = {};

    for (const permission of requiredPermissions) {
      results[permission.name] = await this.requestPermission(permission.name);
    }

    return results;
  }

  // 请求所有可选权限
  static async requestOptionalPermissions(): Promise<Record<string, boolean>> {
    const optionalPermissions = PERMISSIONS.filter(p => !p.required);
    const results: Record<string, boolean> = {};

    for (const permission of optionalPermissions) {
      results[permission.name] = await this.requestPermission(permission.name);
    }

    return results;
  }

  // 检查所有权限状态
  static async checkAllPermissions(): Promise<Record<string, boolean>> {
    const platformPermissions = getPlatformPermissions();
    const results: Record<string, boolean> = {};

    for (const permission of platformPermissions) {
      results[permission.name] = await this.checkPermission(permission.name);
    }

    return results;
  }

  // 显示权限说明对话框
  static showPermissionExplanation(permissionName: string): Promise<boolean> {
    return new Promise((resolve) => {
      const permission = PERMISSIONS.find(p => p.name === permissionName);
      if (!permission) {
        resolve(false);
        return;
      }

      Alert.alert(
        permission.title,
        permission.message,
        [
          {
            text: '取消',
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: '去设置',
            onPress: () => {
              this.openAppSettings();
              resolve(false);
            },
          },
        ]
      );
    });
  }

  // 打开应用设置
  static async openAppSettings(): Promise<void> {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error('Failed to open settings:', error);
    }
  }

  // 检查权限是否被永久拒绝
  static async isPermissionPermanentlyDenied(permissionName: string): Promise<boolean> {
    try {
      let status = '';

      switch (permissionName) {
        case 'camera':
          const cameraStatus = await Camera.getCameraPermissionsAsync();
          status = cameraStatus.status;
          break;
        case 'photoLibrary':
          const mediaStatus = await MediaLibrary.getPermissionsAsync();
          status = mediaStatus.status;
          break;
        case 'location':
          const locationStatus = await Location.getForegroundPermissionsAsync();
          status = locationStatus.status;
          break;
        case 'notifications':
          const notificationStatus = await Notifications.getPermissionsAsync();
          status = notificationStatus.status;
          break;
        case 'microphone':
          const microphoneStatus = await Camera.getMicrophonePermissionsAsync();
          status = microphoneStatus.status;
          break;
        default:
          return false;
      }

      // 在iOS上，如果权限被拒绝且不能再次请求，则认为是永久拒绝
      if (Platform.OS === 'ios') {
        return status === 'denied';
      }

      // 在Android上，需要检查是否应该显示权限说明
      return status === 'denied';
    } catch (error) {
      console.error(`Error checking if permission is permanently denied: ${permissionName}`, error);
      return false;
    }
  }

  // 批量请求权限
  static async requestMultiplePermissions(permissionNames: string[]): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    for (const permissionName of permissionNames) {
      results[permissionName] = await this.requestPermission(permissionName);
    }

    return results;
  }

  // 获取权限配置信息
  static getPermissionConfig(permissionName: string) {
    return PERMISSIONS.find(p => p.name === permissionName);
  }

  // 获取所有权限配置
  static getAllPermissionConfigs() {
    return getPlatformPermissions();
  }
}

export default PermissionService; 