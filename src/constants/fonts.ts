import { Platform } from 'react-native';

export const Fonts = {
  // 字体族
  family: {
    regular: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'System',
      android: 'Roboto-Bold',
      default: 'System',
    }),
    light: Platform.select({
      ios: 'System',
      android: 'Roboto-Light',
      default: 'System',
    }),
    thin: Platform.select({
      ios: 'System',
      android: 'Roboto-Thin',
      default: 'System',
    }),
  },
  
  // 字体大小
  size: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    display: 32,
    displayLarge: 48,
  },
  
  // 字体权重
  weight: {
    thin: '100' as const,
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '900' as const,
  },
  
  // 行高
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
  
  // 字间距
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
};

// 预定义的文本样式
export const TextStyles = {
  // 标题样式
  h1: {
    fontSize: Fonts.size.display,
    fontWeight: Fonts.weight.bold,
    lineHeight: Fonts.size.display * Fonts.lineHeight.tight,
  },
  h2: {
    fontSize: Fonts.size.xxxl,
    fontWeight: Fonts.weight.bold,
    lineHeight: Fonts.size.xxxl * Fonts.lineHeight.tight,
  },
  h3: {
    fontSize: Fonts.size.xxl,
    fontWeight: Fonts.weight.semibold,
    lineHeight: Fonts.size.xxl * Fonts.lineHeight.normal,
  },
  h4: {
    fontSize: Fonts.size.xl,
    fontWeight: Fonts.weight.medium,
    lineHeight: Fonts.size.xl * Fonts.lineHeight.normal,
  },
  h5: {
    fontSize: Fonts.size.lg,
    fontWeight: Fonts.weight.medium,
    lineHeight: Fonts.size.lg * Fonts.lineHeight.normal,
  },
  h6: {
    fontSize: Fonts.size.md,
    fontWeight: Fonts.weight.medium,
    lineHeight: Fonts.size.md * Fonts.lineHeight.normal,
  },
  
  // 正文样式
  body1: {
    fontSize: Fonts.size.lg,
    fontWeight: Fonts.weight.regular,
    lineHeight: Fonts.size.lg * Fonts.lineHeight.normal,
  },
  body2: {
    fontSize: Fonts.size.md,
    fontWeight: Fonts.weight.regular,
    lineHeight: Fonts.size.md * Fonts.lineHeight.normal,
  },
  body3: {
    fontSize: Fonts.size.sm,
    fontWeight: Fonts.weight.regular,
    lineHeight: Fonts.size.sm * Fonts.lineHeight.normal,
  },
  
  // 按钮样式
  button: {
    fontSize: Fonts.size.md,
    fontWeight: Fonts.weight.medium,
    lineHeight: Fonts.size.md * Fonts.lineHeight.normal,
    letterSpacing: Fonts.letterSpacing.wide,
  },
  
  // 标签样式
  caption: {
    fontSize: Fonts.size.sm,
    fontWeight: Fonts.weight.regular,
    lineHeight: Fonts.size.sm * Fonts.lineHeight.normal,
  },
  
  // 输入框样式
  input: {
    fontSize: Fonts.size.md,
    fontWeight: Fonts.weight.regular,
    lineHeight: Fonts.size.md * Fonts.lineHeight.normal,
  },
  
  // 标签样式
  label: {
    fontSize: Fonts.size.sm,
    fontWeight: Fonts.weight.medium,
    lineHeight: Fonts.size.sm * Fonts.lineHeight.normal,
  },
};

export default Fonts; 