import "@/global.css";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { initializeDatabase } from '@/lib/db';
import * as healthkit from '@/lib/services/healthkit';
import { useStepsStore } from '@/lib/stores/steps-store';

const HEALTHKIT_PERMISSION_KEY = '@steplift_healthkit_permission_requested';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const syncWithHealthAPI = useStepsStore((state) => state.syncWithHealthAPI);

  // データベース初期化
  useEffect(() => {
    try {
      console.log('[App] データベース初期化を開始');
      initializeDatabase();
      console.log('[App] データベース初期化が完了しました');
    } catch (error) {
      console.error('[App] データベース初期化エラー:', error);
    }
  }, []);

  // HealthKit権限リクエスト（初回起動時）
  useEffect(() => {
    const requestHealthKitPermissionIfNeeded = async () => {
      // iOSでない場合はスキップ
      if (Platform.OS !== 'ios') {
        return;
      }

      // Expo Goで実行している場合はスキップ
      if (Constants.appOwnership === 'expo') {
        return;
      }

      try {
        // 既に権限リクエストを行ったかチェック
        const hasRequested = await AsyncStorage.getItem(HEALTHKIT_PERMISSION_KEY);
        if (hasRequested) {
          console.log('[App] HealthKit権限は既にリクエスト済み');
          return;
        }

        // 少し遅延させてからダイアログを表示（データベース初期化後）
        setTimeout(() => {
          Alert.alert(
            '歩数データの連携',
            'StepLiftはiPhoneの「ヘルスケア」アプリと連携して、歩数データを自動的に記録できます。\n\n連携を有効にしますか？',
            [
              {
                text: '後で',
                style: 'cancel',
                onPress: async () => {
                  // リクエスト済みフラグを保存（後で設定画面から有効化可能）
                  await AsyncStorage.setItem(HEALTHKIT_PERMISSION_KEY, 'asked');
                  console.log('[App] HealthKit権限リクエストをスキップ');
                },
              },
              {
                text: '連携する',
                onPress: async () => {
                  try {
                    const granted = await healthkit.requestHealthKitPermissions();

                    if (granted) {
                      // 歩数データを同期
                      await syncWithHealthAPI();
                      Alert.alert(
                        '連携完了',
                        'ヘルスケアとの連携が完了しました。歩数データが自動的に同期されます。'
                      );
                    }

                    // リクエスト済みフラグを保存
                    await AsyncStorage.setItem(HEALTHKIT_PERMISSION_KEY, 'granted');
                    console.log('[App] HealthKit権限リクエスト完了');
                  } catch (error) {
                    console.error('[App] HealthKit権限リクエストエラー:', error);
                    await AsyncStorage.setItem(HEALTHKIT_PERMISSION_KEY, 'error');
                  }
                },
              },
            ]
          );
        }, 1000); // 1秒遅延
      } catch (error) {
        console.error('[App] HealthKit権限チェックエラー:', error);
      }
    };

    requestHealthKitPermissionIfNeeded();
  }, [syncWithHealthAPI]);

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
