import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, useColorScheme } from 'react-native';
import type { WorkoutWithSets } from '@/types/workout';
import { Colors } from '@/constants/colors';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface WorkoutCalendarProps {
  workouts: WorkoutWithSets[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onMonthChange: (month: string) => void;
}

/**
 * ワークアウトカレンダーコンポーネント
 */
export function WorkoutCalendar({
  workouts,
  selectedDate,
  onSelectDate,
  onMonthChange,
}: WorkoutCalendarProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  // 現在表示中の月
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    onMonthChange(currentMonth);
  }, [currentMonth, onMonthChange]);

  // ワークアウト実施日のセット
  const workoutDates = useMemo(() => {
    const dates = new Set<number>();
    workouts.forEach((workout) => {
      const date = new Date(workout.startedAt);
      dates.add(date.getDate());
    });
    return dates;
  }, [workouts]);

  // カレンダーの日付配列を生成
  const calendarDays = useMemo(() => {
    const [year, month] = currentMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    // 月の最初の日の前の空白
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // 月の日付
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [currentMonth]);

  // 前月へ移動
  const goToPreviousMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const newMonth = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
    setCurrentMonth(newMonth);
  };

  // 次月へ移動
  const goToNextMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const newMonth = `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
    setCurrentMonth(newMonth);
  };

  // 日付選択ハンドラ
  const handleDayPress = (day: number) => {
    const [year, month] = currentMonth.split('-').map(Number);
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onSelectDate(dateStr);
  };

  // 日付が選択中かチェック
  const isDateSelected = (day: number): boolean => {
    if (!selectedDate) return false;
    const [year, month] = currentMonth.split('-').map(Number);
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return selectedDate === dateStr;
  };

  return (
    <View style={styles.container} testID="workout-calendar">
      {/* ヘッダー: 月表示と移動ボタン */}
      <View style={styles.header}>
        <Pressable
          onPress={goToPreviousMonth}
          style={styles.monthButton}
          testID="prev-month-button"
        >
          <IconSymbol name="chevron.left" size={20} color={colors.text} />
        </Pressable>

        <Text style={[styles.monthText, { color: colors.text }]}>
          {(() => {
            const [year, month] = currentMonth.split('-').map(Number);
            return `${year}年${month}月`;
          })()}
        </Text>

        <Pressable
          onPress={goToNextMonth}
          style={styles.monthButton}
          testID="next-month-button"
        >
          <IconSymbol name="chevron.right" size={20} color={colors.text} />
        </Pressable>
      </View>

      {/* 曜日ヘッダー */}
      <View style={styles.weekDaysRow}>
        {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
          <View key={index} style={styles.weekDayCell}>
            <Text style={[styles.weekDayText, { color: colors.subtext }]}>{day}</Text>
          </View>
        ))}
      </View>

      {/* カレンダーグリッド */}
      <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }

          const hasWorkout = workoutDates.has(day);
          const selected = isDateSelected(day);

          return (
            <Pressable
              key={day}
              style={[
                styles.dayCell,
                selected && { backgroundColor: colors.primary },
              ]}
              onPress={() => handleDayPress(day)}
              testID={`calendar-day-${day}`}
            >
              <Text
                style={[
                  styles.dayText,
                  { color: selected ? '#FFFFFF' : colors.text },
                ]}
              >
                {day}
              </Text>
              {hasWorkout && (
                <View
                  style={[styles.workoutDot, { backgroundColor: selected ? '#FFFFFF' : colors.primary }]}
                  testID={`workout-dot-${day}`}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  monthButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // 7日分
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  workoutDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
