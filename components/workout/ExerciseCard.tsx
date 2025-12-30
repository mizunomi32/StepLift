import { Pressable, Text, View } from 'react-native';
import type { Exercise } from '@/types/exercise';
import type { ActiveWorkoutSet } from '@/types/workout';
import SetRow from './SetRow';

interface ExerciseCardProps {
  exercise: Exercise;
  sets: ActiveWorkoutSet[];
  onAddSet: () => void;
  onUpdateSet: (setId: string, data: Partial<ActiveWorkoutSet>) => void;
  onRemoveSet: (setId: string) => void;
  onToggleComplete: (setId: string) => void;
  onRemoveExercise: () => void;
}

export default function ExerciseCard({
  exercise,
  sets,
  onAddSet,
  onUpdateSet,
  onRemoveSet,
  onToggleComplete,
  onRemoveExercise,
}: ExerciseCardProps) {
  return (
    <View
      testID={`exercise-card-${exercise.id}`}
      className="bg-gray-900 rounded-lg mb-4 overflow-hidden"
    >
      {/* ヘッダー */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-gray-800">
        <Text className="text-white text-lg font-semibold">{exercise.name}</Text>
        <Pressable
          testID="remove-exercise-button"
          onPress={onRemoveExercise}
          className="w-8 h-8 items-center justify-center"
        >
          <Text className="text-red-500 text-xl">🗑</Text>
        </Pressable>
      </View>

      {/* セット一覧 */}
      <View className="px-4 py-2">
        {/* ヘッダー行 */}
        <View className="flex-row py-2 border-b border-gray-700">
          <View className="w-12 items-center">
            <Text className="text-gray-400 text-sm font-medium">Set</Text>
          </View>
          <View className="flex-1 px-2">
            <Text className="text-gray-400 text-sm font-medium text-center">重量</Text>
          </View>
          <View className="flex-1 px-2">
            <Text className="text-gray-400 text-sm font-medium text-center">回数</Text>
          </View>
          <View className="w-12" />
          <View className="w-12" />
        </View>

        {/* セット行 */}
        {sets.length === 0 ? (
          <View className="py-8">
            <Text className="text-gray-500 text-center">セットを追加してください</Text>
          </View>
        ) : (
          sets.map((set) => (
            <SetRow
              key={set.id}
              set={set}
              onUpdate={(data) => onUpdateSet(set.id, data)}
              onToggleComplete={() => onToggleComplete(set.id)}
              onRemove={() => onRemoveSet(set.id)}
            />
          ))
        )}

        {/* セット追加ボタン */}
        <Pressable
          testID="add-set-button"
          onPress={onAddSet}
          className="mt-3 py-3 bg-gray-800 rounded-lg items-center"
        >
          <Text className="text-blue-500 font-medium">+ セットを追加</Text>
        </Pressable>
      </View>
    </View>
  );
}
