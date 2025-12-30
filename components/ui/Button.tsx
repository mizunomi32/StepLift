import React from 'react';
import {
  Pressable,
  type PressableProps,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/colors';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  /**
   * ボタンのバリアント
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * ボタンのサイズ
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * ボタンのラベル
   */
  children: string;
  /**
   * 無効化フラグ
   * @default false
   */
  disabled?: boolean;
  /**
   * ローディング中フラグ
   * @default false
   */
  loading?: boolean;
  /**
   * フルワイド表示
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * 基本ボタンコンポーネント
 *
 * 複数のバリアントとサイズをサポートする再利用可能なボタン
 */
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  disabled = false,
  loading = false,
  fullWidth = false,
  ...props
}: ButtonProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const getBackgroundColor = () => {
    if (disabled || loading) return colors.cardBackground;

    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled || loading) return colors.subtext;

    switch (variant) {
      case 'primary':
      case 'secondary':
        return '#FFFFFF';
      case 'outline':
      case 'ghost':
        return colors.text;
      default:
        return '#FFFFFF';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case 'md':
        return { paddingVertical: 12, paddingHorizontal: 24 };
      case 'lg':
        return { paddingVertical: 16, paddingHorizontal: 32 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 24 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return 14;
      case 'md':
        return 16;
      case 'lg':
        return 18;
      default:
        return 16;
    }
  };

  const buttonStyle = {
    backgroundColor: getBackgroundColor(),
    ...getPadding(),
    borderRadius: 8,
    borderWidth: variant === 'outline' ? 1 : 0,
    borderColor: variant === 'outline' ? colors.primary : 'transparent',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'row' as const,
    width: fullWidth ? '100%' : undefined,
    opacity: disabled ? 0.5 : 1,
  };

  const textStyle = {
    color: getTextColor(),
    fontSize: getFontSize(),
    fontWeight: '600' as const,
  };

  return (
    <Pressable
      {...props}
      disabled={disabled || loading}
      style={({ pressed }) => [
        buttonStyle,
        pressed && !disabled && !loading && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={textStyle}>{children}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.8,
  },
});
