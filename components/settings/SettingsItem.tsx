import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/colors';

interface SettingsItemProps {
  /**
   * 設定項目のラベル
   */
  label: string;
  /**
   * 設定値（オプション）
   */
  value?: string;
  /**
   * タップ時のハンドラ（オプション）
   */
  onPress?: () => void;
  /**
   * 右側に表示するカスタム要素（オプション）
   * valueより優先される
   */
  rightElement?: React.ReactNode;
  /**
   * 最後の項目かどうか（区切り線を表示しない）
   */
  isLast?: boolean;
}

/**
 * 設定項目コンポーネント
 *
 * 設定画面の個別項目を表示する
 */
export function SettingsItem({
  label,
  value,
  onPress,
  rightElement,
  isLast = false,
}: SettingsItemProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const content = (
    <View
      style={[
        styles.container,
        !isLast && {
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={styles.rightContent}>
        {rightElement ? (
          rightElement
        ) : value ? (
          <Text style={[styles.value, { color: colors.subtext }]}>{value}</Text>
        ) : null}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          pressed && { opacity: 0.7 },
        ]}
        testID={`settings-item-${label}`}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      testID={`settings-item-${label}`}
      accessible={false}
      accessibilityState={{ disabled: true }}
    >
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    flex: 1,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: '400',
  },
});
