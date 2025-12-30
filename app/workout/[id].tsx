import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useWorkoutDetail } from '@/lib/hooks/use-workout-history';
import { deleteWorkout, updateWorkout } from '@/lib/db/queries/workouts';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TimeEditButton } from '@/components/workout/TimeEditButton';

export default function WorkoutDetailScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];


  const { id } = useLocalSearchParams<{ id: string }>();
  const { workout, isLoading, error } = useWorkoutDetail(id || '');
  const [isDeleting, setIsDeleting] = useState(false);

  // 削除ハンドラ
  const handleDelete = () => {
    Alert.alert(
      'ワークアウトを削除',
      'このワークアウトを削除しますか?',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              deleteWorkout(id || '');
              router.back();
            } catch (err) {
              console.error('[WorkoutDetail] 削除エラー:', err);
              Alert.alert('エラー', 'ワークアウトの削除に失敗しました');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  // 開始時刻変更ハンドラ
  const handleStartTimeChange = (newTime: Date) => {
    try {
      updateWorkout(id || '', { startedAt: newTime.toISOString() });
      // useWorkoutDetailフックが自動的に再取得するため、手動での状態更新は不要
    } catch (err) {
      console.error('[WorkoutDetail] 開始時刻更新エラー:', err);
      Alert.alert('エラー', '開始時刻の更新に失敗しました');
    }
  };

  // 終了時刻変更ハンドラ
  const handleEndTimeChange = (newTime: Date) => {
    try {
      updateWorkout(id || '', { finishedAt: newTime.toISOString() });
      // useWorkoutDetailフックが自動的に再取得するため、手動での状態更新は不要
    } catch (err) {
      console.error('[WorkoutDetail] 終了時刻更新エラー:', err);
      Alert.alert('エラー', '終了時刻の更新に失敗しました');
    }
  };

  // ローディング状態
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
          testID="loading-indicator"
          style={styles.loader}
        />
      </View>
    );
  }

  // エラー状態
  if (error || !workout) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.subtext }]}>
            ワークアウトが見つかりません
          </Text>
          <Button onPress={() => router.back()}>戻る</Button>
        </View>
      </View>
    );
  }

  // 開始・終了時刻
  const startTime = new Date(workout.startedAt);
  const endTime = workout.finishedAt ? new Date(workout.finishedAt) : null;
  const duration = endTime
    ? Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60)
    : 0;

  // 日付表示
  const dateText = `${startTime.getFullYear()}年${startTime.getMonth() + 1}月${startTime.getDate()}日`;
  const timeText = `${String(startTime.getHours()).padStart(2, '0')}:${String(startTime.getMinutes()).padStart(2, '0')} - ${endTime ? `${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}` : '進行中'}`;

  // 種目ごとにグループ化
  const exerciseGroups = workout.sets.reduce((acc, set) => {
    const exerciseId = set.exerciseId;
    if (!acc[exerciseId]) {
      acc[exerciseId] = {
        exercise: set.exercise,
        sets: [],
      };
    }
    acc[exerciseId].sets.push(set);
    return acc;
  }, {} as Record<string, { exercise: any; sets: typeof workout.sets }>);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ヘッダー */}
      <View style={[styles.header, { borderBottomColor: colors.cardBackground }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </Pressable>

        <View style={styles.headerActions}>
          <Pressable
            onPress={handleDelete}
            style={styles.deleteButton}
            testID="delete-workout-button"
            disabled={isDeleting}
          >
            <IconSymbol name="trash" size={20} color="#EF4444" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 日時情報 */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <IconSymbol name="calendar" size={20} color={colors.subtext} />
            <Text style={[styles.infoText, { color: colors.text }]}>{dateText}</Text>
          </View>

          <Card padding="md" style={styles.timeCard}>
            <View style={styles.timeCardHeader}>
              <IconSymbol name="clock" size={20} color={colors.subtext} />
              <Text style={[styles.durationText, { color: colors.subtext }]}>
                ({duration}分)
              </Text>
            </View>

            <View style={styles.timeEditors}>
              <TimeEditButton
                label="開始時刻"
                time={startTime}
                onChange={handleStartTimeChange}
                testID="edit-start-time-button"
                pickerTestID="start-time-picker"
              />
              {endTime && (
                <TimeEditButton
                  label="終了時刻"
                  time={endTime}
                  onChange={handleEndTimeChange}
                  testID="edit-end-time-button"
                  pickerTestID="end-time-picker"
                />
              )}
            </View>
          </Card>
        </View>

        {/* 種目リスト */}
        <View style={styles.exercisesSection}>
          {Object.values(exerciseGroups).map((group) => (
            <Card key={group.exercise.id} padding="md" style={styles.exerciseCard}>
              <Text style={[styles.exerciseName, { color: colors.text }]}>
                {group.exercise.name}
              </Text>

              <View style={styles.setsTable}>
                {group.sets.map((set) => (
                  <View key={set.id} style={styles.setRow}>
                    <Text style={[styles.setNumber, { color: colors.subtext }]}>
                      {set.setNumber}.
                    </Text>
                    <Text style={[styles.setData, { color: colors.text }]}>
                      {set.weightKg ? `${set.weightKg}kg` : '—'} ×{' '}
                      {set.reps ? `${set.reps}回` : '—'}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          ))}
        </View>

        {/* メモ */}
        {workout.notes && (
          <Card padding="md" style={styles.notesCard}>
            <View style={styles.notesHeader}>
              <IconSymbol name="note.text" size={20} color={colors.subtext} />
              <Text style={[styles.notesTitle, { color: colors.text }]}>メモ</Text>
            </View>
            <Text style={[styles.notesText, { color: colors.subtext }]}>
              {workout.notes}
            </Text>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  deleteButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
  },
  infoSection: {
    marginBottom: 24,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 16,
  },
  timeCard: {
    marginTop: 8,
  },
  timeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  durationText: {
    fontSize: 14,
  },
  timeEditors: {
    gap: 12,
  },
  exercisesSection: {
    gap: 12,
    marginBottom: 24,
  },
  exerciseCard: {
    marginBottom: 0,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  setsTable: {
    gap: 8,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  setNumber: {
    fontSize: 14,
    width: 24,
  },
  setData: {
    fontSize: 16,
    fontWeight: '500',
  },
  notesCard: {
    marginBottom: 0,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
