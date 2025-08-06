import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '../../config/environments';
import { LanguageConfig, TranslationData, LocalizationState } from '../../types/api';

// 支持的语言配置
export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: 'zh-CN',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    direction: 'ltr',
  },
  {
    code: 'zh-TW',
    name: 'Chinese (Traditional)',
    nativeName: '繁體中文',
    direction: 'ltr',
  },
  {
    code: 'en-US',
    name: 'English (US)',
    nativeName: 'English',
    direction: 'ltr',
  },
  {
    code: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr',
  },
  {
    code: 'ko-KR',
    name: 'Korean',
    nativeName: '한국어',
    direction: 'ltr',
  },
];

// 默认语言文件（本地缓存）
const DEFAULT_TRANSLATIONS: Record<string, TranslationData> = {
  'zh-CN': {
    common: {
      loading: '加载中...',
      error: '错误',
      success: '成功',
      cancel: '取消',
      confirm: '确认',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      add: '添加',
      search: '搜索',
      refresh: '刷新',
      retry: '重试',
      close: '关闭',
      back: '返回',
      next: '下一步',
      previous: '上一步',
      done: '完成',
      yes: '是',
      no: '否',
      ok: '确定',
    },
    auth: {
      login: '登录',
      register: '注册',
      logout: '退出登录',
      email: '邮箱',
      password: '密码',
      confirmPassword: '确认密码',
      forgotPassword: '忘记密码？',
      resetPassword: '重置密码',
      loginSuccess: '登录成功',
      registerSuccess: '注册成功',
      logoutSuccess: '退出成功',
      invalidEmail: '邮箱格式不正确',
      invalidPassword: '密码长度至少6位',
      passwordMismatch: '两次输入的密码不一致',
      emailRequired: '请输入邮箱',
      passwordRequired: '请输入密码',
      nameRequired: '请输入姓名',
      welcomeBack: '欢迎回到智能家居',
      emailPlaceholder: '请输入邮箱地址',
      passwordPlaceholder: '请输入密码',
      noAccount: '还没有账号？',
      termsAgreement: '登录即表示您同意我们的服务条款和隐私政策',
    },
    devices: {
      title: '设备',
      addDevice: '添加设备',
      deviceList: '设备列表',
      deviceDetails: '设备详情',
      deviceSettings: '设备设置',
      deviceName: '设备名称',
      deviceType: '设备类型',
      deviceStatus: '设备状态',
      online: '在线',
      offline: '离线',
      error: '错误',
      maintenance: '维护中',
      power: '电源',
      brightness: '亮度',
      temperature: '温度',
      humidity: '湿度',
      motion: '移动检测',
      contact: '门窗状态',
      battery: '电池电量',
      signal: '信号强度',
      lastSeen: '最后在线',
      firmwareVersion: '固件版本',
      ipAddress: 'IP地址',
      macAddress: 'MAC地址',
      manufacturer: '制造商',
      model: '型号',
      room: '房间',
      capabilities: '功能',
      settings: '设置',
      autoOff: '自动关闭',
      autoOffDelay: '自动关闭延时',
      brightnessLimit: '亮度限制',
      temperatureLimit: '温度限制',
      notifications: '通知',
    },
    scenes: {
      title: '场景',
      addScene: '添加场景',
      sceneList: '场景列表',
      sceneDetails: '场景详情',
      sceneSettings: '场景设置',
      sceneName: '场景名称',
      sceneDescription: '场景描述',
      sceneType: '场景类型',
      manual: '手动',
      scheduled: '定时',
      triggered: '触发',
      conditions: '条件',
      actions: '动作',
      triggers: '触发器',
      time: '时间',
      device: '设备',
      sensor: '传感器',
      location: '位置',
      weather: '天气',
      startTime: '开始时间',
      endTime: '结束时间',
      days: '重复日期',
      monday: '周一',
      tuesday: '周二',
      wednesday: '周三',
      thursday: '周四',
      friday: '周五',
      saturday: '周六',
      sunday: '周日',
      execute: '执行',
      pause: '暂停',
      stop: '停止',
      edit: '编辑',
      delete: '删除',
      duplicate: '复制',
      share: '分享',
    },
    profile: {
      title: '个人设置',
      account: '账户',
      preferences: '偏好设置',
      notifications: '通知设置',
      privacy: '隐私设置',
      about: '关于',
      help: '帮助',
      feedback: '反馈',
      logout: '退出登录',
      name: '姓名',
      email: '邮箱',
      phone: '电话',
      avatar: '头像',
      language: '语言',
      theme: '主题',
      light: '浅色',
      dark: '深色',
      auto: '自动',
      deviceStatus: '设备状态',
      sceneExecution: '场景执行',
      securityAlerts: '安全警报',
      maintenanceReminders: '维护提醒',
      marketing: '营销信息',
      dataCollection: '数据收集',
      analytics: '分析',
      crashReports: '崩溃报告',
      version: '版本',
      buildNumber: '构建号',
      termsOfService: '服务条款',
      privacyPolicy: '隐私政策',
      contactUs: '联系我们',
    },
    errors: {
      networkError: '网络错误',
      serverError: '服务器错误',
      unknownError: '未知错误',
      permissionDenied: '权限被拒绝',
      deviceNotFound: '设备未找到',
      sceneNotFound: '场景未找到',
      invalidCredentials: '用户名或密码错误',
      emailAlreadyExists: '邮箱已存在',
      weakPassword: '密码强度不够',
      tooManyRequests: '请求过于频繁',
      connectionTimeout: '连接超时',
      deviceOffline: '设备离线',
      operationFailed: '操作失败',
      invalidInput: '输入无效',
    },
  },
  'en-US': {
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      refresh: 'Refresh',
      retry: 'Retry',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      done: 'Done',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
    },
    auth: {
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot Password?',
      resetPassword: 'Reset Password',
      loginSuccess: 'Login successful',
      registerSuccess: 'Registration successful',
      logoutSuccess: 'Logout successful',
      invalidEmail: 'Invalid email format',
      invalidPassword: 'Password must be at least 6 characters',
      passwordMismatch: 'Passwords do not match',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      nameRequired: 'Name is required',
      welcomeBack: 'Welcome back to Smart Home',
      emailPlaceholder: 'Enter your email address',
      passwordPlaceholder: 'Enter your password',
      noAccount: "Don't have an account?",
      termsAgreement: 'By logging in, you agree to our Terms of Service and Privacy Policy',
    },
    devices: {
      title: 'Devices',
      addDevice: 'Add Device',
      deviceList: 'Device List',
      deviceDetails: 'Device Details',
      deviceSettings: 'Device Settings',
      deviceName: 'Device Name',
      deviceType: 'Device Type',
      deviceStatus: 'Device Status',
      online: 'Online',
      offline: 'Offline',
      error: 'Error',
      maintenance: 'Maintenance',
      power: 'Power',
      brightness: 'Brightness',
      temperature: 'Temperature',
      humidity: 'Humidity',
      motion: 'Motion',
      contact: 'Contact',
      battery: 'Battery',
      signal: 'Signal',
      lastSeen: 'Last Seen',
      firmwareVersion: 'Firmware Version',
      ipAddress: 'IP Address',
      macAddress: 'MAC Address',
      manufacturer: 'Manufacturer',
      model: 'Model',
      room: 'Room',
      capabilities: 'Capabilities',
      settings: 'Settings',
      autoOff: 'Auto Off',
      autoOffDelay: 'Auto Off Delay',
      brightnessLimit: 'Brightness Limit',
      temperatureLimit: 'Temperature Limit',
      notifications: 'Notifications',
    },
    scenes: {
      title: 'Scenes',
      addScene: 'Add Scene',
      sceneList: 'Scene List',
      sceneDetails: 'Scene Details',
      sceneSettings: 'Scene Settings',
      sceneName: 'Scene Name',
      sceneDescription: 'Scene Description',
      sceneType: 'Scene Type',
      manual: 'Manual',
      scheduled: 'Scheduled',
      triggered: 'Triggered',
      conditions: 'Conditions',
      actions: 'Actions',
      triggers: 'Triggers',
      time: 'Time',
      device: 'Device',
      sensor: 'Sensor',
      location: 'Location',
      weather: 'Weather',
      startTime: 'Start Time',
      endTime: 'End Time',
      days: 'Repeat Days',
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
      execute: 'Execute',
      pause: 'Pause',
      stop: 'Stop',
      edit: 'Edit',
      delete: 'Delete',
      duplicate: 'Duplicate',
      share: 'Share',
    },
    profile: {
      title: 'Profile',
      account: 'Account',
      preferences: 'Preferences',
      notifications: 'Notifications',
      privacy: 'Privacy',
      about: 'About',
      help: 'Help',
      feedback: 'Feedback',
      logout: 'Logout',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      avatar: 'Avatar',
      language: 'Language',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      auto: 'Auto',
      deviceStatus: 'Device Status',
      sceneExecution: 'Scene Execution',
      securityAlerts: 'Security Alerts',
      maintenanceReminders: 'Maintenance Reminders',
      marketing: 'Marketing',
      dataCollection: 'Data Collection',
      analytics: 'Analytics',
      crashReports: 'Crash Reports',
      version: 'Version',
      buildNumber: 'Build Number',
      termsOfService: 'Terms of Service',
      privacyPolicy: 'Privacy Policy',
      contactUs: 'Contact Us',
    },
    errors: {
      networkError: 'Network Error',
      serverError: 'Server Error',
      unknownError: 'Unknown Error',
      permissionDenied: 'Permission Denied',
      deviceNotFound: 'Device Not Found',
      sceneNotFound: 'Scene Not Found',
      invalidCredentials: 'Invalid Credentials',
      emailAlreadyExists: 'Email Already Exists',
      weakPassword: 'Weak Password',
      tooManyRequests: 'Too Many Requests',
      connectionTimeout: 'Connection Timeout',
      deviceOffline: 'Device Offline',
      operationFailed: 'Operation Failed',
      invalidInput: 'Invalid Input',
    },
  },
};

