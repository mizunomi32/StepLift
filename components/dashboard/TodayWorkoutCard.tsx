import { Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { WorkoutWithSets } from '@/types/workout';

interface TodayWorkoutCardProps {
  workout: WorkoutWithSets | null;
  onStartWorkout: () => void;
}

export function TodayWorkoutCard({ workout, onStartWorkout }: TodayWorkoutCardProps) {
  if (!workout) {
    return (
      <Card className="p-4 my-4">
        <Text className="text-lg font-semibold text-white mb-4">今日のワークアウト</Text>
        <Text className="text-gray-400 text-center mb-4">まだ記録がありません</Text>
        <Button onPress={onStartWorkout} fullWidth>
          ワークアウトを開始
        </Button>
      </Card>
    );
  }

  // ワークアウト時間を計算（分単位）
  const durationMinutes = workout.finishedAt
    ? Math.round(
        (new Date(workout.finishedAt).getTime() - new Date(workout.startedAt).getTime()) / 1000 / 60
      )
    : 0;

  // ユニークな種目数を計算
  const uniqueExercises = workout.sets.reduce(
    (acc, set) => {
      if (!acc.find((e) => e.id === set.exercise.id)) {
        acc.push(set.exercise);
      }
      return acc;
    },
    [] as (typeof workout.sets)[0]['exercise'][]
  );

  const exerciseCount = uniqueExercises.length;
  const setCount = workout.sets.length;

  // 主な種目名（最初の1つ）
  const primaryExercise = uniqueExercises[0]?.name || '';
  const otherExerciseCount = exerciseCount - 1;

  return (
    <Card className="p-4">
      <Text className="text-lg font-semibold text-white mb-4">今日のワークアウト</Text>

      <View className="space-y-2">
        <View className="flex-row items-center">
          <Text className="text-gray-400 text-sm mr-2">⏱️</Text>
          <Text className="text-white">{durationMinutes}分</Text>
        </View>

        <View className="flex-row items-center">
          <Text className="text-gray-400 text-sm mr-2">💪</Text>
          <Text className="text-white">
            {exerciseCount}種目 • {setCount}セット
          </Text>
        </View>

        <View className="flex-row items-center">
          <Text className="text-gray-400 text-sm mr-2">📝</Text>
          <Text className="text-white">
            {primaryExercise}
            {otherExerciseCount > 0 && ` 他${otherExerciseCount}種目`}
          </Text>
        </View>
      </View>
    </Card>
  );
}
