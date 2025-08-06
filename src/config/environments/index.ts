export interface Environment {
  name: string;
  apiUrl: string;
  websocketUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  appVersion: string;
  buildNumber: string;
}

const environments: Record<string, Environment> = {
  development: {
    name: 'development',
    apiUrl: 'https://dev-api.iot-smart-home.com',
    websocketUrl: 'wss://dev-ws.iot-smart-home.com',
    supabaseUrl: 'https://demo.supabase.co',
    supabaseAnonKey: 'demo-key',
    appVersion: '1.0.0',
    buildNumber: '1',
  },
  staging: {
    name: 'staging',
    apiUrl: 'https://staging-api.iot-smart-home.com',
    websocketUrl: 'wss://staging-ws.iot-smart-home.com',
    supabaseUrl: 'https://demo.supabase.co',
    supabaseAnonKey: 'demo-key',
    appVersion: '1.0.0',
    buildNumber: '1',
  },
  production: {
    name: 'production',
    apiUrl: 'https://api.iot-smart-home.com',
    websocketUrl: 'wss://ws.iot-smart-home.com',
    supabaseUrl: 'https://demo.supabase.co',
    supabaseAnonKey: 'demo-key',
    appVersion: '1.0.0',
    buildNumber: '1',
  },
};

// 根据环境变量或默认值选择环境
const getEnvironment = (): Environment => {
  const env = process.env.EXPO_PUBLIC_ENV || 'development';
  return environments[env] || environments.development;
};

export const ENV = getEnvironment();

export default ENV; 