export class LocalizationService {
  private i18n: I18n;
  private state: LocalizationState = {
    currentLanguage: 'zh-CN',
    availableLanguages: SUPPORTED_LANGUAGES,
    translations: {},
    loading: false,
    error: null,
  };

  constructor() {
    this.i18n = new I18n(DEFAULT_TRANSLATIONS);
    // 不在构造函数中初始化，避免启动时崩溃
    // this.initialize();
  }

  // 初始化本地化服务
  async initialize(): Promise<void> {
    try {
      // 获取保存的语言设置
      const savedLanguage = await AsyncStorage.getItem('userLanguage');
      const deviceLanguage = Localization.getLocales()[0]?.languageTag || 'zh-CN';
      
      // 确定使用的语言
      let language = savedLanguage || this.getBestMatchLanguage(deviceLanguage);
      
      // 设置语言
      await this.setLanguage(language);
      
      // 从服务器获取最新的翻译文件（可选，失败时使用本地翻译）
      try {
        await this.fetchTranslations(language);
      } catch (error) {
        console.warn('Failed to fetch translations from server, using local defaults:', error);
        // 确保使用本地翻译
        this.i18n.translations[language] = DEFAULT_TRANSLATIONS[language] || DEFAULT_TRANSLATIONS['zh-CN'];
      }
    } catch (error) {
      console.error('Failed to initialize localization:', error);
      // 使用默认语言和本地翻译
      this.i18n.locale = 'zh-CN';
      this.i18n.translations['zh-CN'] = DEFAULT_TRANSLATIONS['zh-CN'];
    }
  }

