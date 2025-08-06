import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '../../config/environments';
import { User, LoginCredentials, RegisterCredentials } from '../../types/user';

// 创建Supabase客户端（带错误处理）
let supabase: any;
try {
  supabase = createClient(ENV.supabaseUrl, ENV.supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
} catch (error) {
  console.warn('Failed to initialize Supabase client:', error);
  // 创建一个模拟客户端避免应用崩溃
  supabase = {
    auth: {
      signUp: () => Promise.resolve({ data: null, error: 'Supabase not configured' }),
      signInWithPassword: () => Promise.resolve({ data: null, error: 'Supabase not configured' }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: 'Supabase not configured' }),
      resetPasswordForEmail: () => Promise.resolve({ error: null }),
      updateUser: () => Promise.resolve({ data: null, error: 'Supabase not configured' }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  };
}

export { supabase };

// 认证服务
export class AuthService {
  // 注册用户
  static async register(credentials: RegisterCredentials): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
            phone: credentials.phone,
          },
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        // 创建用户配置文件
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              name: credentials.name,
              email: credentials.email,
              phone: credentials.phone,
              preferences: {
                language: 'zh-CN',
                theme: 'auto',
                notifications: {
                  deviceStatus: true,
                  sceneExecution: true,
                  securityAlerts: true,
                  maintenanceReminders: true,
                  marketing: false,
                },
                privacy: {
                  dataCollection: true,
                  analytics: true,
                  crashReports: true,
                },
              },
            },
          ]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }

      return { user: data.user as unknown as User, error: null };
    } catch (error) {
      return { user: null, error: (error as Error).message };
    }
  }

  // 登录用户
  static async login(credentials: LoginCredentials): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        // 获取用户配置文件
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
        }

        const user: User = {
          id: data.user.id,
          email: data.user.email!,
          name: profile?.name || data.user.user_metadata?.name || '用户',
          avatar: profile?.avatar,
          phone: profile?.phone,
          createdAt: data.user.created_at,
          updatedAt: data.user.updated_at || data.user.created_at,
          preferences: profile?.preferences || {
            language: 'zh-CN',
            theme: 'auto',
            notifications: {
              deviceStatus: true,
              sceneExecution: true,
              securityAlerts: true,
              maintenanceReminders: true,
              marketing: false,
            },
            privacy: {
              dataCollection: true,
              analytics: true,
              crashReports: true,
            },
          },
        };

        return { user, error: null };
      }

      return { user: null, error: '登录失败' };
    } catch (error) {
      return { user: null, error: (error as Error).message };
    }
  }

  // 登出用户
  static async logout(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error?.message || null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  // 获取当前用户
  static async getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        return { user: null, error: error?.message || '未找到用户' };
      }

      // 获取用户配置文件
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
      }

      const userData: User = {
        id: user.id,
        email: user.email!,
        name: profile?.name || user.user_metadata?.name || '用户',
        avatar: profile?.avatar,
        phone: profile?.phone,
        createdAt: user.created_at,
        updatedAt: user.updated_at || user.created_at,
        preferences: profile?.preferences || {
          language: 'zh-CN',
          theme: 'auto',
          notifications: {
            deviceStatus: true,
            sceneExecution: true,
            securityAlerts: true,
            maintenanceReminders: true,
            marketing: false,
          },
          privacy: {
            dataCollection: true,
            analytics: true,
            crashReports: true,
          },
        },
      };

      return { user: userData, error: null };
    } catch (error) {
      return { user: null, error: (error as Error).message };
    }
  }

  // 重置密码
  static async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error: error?.message || null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  // 更新用户配置文件
  static async updateProfile(userId: string, updates: Partial<User>): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { user: null, error: error.message };
      }

      return { user: data as User, error: null };
    } catch (error) {
      return { user: null, error: (error as Error).message };
    }
  }
}

// 监听认证状态变化
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      const { user } = await AuthService.getCurrentUser();
      callback(user);
    } else if (event === 'SIGNED_OUT') {
      callback(null);
    }
  });
};

export default supabase; 