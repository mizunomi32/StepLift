import React, { useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useHistoryStore } from '@/lib/stores/history-store';
import { WorkoutCalendar } from '@/components/history/WorkoutCalendar';
import { WorkoutHistoryItem } from '@/components/history/WorkoutHistoryItem';

export default function HistoryScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const {
    selectedMonth,
    selectedDate,
    workouts,
    setSelectedMonth,
    setSelectedDate,
    loadWorkouts,
  } = useHistoryStore();

  // 初回レンダリング時に現在月を読み込む
  useEffect(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    loadWorkouts(currentMonth);
  }, []);

  // 画面にフォーカスが戻るたびにデータを再読み込み
  useFocusEffect(
    useCallback(() => {
      // 選択されている月のデータを再読み込み
      if (selectedMonth) {
        loadWorkouts(selectedMonth);
      }
    }, [selectedMonth, loadWorkouts])
  );

  // 選択日のワークアウトをフィルタリング
  const filteredWorkouts = useMemo(() => {
    if (!selectedDate) {
      return workouts;
    }

    return workouts.filter((workout) => {
      const workoutDate = new Date(workout.startedAt).toISOString().split('T')[0];
      return workoutDate === selectedDate;
    });
  }, [workouts, selectedDate]);

  // 月変更ハンドラ
  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    loadWorkouts(month);
  };

  // 日付選択ハンドラ
  const handleDateSelect = (date: string) => {
    if (selectedDate === date) {
      setSelectedDate(null); // 同じ日付をタップで選択解除
    } else {
      setSelectedDate(date);
    }
  };

  // ワークアウト詳細へ遷移
  const handleWorkoutPress = (workoutId: string) => {
    router.push(`/workout/${workoutId}` as any);
  };

  // 選択日の表示用テキスト
  const selectedDateText = useMemo(() => {
    if (!selectedDate) return '全ての履歴';

    const date = new Date(selectedDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];

    return `${month}月${day}日 (${dayOfWeek})`;
  }, [selectedDate]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ヘッダー */}
      <View style={[styles.header, { borderBottomColor: colors.cardBackground }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>履歴</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* カレンダー */}
        <WorkoutCalendar
          workouts={workouts}
          selectedDate={selectedDate}
          onSelectDate={handleDateSelect}
          onMonthChange={handleMonthChange}
        />

        {/* セクションヘッダー */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {selectedDateText}
          </Text>
          {filteredWorkouts.length > 0 && (
            <Text style={[styles.workoutCount, { color: colors.subtext }]}>
              {filteredWorkouts.length}件
            </Text>
          )}
        </View>

        {/* ワークアウトリスト */}
        <View style={styles.workoutList}>
          {filteredWorkouts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.subtext }]}>
                記録がありません
              </Text>
            </View>
          ) : (
            filteredWorkouts.map((workout) => (
              <WorkoutHistoryItem
                key={workout.id}
                workout={workout}
                onPress={() => handleWorkoutPress(workout.id)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  workoutCount: {
    fontSize: 14,
  },
  workoutList: {
    paddingHorizontal: 20,
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});
