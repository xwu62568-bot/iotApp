# IoT智能家居应用

一个基于React Native和Expo开发的IoT智能家居商业项目，支持设备管理、智能场景和个人设置等功能。

## 功能特性

- 🔐 用户认证系统（基于Supabase）
- 📱 设备列表管理
- 🎭 智能场景配置
- ⚙️ 个人设置
- 🌐 多语言支持
- 📡 WebSocket实时通信
- 🔒 权限管理
- 📱 跨平台支持（iOS/Android）

## 技术栈

- **框架**: React Native + Expo
- **语言**: TypeScript
- **状态管理**: Redux Toolkit
- **导航**: React Navigation
- **后端**: Supabase
- **通信**: WebSocket
- **国际化**: i18n-js

## 环境要求

- Node.js >= 18
- npm >= 8
- Expo CLI
- iOS Simulator (macOS) 或 Android Studio

## 安装步骤

1. **克隆项目**
```bash
git clone <your-repository-url>
cd iot-smart-home
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npx expo start
```

4. **运行应用**
- iOS: 按 `i` 键或扫描二维码
- Android: 按 `a` 键或扫描二维码

## 项目结构

```
src/
├── components/     # 可复用组件
├── config/        # 配置文件
├── constants/     # 常量定义
├── navigation/    # 导航配置
├── screens/       # 页面组件
├── services/      # 服务层
├── store/         # Redux状态管理
└── types/         # TypeScript类型定义
```

## 环境配置

项目支持多环境配置：
- `development`: 开发环境
- `staging`: 测试环境  
- `production`: 生产环境

通过 `EXPO_PUBLIC_ENV` 环境变量切换。

## 权限配置

应用需要以下权限：
- 相机
- 相册
- 位置
- 通知
- 网络

## 开发指南

### 添加新页面
1. 在 `src/screens/` 创建页面组件
2. 在 `src/navigation/` 配置路由
3. 更新类型定义

### 添加新服务
1. 在 `src/services/` 创建服务文件
2. 在 `src/store/slices/` 添加状态管理
3. 更新相关类型定义

## 构建部署

### 开发构建
```bash
npx expo run:ios
npx expo run:android
```

### 生产构建
```bash
eas build --platform ios
eas build --platform android
```

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有问题或建议，请通过以下方式联系：
- 邮箱: your-email@example.com
- 项目Issues: [GitHub Issues](https://github.com/your-username/your-repo/issues)