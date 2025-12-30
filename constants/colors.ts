/**
 * カラーパレット定義
 *
 * ダークモード/ライトモード対応のカラーシステム
 */

export const Colors = {
  dark: {
    background: '#0A0A0A',
    cardBackground: '#1C1C1E',
    primary: '#22C55E',
    secondary: '#3B82F6',
    accent: '#F59E0B',
    text: '#FFFFFF',
    subtext: '#9CA3AF',
    border: '#3A3A3C',
  },
  light: {
    background: '#FFFFFF',
    cardBackground: '#F2F2F7',
    primary: '#16A34A',
    secondary: '#2563EB',
    accent: '#D97706',
    text: '#000000',
    subtext: '#6B7280',
    border: '#E5E7EB',
  },
} as const;

export type ColorScheme = 'dark' | 'light';
export type ColorPalette = typeof Colors.dark;
