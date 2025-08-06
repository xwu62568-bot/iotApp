export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  deviceStatus: boolean;
  sceneExecution: boolean;
  securityAlerts: boolean;
  maintenanceReminders: boolean;
  marketing: boolean;
}

export interface PrivacySettings {
  dataCollection: boolean;
  analytics: boolean;
  crashReports: boolean;
}

export interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface PasswordResetRequest {
  email: string;
} 