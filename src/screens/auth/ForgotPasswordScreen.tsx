import React, { useState } from 'react';
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
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/colors';
import { Fonts, TextStyles } from '../../constants/fonts';
import { AuthStackParamList } from '../../navigation';
import { t } from '../../services/api/localization';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

interface ForgotPasswordScreenProps {
  navigation: ForgotPasswordScreenNavigationProp;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // 验证邮箱格式
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 验证表单
  const validateForm = (): boolean => {
    if (!email.trim()) {
      setEmailError(t('auth.emailRequired'));
      return false;
    } else if (!validateEmail(email)) {
      setEmailError(t('auth.invalidEmail'));
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  // 处理重置密码
  const handleResetPassword = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // 这里应该调用重置密码的API
      // const { error } = await AuthService.resetPassword(email.trim());
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSent(true);
      Alert.alert(
        '重置密码',
        '重置密码链接已发送到您的邮箱，请查收邮件并按照提示重置密码。',
        [
          {
            text: '确定',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('错误', '发送重置密码邮件失败，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  // 返回登录页面
  const handleBackToLogin = () => {
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
              <Ionicons name="lock-open" size={60} color={Colors.primary[500]} />
            </View>
            <Text style={styles.title}>{t('auth.forgotPassword')}</Text>
            <Text style={styles.subtitle}>
              请输入您的邮箱地址，我们将发送重置密码链接到您的邮箱
            </Text>
          </View>

          {/* 重置密码表单 */}
          <View style={styles.form}>
            <Input
              label={t('auth.email')}
              placeholder="请输入您的邮箱地址"
              value={email}
              onChangeText={setEmail}
              error={emailError}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon={<Ionicons name="mail-outline" size={20} color={Colors.neutral[400]} />}
              fullWidth
              disabled={sent}
            />

            {/* 重置密码按钮 */}
            <Button
              title={sent ? '已发送' : '发送重置链接'}
              onPress={handleResetPassword}
              loading={loading}
              disabled={sent}
              fullWidth
              size="large"
              style={styles.resetButton}
            />

            {/* 返回登录链接 */}
            <View style={styles.backToLoginContainer}>
              <Text style={styles.backToLoginText}>记起密码了？</Text>
              <TouchableOpacity onPress={handleBackToLogin}>
                <Text style={styles.backToLoginLink}>{t('auth.login')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 底部信息 */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              重置密码链接有效期为24小时，请及时处理
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
    lineHeight: 22,
  },
  form: {
    flex: 1,
    marginBottom: 20,
  },
  resetButton: {
    marginTop: 24,
    marginBottom: 24,
  },
  backToLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backToLoginText: {
    ...TextStyles.body2,
    color: Colors.neutral[600],
  },
  backToLoginLink: {
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

export default ForgotPasswordScreen; 