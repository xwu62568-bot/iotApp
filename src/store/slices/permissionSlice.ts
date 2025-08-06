import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PermissionConfig } from '../../config/permissions';

interface PermissionState {
  permissions: Record<string, boolean>;
  loading: boolean;
  error: string | null;
}

// 初始状态
const initialState: PermissionState = {
  permissions: {},
  loading: false,
  error: null,
};

// 创建slice
const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    setPermission: (state, action: PayloadAction<{ permission: string; granted: boolean }>) => {
      state.permissions[action.payload.permission] = action.payload.granted;
    },
    setPermissions: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.permissions = { ...state.permissions, ...action.payload };
    },
    clearPermissions: (state) => {
      state.permissions = {};
    },
    setPermissionLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPermissionError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearPermissionError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setPermission,
  setPermissions,
  clearPermissions,
  setPermissionLoading,
  setPermissionError,
  clearPermissionError,
} = permissionSlice.actions;

// 导出selectors
export const selectPermissions = (state: { permission: PermissionState }) => state.permission.permissions;
export const selectPermissionLoading = (state: { permission: PermissionState }) => state.permission.loading;
export const selectPermissionError = (state: { permission: PermissionState }) => state.permission.error;
export const selectPermission = (permission: string) => (state: { permission: PermissionState }) => 
  state.permission.permissions[permission] || false;

export default permissionSlice.reducer; 