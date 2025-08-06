import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts, TextStyles } from '../../constants/fonts';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    };

    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        minHeight: 32,
      },
      medium: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 44,
      },
      large: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        minHeight: 56,
      },
    };

    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: Colors.primary[500],
      },
      secondary: {
        backgroundColor: Colors.secondary[500],
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.primary[500],
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      danger: {
        backgroundColor: Colors.error[500],
      },
    };

    const disabledStyle: ViewStyle = disabled
      ? {
          backgroundColor: Colors.neutral[300],
          borderColor: Colors.neutral[300],
        }
      : {};

    const fullWidthStyle: ViewStyle = fullWidth ? { width: '100%' } : {};

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...disabledStyle,
      ...fullWidthStyle,
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...TextStyles.button,
      textAlign: 'center',
    };

    const sizeStyles: Record<string, TextStyle> = {
      small: {
        fontSize: Fonts.size.sm,
      },
      medium: {
        fontSize: Fonts.size.md,
      },
      large: {
        fontSize: Fonts.size.lg,
      },
    };

    const variantStyles: Record<string, TextStyle> = {
      primary: {
        color: Colors.light.onPrimary,
      },
      secondary: {
        color: Colors.light.onSecondary,
      },
      outline: {
        color: Colors.primary[500],
      },
      ghost: {
        color: Colors.primary[500],
      },
      danger: {
        color: Colors.light.onError,
      },
    };

    const disabledStyle: TextStyle = disabled
      ? {
          color: Colors.neutral[500],
        }
      : {};

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...disabledStyle,
      ...textStyle,
    };
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <ActivityIndicator
            size="small"
            color={variant === 'outline' || variant === 'ghost' ? Colors.primary[500] : Colors.light.onPrimary}
            style={{ marginRight: 8 }}
          />
          <Text style={getTextStyle()}>{title}</Text>
        </>
      );
    }

    if (icon) {
      const iconElement = <>{icon}</>;
      const textElement = <Text style={getTextStyle()}>{title}</Text>;

      return iconPosition === 'left' ? (
        <>
          {iconElement}
          <Text style={[getTextStyle(), { marginLeft: 8 }]}>{title}</Text>
        </>
      ) : (
        <>
          <Text style={[getTextStyle(), { marginRight: 8 }]}>{title}</Text>
          {iconElement}
        </>
      );
    }

    return <Text style={getTextStyle()}>{title}</Text>;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // 基础样式已在getButtonStyle中定义
  },
});

export default Button; 