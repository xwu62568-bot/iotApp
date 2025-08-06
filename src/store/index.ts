import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import deviceReducer from './slices/deviceSlice';
import sceneReducer from './slices/sceneSlice';
import localizationReducer from './slices/localizationSlice';
import websocketReducer from './slices/websocketSlice';
import permissionReducer from './slices/permissionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    device: deviceReducer,
    scene: sceneReducer,
    localization: localizationReducer,
    websocket: websocketReducer,
    permission: permissionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略WebSocket和Date对象的序列化检查
        ignoredActions: [
          'websocket/connect',
          'websocket/disconnect',
          'websocket/messageReceived',
        ],
        ignoredPaths: ['websocket.lastMessage'],
      },
    }),
});

// 导出类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 创建类型化的hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store; 