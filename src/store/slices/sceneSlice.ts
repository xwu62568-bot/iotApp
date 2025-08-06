import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// 场景类型定义
export interface Scene {
  id: string;
  name: string;
  description?: string;
  type: 'manual' | 'scheduled' | 'triggered';
  enabled: boolean;
  conditions: SceneCondition[];
  actions: SceneAction[];
  createdAt: string;
  updatedAt: string;
}

export interface SceneCondition {
  id: string;
  type: 'time' | 'device' | 'sensor' | 'location' | 'weather';
  parameters: Record<string, any>;
}

export interface SceneAction {
  id: string;
  deviceId: string;
  action: string;
  parameters: Record<string, any>;
}

interface SceneState {
  scenes: Scene[];
  loading: boolean;
  error: string | null;
  selectedScene: Scene | null;
}

// 模拟场景数据
const mockScenes: Scene[] = [
  {
    id: '1',
    name: '回家模式',
    description: '回家时自动开启灯光和空调',
    type: 'triggered',
    enabled: true,
    conditions: [
      {
        id: '1',
        type: 'location',
        parameters: { latitude: 39.9042, longitude: 116.4074, radius: 100 },
      },
    ],
    actions: [
      {
        id: '1',
        deviceId: '1',
        action: 'turnOn',
        parameters: { brightness: 80 },
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: '睡眠模式',
    description: '晚上10点自动关闭灯光',
    type: 'scheduled',
    enabled: true,
    conditions: [
      {
        id: '2',
        type: 'time',
        parameters: { hour: 22, minute: 0, days: [1, 2, 3, 4, 5, 6, 7] },
      },
    ],
    actions: [
      {
        id: '2',
        deviceId: '1',
        action: 'turnOff',
        parameters: {},
      },
    ],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
];

// 异步thunk actions
export const fetchScenes = createAsyncThunk(
  'scene/fetchScenes',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockScenes;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addScene = createAsyncThunk(
  'scene/addScene',
  async (scene: Omit<Scene, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newScene: Scene = {
        ...scene,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newScene;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateScene = createAsyncThunk(
  'scene/updateScene',
  async ({ id, updates }: { id: string; updates: Partial<Scene> }, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id, updates };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteScene = createAsyncThunk(
  'scene/deleteScene',
  async (sceneId: string, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return sceneId;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const executeScene = createAsyncThunk(
  'scene/executeScene',
  async (sceneId: string, { rejectWithValue }) => {
    try {
      // 这里应该调用WebSocket服务执行场景
      await new Promise(resolve => setTimeout(resolve, 1000));
      return sceneId;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// 初始状态
const initialState: SceneState = {
  scenes: [],
  loading: false,
  error: null,
  selectedScene: null,
};

// 创建slice
const sceneSlice = createSlice({
  name: 'scene',
  initialState,
  reducers: {
    setSelectedScene: (state, action: PayloadAction<Scene | null>) => {
      state.selectedScene = action.payload;
    },
    clearSceneError: (state) => {
      state.error = null;
    },
    resetSceneState: (state) => {
      state.scenes = [];
      state.loading = false;
      state.error = null;
      state.selectedScene = null;
    },
  },
  extraReducers: (builder) => {
    // 获取场景列表
    builder
      .addCase(fetchScenes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScenes.fulfilled, (state, action) => {
        state.loading = false;
        state.scenes = action.payload;
        state.error = null;
      })
      .addCase(fetchScenes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 添加场景
    builder
      .addCase(addScene.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addScene.fulfilled, (state, action) => {
        state.loading = false;
        state.scenes.push(action.payload);
        state.error = null;
      })
      .addCase(addScene.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 更新场景
    builder
      .addCase(updateScene.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateScene.fulfilled, (state, action) => {
        state.loading = false;
        const scene = state.scenes.find(s => s.id === action.payload.id);
        if (scene) {
          Object.assign(scene, action.payload.updates);
          scene.updatedAt = new Date().toISOString();
        }
        state.error = null;
      })
      .addCase(updateScene.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 删除场景
    builder
      .addCase(deleteScene.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteScene.fulfilled, (state, action) => {
        state.loading = false;
        state.scenes = state.scenes.filter(s => s.id !== action.payload);
        if (state.selectedScene?.id === action.payload) {
          state.selectedScene = null;
        }
        state.error = null;
      })
      .addCase(deleteScene.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 执行场景
    builder
      .addCase(executeScene.pending, (state) => {
        // 执行场景不需要设置loading状态
      })
      .addCase(executeScene.fulfilled, (state, action) => {
        // 场景执行成功
      })
      .addCase(executeScene.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// 导出actions
export const {
  setSelectedScene,
  clearSceneError,
  resetSceneState,
} = sceneSlice.actions;

// 导出selectors
export const selectScenes = (state: { scene: SceneState }) => state.scene.scenes;
export const selectSceneLoading = (state: { scene: SceneState }) => state.scene.loading;
export const selectSceneError = (state: { scene: SceneState }) => state.scene.error;
export const selectSelectedScene = (state: { scene: SceneState }) => state.scene.selectedScene;
export const selectEnabledScenes = (state: { scene: SceneState }) => 
  state.scene.scenes.filter(s => s.enabled);
export const selectScenesByType = (type: Scene['type']) => (state: { scene: SceneState }) => 
  state.scene.scenes.filter(s => s.type === type);

export default sceneSlice.reducer; 