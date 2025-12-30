import "@/global.css";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { initializeDatabase } from '@/lib/db';
import { testDatabaseInitialization } from '@/lib/db/test-db';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // データベース初期化
  useEffect(() => {
    try {
      console.log('[App] データベース初期化を開始');
      initializeDatabase();
      console.log('[App] データベース初期化が完了しました');

      // テスト実行 (開発時のみ)
      if (__DEV__) {
        console.log('[App] データベーステストを実行中...');
        testDatabaseInitialization();
      }
    } catch (error) {
      console.error('[App] データベース初期化エラー:', error);
    }
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
