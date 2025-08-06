import React, { useEffect, useState } from 'react';
import { Platform, StatusBar, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { store } from './src/store';
import AppNavigator from './src/navigation';
import { localizationService } from './src/services/api/localization';
import { setTranslations } from './src/store/slices/localizationSlice';
// import { websocketService } from './src/services/websocket/websocket';
// import { PermissionService } from './src/services/api/permissions';
// import { Colors } from './src/constants/colors';
// import { ENV } from './src/config/environments';

// 阻止启动屏自动隐藏
SplashScreen.preventAutoHideAsync();

// 自定义字体配置
const customFonts = {
  // 可以在这里添加自定义字体
  // 'CustomFont-Regular': require('./src/assets/fonts/CustomFont-Regular.ttf'),
  // 'CustomFont-Bold': require('./src/assets/fonts/CustomFont-Bold.ttf'),
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        console.log('🚀 启动应用...');

        // 最小化初始化，只做必要的操作
        try {
          // 预加载字体（空对象，不会失败）
          await Font.loadAsync(customFonts);
          console.log('✅ 字体加载完成');
        } catch (error) {
          console.warn('Font loading failed:', error);
        }

        // 初始化国际化服务
        try {
          await localizationService.initialize();
          // 同步翻译到 Redux store
          const state = localizationService.getState();
          store.dispatch(setTranslations(state.translations));
          console.log('✅ 国际化服务初始化完成');
          console.log('🌍 当前语言:', localizationService.getCurrentLanguage());
          console.log('📝 测试翻译:', localizationService.t('auth.login'));
        } catch (error) {
          console.warn('Localization initialization failed:', error);
        }

        // 设置状态栏样式
        try {
          setupStatusBar();
          console.log('✅ 状态栏设置完成');
        } catch (error) {
          console.warn('Status bar setup failed:', error);
        }

        console.log('🎉 应用初始化完成');
      } catch (error) {
        console.error('❌ 应用初始化失败:', error);
        // 不显示Alert，直接继续
      } finally {
        // 标记应用准备完成
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // 设置状态栏样式
  const setupStatusBar = () => {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('dark-content', true);
    } else if (Platform.OS === 'android') {
      StatusBar.setBarStyle('dark-content', true);
      StatusBar.setBackgroundColor('#ffffff', true);
      StatusBar.setTranslucent(false);
    }
  };

  // 应用准备完成后隐藏启动屏
  useEffect(() => {
    if (appIsReady) {
      const hideSplashScreen = async () => {
        try {
          await SplashScreen.hideAsync();
          console.log('✅ 启动屏隐藏完成');
        } catch (error) {
          console.error('❌ 隐藏启动屏失败:', error);
        }
      };

      // 延迟一点时间确保界面完全渲染
      const timer = setTimeout(hideSplashScreen, 500);
      return () => clearTimeout(timer);
    }
  }, [appIsReady]);

  // 如果应用还未准备完成，返回null保持启动屏显示
  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar
            barStyle={Platform.OS === 'ios' ? 'dark-content' : 'dark-content'}
            backgroundColor={Platform.OS === 'android' ? '#ffffff' : undefined}
            translucent={Platform.OS === 'android' ? false : undefined}
          />
          <AppNavigator />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}