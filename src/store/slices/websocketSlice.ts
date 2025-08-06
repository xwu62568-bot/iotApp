import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WebSocketState, WebSocketMessage } from '../../types/api';

// 初始状态
const initialState: WebSocketState = {
  connected: false,
  connecting: false,
  error: null,
  lastMessage: null,
};

// 创建slice
const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    connect: (state) => {
      state.connecting = true;
      state.error = null;
    },
    connectSuccess: (state) => {
      state.connected = true;
      state.connecting = false;
      state.error = null;
    },
    connectFailure: (state, action: PayloadAction<string>) => {
      state.connected = false;
      state.connecting = false;
      state.error = action.payload;
    },
    disconnect: (state) => {
      state.connected = false;
      state.connecting = false;
      state.error = null;
    },
    messageReceived: (state, action: PayloadAction<WebSocketMessage>) => {
      state.lastMessage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  connect,
  connectSuccess,
  connectFailure,
  disconnect,
  messageReceived,
  clearError,
} = websocketSlice.actions;

export default websocketSlice.reducer; 