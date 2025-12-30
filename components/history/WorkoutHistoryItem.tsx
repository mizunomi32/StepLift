import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, useColorScheme } from 'react-native';
import type { WorkoutWithSets } from '@/types/workout';
import { Colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface WorkoutHistoryItemProps {
  workout: WorkoutWithSets;
  onPress: () => void;
}

/**
 * ワークアウト履歴アイテムコンポーネント
 */
export function WorkoutHistoryItem({ workout, onPress }: WorkoutHistoryItemProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  // ワークアウト時間を計算（分）
  const durationMinutes = useMemo(() => {
    if (!workout.finishedAt) return 0;
    const start = new Date(workout.startedAt);
    const end = new Date(workout.finishedAt);
    return Math.round((end.getTime() - start.getTime()) / 1000 / 60);
  }, [workout.startedAt, workout.finishedAt]);

  // 種目数を計算
  const exerciseCount = useMemo(() => {
    if (!workout.sets || workout.sets.length === 0) return 0;
    const exerciseIds = new Set(workout.sets.map((set) => set.exerciseId));
    return exerciseIds.size;
  }, [workout.sets]);

  // セット数
  const setCount = workout.sets?.length || 0;

  // 主な種目名（最大3つ）
  const mainExercises = useMemo(() => {
    if (!workout.sets || workout.sets.length === 0) return 'データなし';

    const exerciseNames = new Map<string, string>();
    workout.sets.forEach((set) => {
      if (!exerciseNames.has(set.exerciseId)) {
        exerciseNames.set(set.exerciseId, set.exercise.name);
      }
    });

    const names = Array.from(exerciseNames.values());
    if (names.length <= 3) {
      return names.join(', ');
    }
    return `${names.slice(0, 3).join(', ')}...`;
  }, [workout.sets]);

  // 開始時刻
  const startTime = useMemo(() => {
    const date = new Date(workout.startedAt);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }, [workout.startedAt]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        { opacity: pressed ? 0.7 : 1 },
      ]}
      testID="workout-history-item"
    >
      <Card padding="md" style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <IconSymbol name="dumbbell.fill" size={24} color={colors.primary} />
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.topRow}>
              <Text style={[styles.timeText, { color: colors.text }]}>
                {startTime}
              </Text>
              <IconSymbol name="chevron.right" size={16} color={colors.subtext} />
            </View>

            <View style={styles.statsRow}>
              <Text style={[styles.statsText, { color: colors.subtext }]}>
                {durationMinutes}分 • {exerciseCount}種目 • {setCount}セット
              </Text>
            </View>

            <View style={styles.exercisesRow}>
              <Text
                style={[styles.exercisesText, { color: colors.subtext }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {mainExercises}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  contentContainer: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsRow: {
    marginBottom: 4,
  },
  statsText: {
    fontSize: 14,
  },
  exercisesRow: {
    marginTop: 2,
  },
  exercisesText: {
    fontSize: 13,
  },
});
