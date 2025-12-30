import type React from 'react';
import { Text as RNText, type TextProps as RNTextProps, useColorScheme } from 'react-native';
import { Colors } from '@/constants/colors';

export type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';

interface TextProps extends RNTextProps {
  /**
   * テキストのバリアント
   * @default 'body'
   */
  variant?: TextVariant;
  /**
   * カスタムカラー
   */
  color?: string;
  /**
   * 太字フラグ
   * @default false
   */
  bold?: boolean;
  /**
   * テキストの子要素
   */
  children: React.ReactNode;
}

/**
 * テーマ対応テキストコンポーネント
 *
 * 複数のバリアントとカラースキームをサポート
 */
export function Text({
  variant = 'body',
  color,
  bold = false,
  style,
  children,
  ...props
}: TextProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const getTextStyle = () => {
    const baseStyle = {
      color: color || colors.text,
      fontWeight: bold ? ('700' as const) : ('400' as const),
    };

    switch (variant) {
      case 'h1':
        return {
          ...baseStyle,
          fontSize: 32,
          fontWeight: '700' as const,
        };
      case 'h2':
        return {
          ...baseStyle,
          fontSize: 24,
          fontWeight: '600' as const,
        };
      case 'h3':
        return {
          ...baseStyle,
          fontSize: 20,
          fontWeight: '600' as const,
        };
      case 'body':
        return {
          ...baseStyle,
          fontSize: 16,
        };
      case 'caption':
        return {
          ...baseStyle,
          fontSize: 14,
          color: color || colors.subtext,
        };
      case 'label':
        return {
          ...baseStyle,
          fontSize: 12,
          fontWeight: '600' as const,
          textTransform: 'uppercase' as const,
          letterSpacing: 0.5,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <RNText {...props} style={[getTextStyle(), style]}>
      {children}
    </RNText>
  );
}
