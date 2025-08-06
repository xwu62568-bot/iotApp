# 智能家居 IoT 应用

一个功能完整的 React Native 智能家居应用，使用 Expo 开发框架构建。

## 🚀 功能特性

### 核心功能
- 🔐 **用户认证** - 使用 Supabase 进行注册、登录、密码重置
- 📱 **设备管理** - 添加、控制、监控 IoT 设备
- 🎬 **智能场景** - 创建和执行自动化场景
- ⚙️ **个人设置** - 用户偏好、通知、主题等设置

### 技术特性
- 🌐 **实时通信** - WebSocket 连接用于设备状态同步
- 🌍 **多语言支持** - 支持中文、英文，语言包从服务器获取
- 🔧 **多环境配置** - 开发、测试、生产环境配置
- 📱 **权限管理** - 相机、相册、位置等权限请求和管理
- 🎨 **响应式设计** - 适配不同屏幕尺寸和平台差异

## 📦 技术栈

### 核心框架
- **React Native** - 跨平台移动应用开发
- **Expo** - React Native 开发工具链
- **TypeScript** - 类型安全的 JavaScript

### 状态管理
- **Redux Toolkit** - 全局状态管理
- **React Redux** - React-Redux 绑定

### 导航
- **React Navigation v6** - 应用导航
- **Stack Navigator** - 堆栈导航
- **Bottom Tab Navigator** - 底部标签导航

### 后端服务
- **Supabase** - 身份验证和数据库
- **WebSocket** - 实时通信

### UI 组件
- **React Native Safe Area Context** - 安全区域处理
- **Expo Vector Icons** - 图标库
- **React Native Gesture Handler** - 手势处理

### 权限和功能
- **Expo Camera** - 相机功能
- **Expo Image Picker** - 图片选择
- **Expo Media Library** - 媒体库访问
- **Expo Location** - 位置服务
- **Expo Notifications** - 推送通知

### 国际化
- **Expo Localization** - 本地化服务
- **i18n-js** - 国际化框架

## 🏗️ 项目结构

```
src/
├── components/          # 可复用组件
│   └── common/         # 通用 UI 组件
├── screens/            # 页面组件
│   ├── auth/          # 认证相关页面
│   ├── devices/       # 设备管理页面
│   ├── scenes/        # 场景管理页面
│   └── profile/       # 个人设置页面
├── navigation/         # 导航配置
├── store/             # Redux 状态管理
│   └── slices/        # Redux Toolkit 切片
├── services/          # 服务层
│   ├── api/           # API 相关服务
│   ├── websocket/     # WebSocket 服务
│   └── permissions/   # 权限管理服务
├── types/             # TypeScript 类型定义
├── constants/         # 常量定义
│   ├── colors.ts      # 颜色主题
│   └── fonts.ts       # 字体样式
├── config/            # 配置文件
│   ├── environments/  # 环境配置
│   └── permissions/   # 权限配置
├── utils/             # 工具函数
├── hooks/             # 自定义 Hooks
└── assets/            # 静态资源
```

## 🛠️ 开发环境设置

### 前置要求
- Node.js 16+ 
- npm 或 yarn
- Expo CLI
- iOS 模拟器 (macOS) 或 Android 模拟器

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd iot-smart-home
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   ```bash
   cp env.example .env
   # 编辑 .env 文件，填入实际的配置值
   ```

4. **启动开发服务器**
   ```bash
   npm start
   # 或
   expo start
   ```

5. **在设备上运行**
   - iOS: 按 `i` 在 iOS 模拟器中打开
   - Android: 按 `a` 在 Android 模拟器中打开
   - 物理设备: 扫描二维码使用 Expo Go 应用运行

## ⚙️ 环境配置

### 开发环境
```bash
EXPO_PUBLIC_ENV=development
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_WEBSOCKET_URL=ws://localhost:3001
```

### 测试环境
```bash
EXPO_PUBLIC_ENV=staging
EXPO_PUBLIC_API_URL=https://api-staging.yourdomain.com
EXPO_PUBLIC_WEBSOCKET_URL=wss://ws-staging.yourdomain.com
```

### 生产环境
```bash
EXPO_PUBLIC_ENV=production
EXPO_PUBLIC_API_URL=https://api.yourdomain.com
EXPO_PUBLIC_WEBSOCKET_URL=wss://ws.yourdomain.com
```

## 📱 平台差异处理

### iOS 特性
- Safe Area 处理
- Status Bar 样式
- Face ID / Touch ID 支持
- iOS 特定权限

### Android 特性
- 状态栏背景色
- 硬件返回按钮
- Android 权限系统
- 自适应图标

## 🔐 权限管理

应用请求以下权限：

### 必需权限
- **相机权限** - 拍摄设备照片，扫描二维码
- **相册权限** - 选择和保存设备图片

### 可选权限
- **位置权限** - 基于位置的智能场景
- **通知权限** - 设备状态和场景执行通知
- **麦克风权限** - 语音控制功能

## 🌐 国际化支持

### 支持语言
- 🇨🇳 简体中文 (zh-CN)
- 🇺🇸 英语 (en-US)

### 添加新语言
1. 在 `src/services/api/localization.ts` 中添加语言配置
2. 添加对应的翻译文件
3. 更新语言选择器

## 🔄 状态管理

使用 Redux Toolkit 进行状态管理：

### 主要 Slices
- **authSlice** - 用户认证状态
- **deviceSlice** - 设备管理状态  
- **sceneSlice** - 场景管理状态
- **localizationSlice** - 国际化状态
- **websocketSlice** - WebSocket 连接状态
- **permissionSlice** - 权限状态

## 📡 WebSocket 通信

实时设备通信协议：

### 消息格式
```typescript
{
  type: 'device_command' | 'device_status' | 'scene_execute',
  data: {
    deviceId: string,
    action: string,
    parameters?: any
  },
  timestamp: string
}
```

### 连接管理
- 自动重连机制
- 消息队列
- 连接状态监控

## 🧪 测试

```bash
# 运行单元测试
npm test

# 运行集成测试
npm run test:integration

# 运行 E2E 测试
npm run test:e2e
```

## 📦 构建和部署

### 开发构建
```bash
expo build:android --type apk
expo build:ios --type simulator
```

### 生产构建
```bash
# 使用 EAS Build
eas build --platform android --profile production
eas build --platform ios --profile production
```

### 发布更新
```bash
expo publish --release-channel production
```

## 🐛 调试

### 开发工具
- **Flipper** - React Native 调试
- **Redux DevTools** - 状态调试
- **Chrome DevTools** - JavaScript 调试

### 日志
- 使用 `console.log` 进行基本调试
- 使用 Sentry 进行生产环境错误追踪

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 支持

如有问题或建议，请提交 Issue 或联系开发团队。

---

**让生活更智能** 🏠✨