import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/colors';
import { Fonts, TextStyles } from '../../constants/fonts';
import { AuthStackParamList } from '../../navigation';
import { loginUser, clearError, selectAuthLoading, selectAuthError } from '../../store/slices/authSlice';
import { t } from '../../services/api/localization';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { RootState } from '../../store';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 清除错误信息
  useEffect(() => {
    if (error) {
      Alert.alert('登录失败', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // 验证邮箱格式
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 验证表单
  const validateForm = (): boolean => {
    let isValid = true;

    // 验证邮箱
    if (!email.trim()) {
      setEmailError(t('auth.emailRequired'));
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError(t('auth.invalidEmail'));
      isValid = false;
    } else {
      setEmailError('');
    }

    // 验证密码
    if (!password.trim()) {
      setPasswordError(t('auth.passwordRequired'));
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(t('auth.invalidPassword'));
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  // 处理登录
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    dispatch(loginUser({ email: email.trim(), password }));
  };

  // 导航到注册页面
  const handleRegister = () => {
    navigation.navigate('Register');
  };

  // 导航到忘记密码页面
  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo和标题 */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="home" size={60} color={Colors.primary[500]} />
            </View>
            <Text style={styles.title}>{t('auth.login')}</Text>
            <Text style={styles.subtitle}>{t('auth.welcomeBack')}</Text>
          </View>

          {/* 登录表单 */}
          <View style={styles.form}>
            <Input
              label={t('auth.email')}
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChangeText={setEmail}
              error={emailError}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon={<Ionicons name="mail-outline" size={20} color={Colors.neutral[400]} />}
              fullWidth
            />

            <Input
              label={t('auth.password')}
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChangeText={setPassword}
              error={passwordError}
              secureTextEntry
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.neutral[400]} />}
              fullWidth
            />

            {/* 忘记密码链接 */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>{t('auth.forgotPassword')}</Text>
            </TouchableOpacity>

            {/* 登录按钮 */}
            <Button
              title={t('auth.login')}
              onPress={handleLogin}
              loading={loading}
              fullWidth
              size="large"
              style={styles.loginButton}
            />

            {/* 注册链接 */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>{t('auth.noAccount')}</Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.registerLink}>{t('auth.register')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 底部信息 */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t('auth.termsAgreement')}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    ...TextStyles.h2,
    color: Colors.light.onBackground,
    marginBottom: 8,
  },
  subtitle: {
    ...TextStyles.body1,
    color: Colors.neutral[600],
    textAlign: 'center',
  },
  form: {
    flex: 1,
    marginBottom: 20,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },
  forgotPasswordText: {
    ...TextStyles.body3,
    color: Colors.primary[500],
  },
  loginButton: {
    marginBottom: 24,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    ...TextStyles.body2,
    color: Colors.neutral[600],
  },
  registerLink: {
    ...TextStyles.body2,
    color: Colors.primary[500],
    fontWeight: '600',
    marginLeft: 4,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  footerText: {
    ...TextStyles.caption,
    color: Colors.neutral[500],
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default LoginScreen; 