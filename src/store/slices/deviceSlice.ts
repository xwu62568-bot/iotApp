import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Device, DeviceState, DeviceAction, DeviceEvent } from '../../types/device';
import { websocketService } from '../../services/websocket/websocket';

// 模拟API调用 - 实际项目中应该从真实的API服务获取
const mockDevices: Device[] = [
  {
    id: '1',
    name: '客厅智能灯',
    type: 'light',
    model: 'SmartLight Pro',
    manufacturer: 'SmartHome Inc',
    status: 'online',
    connectionType: 'wifi',
    ipAddress: '192.168.1.100',
    macAddress: 'AA:BB:CC:DD:EE:FF',
    firmwareVersion: '1.2.3',
    lastSeen: new Date().toISOString(),
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
    roomId: 'living-room',
    roomName: '客厅',
    capabilities: [
      { name: 'power', type: 'both' },
      { name: 'brightness', type: 'both', unit: '%', range: { min: 0, max: 100, step: 1 } },
      { name: 'color', type: 'both' },
    ],
    properties: {
      power: true,
      brightness: 80,
      color: { r: 255, g: 255, b: 255 },
    },
    settings: {
      autoOff: false,
      autoOffDelay: 0,
      brightnessLimit: 100,
      notifications: true,
    },
    metadata: {
      icon: 'lightbulb',
      description: '客厅主照明灯',
      tags: ['照明', '客厅'],
    },
  },
  {
    id: '2',
    name: '卧室温度传感器',
    type: 'sensor',
    model: 'TempSensor Plus',
    manufacturer: 'SensorTech',
    status: 'online',
    connectionType: 'wifi',
    ipAddress: '192.168.1.101',
    macAddress: 'AA:BB:CC:DD:EE:01',
    firmwareVersion: '2.1.0',
    lastSeen: new Date().toISOString(),
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: new Date().toISOString(),
    roomId: 'bedroom',
    roomName: '卧室',
    capabilities: [
      { name: 'temperature', type: 'read', unit: '°C', range: { min: -40, max: 80, step: 0.1 } },
      { name: 'humidity', type: 'read', unit: '%', range: { min: 0, max: 100, step: 0.1 } },
    ],
    properties: {
      temperature: 22.5,
      humidity: 45.2,
    },
    settings: {
      notifications: true,
    },
    metadata: {
      icon: 'thermometer',
      description: '卧室温湿度传感器',
      tags: ['传感器', '卧室'],
    },
  },
];

// 异步thunk actions
export const fetchDevices = createAsyncThunk(
  'device/fetchDevices',
  async (_, { rejectWithValue }) => {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockDevices;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addDevice = createAsyncThunk(
  'device/addDevice',
  async (device: Omit<Device, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      const newDevice: Device = {
        ...device,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newDevice;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateDevice = createAsyncThunk(
  'device/updateDevice',
  async ({ id, updates }: { id: string; updates: Partial<Device> }, { rejectWithValue }) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id, updates };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteDevice = createAsyncThunk(
  'device/deleteDevice',
  async (deviceId: string, { rejectWithValue }) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      return deviceId;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const controlDevice = createAsyncThunk(
  'device/controlDevice',
  async (action: DeviceAction, { rejectWithValue }) => {
    try {
      // 通过WebSocket发送设备控制命令
      websocketService.sendDeviceCommand(action.deviceId, action.action, action.parameters);
      return action;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// 初始状态
const initialState: DeviceState = {
  devices: [],
  loading: false,
  error: null,
  selectedDevice: null,
};

// 创建slice
const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    // 设置选中的设备
    setSelectedDevice: (state, action: PayloadAction<Device | null>) => {
      state.selectedDevice = action.payload;
    },
    // 更新设备状态（从WebSocket接收）
    updateDeviceStatus: (state, action: PayloadAction<{ deviceId: string; status: Device['status'] }>) => {
      const device = state.devices.find(d => d.id === action.payload.deviceId);
      if (device) {
        device.status = action.payload.status;
        device.lastSeen = new Date().toISOString();
      }
    },
    // 更新设备属性（从WebSocket接收）
    updateDeviceProperties: (state, action: PayloadAction<{ deviceId: string; properties: Partial<Device['properties']> }>) => {
      const device = state.devices.find(d => d.id === action.payload.deviceId);
      if (device) {
        device.properties = {
          ...device.properties,
          ...action.payload.properties,
        };
        device.updatedAt = new Date().toISOString();
      }
    },
    // 处理设备事件（从WebSocket接收）
    handleDeviceEvent: (state, action: PayloadAction<DeviceEvent>) => {
      // 这里可以处理设备事件，比如更新设备状态、触发通知等
      console.log('Device event received:', action.payload);
    },
    // 清除错误
    clearDeviceError: (state) => {
      state.error = null;
    },
    // 重置状态
    resetDeviceState: (state) => {
      state.devices = [];
      state.loading = false;
      state.error = null;
      state.selectedDevice = null;
    },
  },
  extraReducers: (builder) => {
    // 获取设备列表
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload;
        state.error = null;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 添加设备
    builder
      .addCase(addDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDevice.fulfilled, (state, action) => {
        state.loading = false;
        state.devices.push(action.payload);
        state.error = null;
      })
      .addCase(addDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 更新设备
    builder
      .addCase(updateDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        state.loading = false;
        const device = state.devices.find(d => d.id === action.payload.id);
        if (device) {
          Object.assign(device, action.payload.updates);
          device.updatedAt = new Date().toISOString();
        }
        state.error = null;
      })
      .addCase(updateDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 删除设备
    builder
      .addCase(deleteDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDevice.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = state.devices.filter(d => d.id !== action.payload);
        if (state.selectedDevice?.id === action.payload) {
          state.selectedDevice = null;
        }
        state.error = null;
      })
      .addCase(deleteDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 控制设备
    builder
      .addCase(controlDevice.pending, (state) => {
        // 控制设备不需要设置loading状态，因为是异步操作
      })
      .addCase(controlDevice.fulfilled, (state, action) => {
        // 设备控制命令已发送，状态更新将通过WebSocket接收
      })
      .addCase(controlDevice.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// 导出actions
export const {
  setSelectedDevice,
  updateDeviceStatus,
  updateDeviceProperties,
  handleDeviceEvent,
  clearDeviceError,
  resetDeviceState,
} = deviceSlice.actions;

// 导出selectors
export const selectDevices = (state: { device: DeviceState }) => state.device.devices;
export const selectDeviceLoading = (state: { device: DeviceState }) => state.device.loading;
export const selectDeviceError = (state: { device: DeviceState }) => state.device.error;
export const selectSelectedDevice = (state: { device: DeviceState }) => state.device.selectedDevice;
export const selectOnlineDevices = (state: { device: DeviceState }) => 
  state.device.devices.filter(d => d.status === 'online');
export const selectOfflineDevices = (state: { device: DeviceState }) => 
  state.device.devices.filter(d => d.status === 'offline');
export const selectDevicesByType = (type: Device['type']) => (state: { device: DeviceState }) => 
  state.device.devices.filter(d => d.type === type);
export const selectDevicesByRoom = (roomId: string) => (state: { device: DeviceState }) => 
  state.device.devices.filter(d => d.roomId === roomId);

export default deviceSlice.reducer; 