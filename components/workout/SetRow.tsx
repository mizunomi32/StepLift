import * as Haptics from 'expo-haptics';
import { Pressable, Text, TextInput, View } from 'react-native';
import type { ActiveWorkoutSet } from '@/types/workout';

interface SetRowProps {
  set: ActiveWorkoutSet;
  onUpdate: (data: Partial<ActiveWorkoutSet>) => void;
  onToggleComplete: () => void;
  onRemove: () => void;
}

export default function SetRow({ set, onUpdate, onToggleComplete, onRemove }: SetRowProps) {
  const handleWeightChange = (text: string) => {
    const value = text === '' ? null : parseFloat(text);
    onUpdate({ weightKg: value });
  };

  const handleRepsChange = (text: string) => {
    const value = text === '' ? null : parseInt(text, 10);
    onUpdate({ reps: value });
  };

  const handleToggleComplete = () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onToggleComplete();
  };

  return (
    <View
      testID={`set-row-${set.id}`}
      className="flex-row items-center py-2 border-b border-gray-800"
    >
      {/* セット番号 */}
      <View className="w-12 items-center">
        <Text className="text-gray-400 text-base">{set.setNumber}</Text>
      </View>

      {/* 重量入力 */}
      <View className="flex-1 px-2">
        <TextInput
          testID="weight-input"
          value={set.weightKg !== null ? set.weightKg.toString() : ''}
          onChangeText={handleWeightChange}
          keyboardType="numeric"
          placeholder="60"
          placeholderTextColor="#6B7280"
          className="bg-gray-900 text-white text-base px-3 py-2 rounded-lg"
        />
      </View>

      {/* 回数入力 */}
      <View className="flex-1 px-2">
        <TextInput
          testID="reps-input"
          value={set.reps !== null ? set.reps.toString() : ''}
          onChangeText={handleRepsChange}
          keyboardType="numeric"
          placeholder="10"
          placeholderTextColor="#6B7280"
          className="bg-gray-900 text-white text-base px-3 py-2 rounded-lg"
        />
      </View>

      {/* 完了チェックボックス */}
      <Pressable
        testID="complete-checkbox"
        onPress={handleToggleComplete}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: set.isCompleted }}
        className="w-12 h-12 items-center justify-center"
      >
        <View
          className={`w-6 h-6 rounded border-2 items-center justify-center ${
            set.isCompleted ? 'bg-blue-500 border-blue-500' : 'border-gray-600'
          }`}
        >
          {set.isCompleted && <Text className="text-white text-sm">✓</Text>}
        </View>
      </Pressable>

      {/* 削除ボタン */}
      <Pressable
        testID="remove-set-button"
        onPress={onRemove}
        className="w-12 h-12 items-center justify-center"
      >
        <Text className="text-red-500 text-lg">×</Text>
      </Pressable>
    </View>
  );
}