  // 获取最佳匹配的语言
  private getBestMatchLanguage(deviceLanguage: string): string {
    const languageCode = deviceLanguage.split('-')[0];
    
    // 查找支持的语言
    const supportedLanguage = SUPPORTED_LANGUAGES.find(lang => 
      lang.code.startsWith(languageCode)
    );
    
    return supportedLanguage?.code || 'zh-CN';
  }

  // 设置语言
  async setLanguage(languageCode: string): Promise<void> {
    try {
      this.state.loading = true;
      this.state.error = null;

      // 验证语言是否支持
      const isSupported = SUPPORTED_LANGUAGES.some(lang => lang.code === languageCode);
      if (!isSupported) {
        throw new Error(`Language ${languageCode} is not supported`);
      }

      // 设置i18n语言
      this.i18n.locale = languageCode;
      this.state.currentLanguage = languageCode;

      // 保存到本地存储
      await AsyncStorage.setItem('userLanguage', languageCode);

      // 确保有本地翻译可用
      if (!this.i18n.translations[languageCode]) {
        this.i18n.translations[languageCode] = DEFAULT_TRANSLATIONS[languageCode] || DEFAULT_TRANSLATIONS['zh-CN'];
      }

      // 尝试从服务器获取最新翻译文件（可选）
      try {
        await this.fetchTranslations(languageCode);
      } catch (error) {
        console.warn('Failed to fetch translations from server, using local defaults:', error);
      }
    } catch (error) {
      this.state.error = (error as Error).message;
      console.error('Failed to set language:', error);
    } finally {
      this.state.loading = false;
    }
  }

