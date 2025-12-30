import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SettingsItem } from '@/components/settings/SettingsItem';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { Colors } from '@/constants/colors';
import * as healthkit from '@/lib/services/healthkit';
import { useSettingsStore } from '@/lib/stores/settings-store';
import { useStepsStore } from '@/lib/stores/steps-store';

/**
 * 設定画面
 *
 * アプリの各種設定を管理する
 */
export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const {
    dailyStepGoal,
    theme,
    weightUnit,
    setDailyStepGoal,
    setTheme,
    setWeightUnit,
    loadSettings,
  } = useSettingsStore();

  const { syncWithHealthAPI } = useStepsStore();

  const [isHealthConnected, setIsHealthConnected] = useState(false);

  // 設定を読み込む
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // 歩数目標の変更ダイアログを表示
  const handleStepGoalPress = () => {
    Alert.prompt(
      '1日の歩数目標',
      '目標歩数を入力してください',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '設定',
          onPress: async (value) => {
            if (value) {
              const steps = parseInt(value, 10);
              if (!Number.isNaN(steps) && steps > 0) {
                await setDailyStepGoal(steps);
              }
            }
          },
        },
      ],
      'plain-text',
      dailyStepGoal.toString()
    );
  };

  // テーマの変更ダイアログを表示
  const handleThemePress = () => {
    Alert.alert('テーマ', 'テーマを選択してください', [
      {
        text: 'ライト',
        onPress: () => setTheme('light'),
      },
      {
        text: 'ダーク',
        onPress: () => setTheme('dark'),
      },
      {
        text: 'システム',
        onPress: () => setTheme('system'),
      },
      { text: 'キャンセル', style: 'cancel' },
    ]);
  };

  // 重量単位のトグル
  const handleWeightUnitToggle = (value: boolean) => {
    setWeightUnit(value ? 'lb' : 'kg');
  };

  // データエクスポート
  const handleExport = async () => {
    try {
      // TODO: 実際のデータを取得してエクスポート
      const data = {
        settings: {
          dailyStepGoal,
          theme,
          weightUnit,
        },
        exportedAt: new Date().toISOString(),
      };

      const jsonString = JSON.stringify(data, null, 2);

      if (Platform.OS === 'web') {
        // Web版: ダウンロード
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `steplift-export-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // ネイティブ: Share API
        await Share.share({
          message: jsonString,
          title: 'StepLift データエクスポート',
        });
      }

      Alert.alert('成功', 'データをエクスポートしました');
    } catch (error) {
      console.error('エクスポートエラー:', error);
      Alert.alert('エラー', 'データのエクスポートに失敗しました');
    }
  };

  // データ削除
  const handleDeleteData = () => {
    Alert.alert(
      'データを削除',
      'すべてのデータを削除します。この操作は取り消せません。本当に削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: 実際のデータ削除処理を実装
              Alert.alert('成功', 'すべてのデータを削除しました');
            } catch (error) {
              console.error('削除エラー:', error);
              Alert.alert('エラー', 'データの削除に失敗しました');
            }
          },
        },
      ]
    );
  };

  // HealthKit連携を開始
  const handleConnectHealth = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('エラー', 'HealthKitはiOSのみで利用可能です');
      return;
    }

    // Expo Goで実行している場合は警告を表示
    if (Constants.appOwnership === 'expo') {
      Alert.alert(
        '開発ビルドが必要',
        'HealthKit連携はネイティブモジュールを使用するため、開発ビルドが必要です。\n\n以下のコマンドで開発ビルドを作成してください：\n\nnpx expo run:ios',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      // 権限をリクエスト
      const granted = await healthkit.requestHealthKitPermissions();

      if (granted) {
        setIsHealthConnected(true);
        // 歩数データを同期
        await syncWithHealthAPI();
        Alert.alert('成功', 'HealthKitと連携しました。歩数データが自動的に同期されます。');
      } else {
        Alert.alert('エラー', 'HealthKitの権限が許可されませんでした');
      }
    } catch (error) {
      console.error('[Settings] HealthKit連携エラー:', error);
      Alert.alert(
        'エラー',
        'HealthKitの連携に失敗しました。開発ビルドで実行していることを確認してください。'
      );
    }
  };

  // ヘルス連携の解除
  const handleDisconnectHealth = () => {
    Alert.alert('ヘルス連携を解除', 'ヘルス連携を解除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '解除',
        style: 'destructive',
        onPress: () => {
          setIsHealthConnected(false);
          Alert.alert('成功', 'ヘルス連携を解除しました');
        },
      },
    ]);
  };

  // テーマの表示名を取得
  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'ライト';
      case 'dark':
        return 'ダーク';
      case 'system':
        return 'システム';
      default:
        return 'システム';
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: '設定',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }}
      />
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
      >
        {/* 目標セクション */}
        <SettingsSection title="目標">
          <SettingsItem
            label="1日の歩数目標"
            value={dailyStepGoal.toLocaleString()}
            onPress={handleStepGoalPress}
            isLast
          />
        </SettingsSection>

        {/* 表示セクション */}
        <SettingsSection title="表示">
          <SettingsItem label="テーマ" value={getThemeLabel()} onPress={handleThemePress} />
          <SettingsItem
            label="重量単位"
            rightElement={
              <View style={styles.switchContainer}>
                <Text style={[styles.unitLabel, { color: colors.subtext }]}>kg</Text>
                <Switch
                  value={weightUnit === 'lb'}
                  onValueChange={handleWeightUnitToggle}
                  trackColor={{
                    false: colors.border,
                    true: colors.primary,
                  }}
                  thumbColor="#FFFFFF"
                />
                <Text style={[styles.unitLabel, { color: colors.subtext }]}>lb</Text>
              </View>
            }
            isLast
          />
        </SettingsSection>

        {/* データセクション */}
        <SettingsSection title="データ">
          <SettingsItem label="エクスポート" onPress={handleExport} />
          <SettingsItem label="データを削除" onPress={handleDeleteData} isLast />
        </SettingsSection>

        {/* ヘルス連携セクション */}
        <SettingsSection title="ヘルス連携">
          <SettingsItem
            label={Platform.OS === 'ios' ? 'HealthKit' : 'Health Connect'}
            value={isHealthConnected ? '接続済み' : '未接続'}
            onPress={isHealthConnected ? handleDisconnectHealth : handleConnectHealth}
            isLast
          />
        </SettingsSection>

        {/* アプリについてセクション */}
        <SettingsSection title="アプリについて">
          <SettingsItem label="バージョン" value={Constants.expoConfig?.version || '1.0.0'} />
          <SettingsItem label="ライセンス" onPress={() => {}} />
          <SettingsItem label="プライバシーポリシー" onPress={() => {}} isLast />
        </SettingsSection>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unitLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});
