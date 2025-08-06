import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { localizationService } from '../../services/api/localization';
import { LocalizationState, LanguageConfig } from '../../types/api';

// 异步thunk actions
export const setLanguage = createAsyncThunk(
  'localization/setLanguage',
  async (languageCode: string, { rejectWithValue }) => {
    try {
      await localizationService.setLanguage(languageCode);
      return languageCode;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// 初始状态
const initialState: LocalizationState = {
  currentLanguage: 'zh-CN',
  availableLanguages: localizationService.getAvailableLanguages(),
  translations: {},
  loading: false,
  error: null,
};

// 创建slice
const localizationSlice = createSlice({
  name: 'localization',
  initialState,
  reducers: {
    clearLocalizationError: (state) => {
      state.error = null;
    },
    setTranslations: (state, action: PayloadAction<Record<string, any>>) => {
      state.translations = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setLanguage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setLanguage.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLanguage = action.payload;
        state.error = null;
      })
      .addCase(setLanguage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearLocalizationError, setTranslations } = localizationSlice.actions;

export default localizationSlice.reducer; 