  // 从服务器获取翻译文件
  private async fetchTranslations(languageCode: string): Promise<void> {
    try {
      // 设置超时时间
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时
      
      const response = await fetch(`${ENV.apiUrl}/api/translations/${languageCode}`, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const translations = await response.json();
        this.i18n.translations[languageCode] = translations;
        this.state.translations = translations;
      } else {
        // 如果服务器返回错误，使用本地默认翻译
        console.warn('Server returned error, using local defaults');
        this.i18n.translations[languageCode] = DEFAULT_TRANSLATIONS[languageCode] || DEFAULT_TRANSLATIONS['zh-CN'];
      }
    } catch (error) {
      console.error('Failed to fetch translations:', error);
      // 使用本地默认翻译
      this.i18n.translations[languageCode] = DEFAULT_TRANSLATIONS[languageCode] || DEFAULT_TRANSLATIONS['zh-CN'];
    }
  }

  // 翻译文本
  t(key: string, params?: Record<string, any>): string {
    return this.i18n.t(key, params);
  }

  // 获取当前语言
  getCurrentLanguage(): string {
    return this.state.currentLanguage;
  }

  // 获取支持的语言列表
  getAvailableLanguages(): LanguageConfig[] {
    return this.state.availableLanguages;
  }

  // 获取当前语言配置
  getCurrentLanguageConfig(): LanguageConfig | undefined {
    return this.state.availableLanguages.find(lang => lang.code === this.state.currentLanguage);
  }

  // 获取状态
  getState(): LocalizationState {
    return { ...this.state };
  }

  // 检查是否为RTL语言
  isRTL(): boolean {
    const currentLang = this.getCurrentLanguageConfig();
    return currentLang?.direction === 'rtl';
  }

  // 格式化数字
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(this.state.currentLanguage, options).format(number);
  }

  // 格式化日期
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat(this.state.currentLanguage, options).format(date);
  }

  // 格式化货币
  formatCurrency(amount: number, currency: string = 'CNY'): string {
    return new Intl.NumberFormat(this.state.currentLanguage, {
      style: 'currency',
      currency,
    }).format(amount);
  }
}

// 创建本地化服务实例
export const localizationService = new LocalizationService();

// 导出翻译函数
export const t = (key: string, params?: Record<string, any>): string => {
  return localizationService.t(key, params);
};

export default localizationService; 