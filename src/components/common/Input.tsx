import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  Platform,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts, TextStyles } from '../../constants/fonts';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  helperStyle?: TextStyle;
  variant?: 'outlined' | 'filled' | 'underlined';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  helperStyle,
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  onFocus,
  onBlur,
  ...textInputProps
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      width: fullWidth ? '100%' : 'auto',
    };

    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        marginBottom: 8,
      },
      medium: {
        marginBottom: 12,
      },
      large: {
        marginBottom: 16,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...containerStyle,
    };
  };

  const getInputContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 1,
      backgroundColor: Colors.light.surface,
    };

    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        minHeight: 36,
      },
      medium: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 44,
      },
      large: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        minHeight: 52,
      },
    };

    const variantStyles: Record<string, ViewStyle> = {
      outlined: {
        borderColor: isFocused ? Colors.primary[500] : Colors.neutral[300],
        backgroundColor: Colors.light.surface,
      },
      filled: {
        borderColor: 'transparent',
        backgroundColor: Colors.neutral[100],
      },
      underlined: {
        borderColor: 'transparent',
        borderBottomColor: isFocused ? Colors.primary[500] : Colors.neutral[300],
        borderBottomWidth: 2,
        borderRadius: 0,
        backgroundColor: 'transparent',
      },
    };

    const errorStyle: ViewStyle = error ? {
      borderColor: Colors.error[500],
    } : {};

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...errorStyle,
    };
  };

  const getInputStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...TextStyles.input,
      flex: 1,
      color: Colors.light.onSurface,
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

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...inputStyle,
    };
  };

  const getLabelStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...TextStyles.label,
      color: error ? Colors.error[500] : Colors.neutral[700],
      marginBottom: 4,
    };

    return {
      ...baseStyle,
      ...labelStyle,
    };
  };

  const getErrorStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...TextStyles.caption,
      color: Colors.error[500],
      marginTop: 4,
    };

    return {
      ...baseStyle,
      ...errorStyle,
    };
  };

  const getHelperStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...TextStyles.caption,
      color: Colors.neutral[600],
      marginTop: 4,
    };

    return {
      ...baseStyle,
      ...helperStyle,
    };
  };

  return (
    <View style={getContainerStyle()}>
      {label && (
        <Text style={getLabelStyle()}>
          {label}
        </Text>
      )}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          ref={ref}
          style={getInputStyle()}
          placeholderTextColor={Colors.neutral[400]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...textInputProps}
        />
        
        {rightIcon && (
          <View style={styles.iconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {error && (
        <Text style={getErrorStyle()}>
          {error}
        </Text>
      )}
      
      {helper && !error && (
        <Text style={getHelperStyle()}>
          {helper}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  iconContainer: {
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

Input.displayName = 'Input';

export default Input; 