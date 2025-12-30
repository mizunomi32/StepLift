'use client';

import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import ExerciseCard from '@/components/workout/ExerciseCard';
import WorkoutTimer from '@/components/workout/WorkoutTimer';
import { useWorkoutStore } from '@/lib/stores/workout-store';

export default function WorkoutScreen() {
  const router = useRouter();
  const {
    isWorkoutActive,
    activeWorkout,
    startWorkout,
    endWorkout,
    addSet,
    updateSet,
    removeSet,
    toggleSetComplete,
    removeExercise,
  } = useWorkoutStore();

  const handleStartWorkout = () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    startWorkout();
  };

  const handleEndWorkout = async () => {
    Alert.alert('ワークアウトを終了', '記録を保存してワークアウトを終了しますか?', [
      {
        text: 'キャンセル',
        style: 'cancel',
      },
      {
        text: '終了',
        style: 'destructive',
        onPress: async () => {
          if (process.env.EXPO_OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          try {
            await endWorkout();
          } catch (error) {
            console.error('ワークアウト終了エラー:', error);
            Alert.alert('エラー', 'ワークアウトの終了に失敗しました');
          }
        },
      },
    ]);
  };

  const handleAddExercise = () => {
    router.push('/workout/exercise-picker');
  };

  if (!isWorkoutActive || !activeWorkout) {
    return (
      <View testID="workout-screen" className="flex-1 bg-black p-6">
        <View className="flex-1 items-center justify-center">
          <View className="mb-8">
            <Text className="text-white text-3xl font-bold text-center mb-2">
              ワークアウトを開始
            </Text>
            <Text className="text-gray-400 text-center">
              準備ができたらボタンをタップしてください
            </Text>
          </View>

          <Pressable
            testID="start-workout-button"
            onPress={handleStartWorkout}
            className="bg-blue-600 px-8 py-4 rounded-lg active:bg-blue-700"
          >
            <Text className="text-white text-lg font-semibold">開始</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View testID="workout-screen" className="flex-1 bg-black">
      {/* ヘッダー */}
      <View className="px-6 py-4 bg-gray-900 border-b border-gray-800">
        <WorkoutTimer startedAt={activeWorkout.startedAt} />
      </View>

      <ScrollView className="flex-1 px-6 py-4">
        {/* 種目追加ボタン */}
        <Pressable
          testID="add-exercise-button"
          onPress={handleAddExercise}
          className="mb-6 py-4 bg-blue-600 rounded-lg items-center active:bg-blue-700"
        >
          <Text className="text-white font-semibold text-base">+ 種目を追加</Text>
        </Pressable>

        {/* 種目カード一覧 */}
        {activeWorkout.exercises.map((exerciseData) => (
          <ExerciseCard
            key={exerciseData.exercise.id}
            exercise={exerciseData.exercise}
            sets={exerciseData.sets}
            onAddSet={() => addSet(exerciseData.exercise.id)}
            onUpdateSet={(setId, data) => updateSet(exerciseData.exercise.id, setId, data)}
            onRemoveSet={(setId) => removeSet(exerciseData.exercise.id, setId)}
            onToggleComplete={(setId) => toggleSetComplete(exerciseData.exercise.id, setId)}
            onRemoveExercise={() => removeExercise(exerciseData.exercise.id)}
          />
        ))}

        {activeWorkout.exercises.length === 0 && (
          <View className="py-12">
            <Text className="text-gray-500 text-center text-base">
              種目を追加してワークアウトを開始しましょう
            </Text>
          </View>
        )}

        {/* 終了ボタン */}
        <Pressable
          testID="end-workout-button"
          onPress={handleEndWorkout}
          className="mb-8 py-4 bg-red-600 rounded-lg items-center active:bg-red-700"
        >
          <Text className="text-white font-semibold text-base">ワークアウトを終了</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
