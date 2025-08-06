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
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/colors';
import { Fonts, TextStyles } from '../../constants/fonts';
import { AuthStackParamList } from '../../navigation';
import { registerUser, clearError, selectAuthLoading, selectAuthError } from '../../store/slices/authSlice';
import { t } from '../../services/api/localization';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // 清除错误信息
  useEffect(() => {
    if (error) {
      Alert.alert('注册失败', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // 验证邮箱格式
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 验证手机号格式
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  // 验证表单
  const validateForm = (): boolean => {
    let isValid = true;

    // 验证姓名
    if (!name.trim()) {
      setNameError(t('auth.nameRequired'));
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError('姓名至少2个字符');
      isValid = false;
    } else {
      setNameError('');
    }

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

    // 验证确认密码
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('请确认密码');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError(t('auth.passwordMismatch'));
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    // 验证手机号（可选）
    if (phone.trim() && !validatePhone(phone)) {
      setPhoneError('请输入正确的手机号');
      isValid = false;
    } else {
      setPhoneError('');
    }

    return isValid;
  };

  // 处理注册
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    dispatch(registerUser({
      name: name.trim(),
      email: email.trim(),
      password,
      phone: phone.trim() || undefined,
    }));
  };

  // 导航到登录页面
  const handleLogin = () => {
    navigation.navigate('Login');
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
          {/* 返回按钮 */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.light.onBackground} />
          </TouchableOpacity>

          {/* Logo和标题 */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="home" size={60} color={Colors.primary[500]} />
            </View>
            <Text style={styles.title}>{t('auth.register')}</Text>
            <Text style={styles.subtitle}>创建您的智能家居账户</Text>
          </View>

          {/* 注册表单 */}
          <View style={styles.form}>
            <Input
              label="姓名"
              placeholder="请输入您的姓名"
              value={name}
              onChangeText={setName}
              error={nameError}
              leftIcon={<Ionicons name="person-outline" size={20} color={Colors.neutral[400]} />}
              fullWidth
            />

            <Input
              label={t('auth.email')}
              placeholder="请输入邮箱地址"
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
              label="手机号"
              placeholder="请输入手机号（可选）"
              value={phone}
              onChangeText={setPhone}
              error={phoneError}
              keyboardType="phone-pad"
              leftIcon={<Ionicons name="call-outline" size={20} color={Colors.neutral[400]} />}
              fullWidth
            />

            <Input
              label={t('auth.password')}
              placeholder="请输入密码"
              value={password}
              onChangeText={setPassword}
              error={passwordError}
              secureTextEntry
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.neutral[400]} />}
              fullWidth
            />

            <Input
              label={t('auth.confirmPassword')}
              placeholder="请再次输入密码"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={confirmPasswordError}
              secureTextEntry
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.neutral[400]} />}
              fullWidth
            />

            {/* 注册按钮 */}
            <Button
              title={t('auth.register')}
              onPress={handleRegister}
              loading={loading}
              fullWidth
              size="large"
              style={styles.registerButton}
            />

            {/* 登录链接 */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>已有账号？</Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>{t('auth.login')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 底部信息 */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              注册即表示您同意我们的服务条款和隐私政策
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 24,
    zIndex: 1,
    padding: 8,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
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
  registerButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    ...TextStyles.body2,
    color: Colors.neutral[600],
  },
  loginLink: {
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

export default RegisterScreen; 