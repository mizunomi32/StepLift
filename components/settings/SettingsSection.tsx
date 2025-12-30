import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/colors';

interface SettingsSectionProps {
  /**
   * セクションのタイトル
   */
  title: string;
  /**
   * セクション内の子要素
   */
  children: React.ReactNode;
}

/**
 * 設定セクションコンポーネント
 *
 * 設定画面のセクションをグループ化して表示する
 */
export function SettingsSection({ title, children }: SettingsSectionProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container} testID={`settings-section-${title}`}>
      <Text
        style={[
          styles.title,
          { color: colors.subtext },
        ]}
      >
        {title}
      </Text>
      <View
        style={[
          styles.content,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  content: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
