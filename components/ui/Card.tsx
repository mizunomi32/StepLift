import type React from 'react';
import { useColorScheme, View, type ViewProps } from 'react-native';
import { Colors } from '@/constants/colors';

interface CardProps extends ViewProps {
  /**
   * カードの子要素
   */
  children: React.ReactNode;
  /**
   * パディングサイズ
   * @default 'md'
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * カードコンテナコンポーネント
 *
 * 背景色とパディングを持つコンテナ
 */
export function Card({ children, padding = 'md', style, ...props }: CardProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return 12;
      case 'md':
        return 16;
      case 'lg':
        return 24;
      default:
        return 16;
    }
  };

  const cardStyle = {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: getPadding(),
  };

  return (
    <View {...props} style={[cardStyle, style]}>
      {children}
    </View>
  );
}
