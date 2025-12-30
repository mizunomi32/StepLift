import React from 'react';
import {
  TextInput,
  type TextInputProps,
  View,
  Text,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Colors } from '@/constants/colors';

interface InputProps extends TextInputProps {
  /**
   * ラベルテキスト
   */
  label?: string;
  /**
   * エラーメッセージ
   */
  error?: string;
  /**
   * ヘルパーテキスト
   */
  helperText?: string;
}

/**
 * テキスト入力コンポーネント
 *
 * ラベル、エラー表示、ヘルパーテキストをサポート
 */
export function Input({
  label,
  error,
  helperText,
  style,
  ...props
}: InputProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const inputStyle = {
    backgroundColor: colors.cardBackground,
    color: colors.text,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: error ? '#EF4444' : 'transparent',
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
      <TextInput
        {...props}
        style={[inputStyle, style]}
        placeholderTextColor={colors.subtext}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {!error && helperText && (
        <Text style={[styles.helperText, { color: colors.subtext }]}>
          {helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  error: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
});
