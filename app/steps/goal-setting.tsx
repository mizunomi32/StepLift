import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useStepsStore } from '@/lib/stores/steps-store';

const PRESETS = [5000, 8000, 10000, 15000];
const STEP_INCREMENT = 500;
const MIN_GOAL = 1000;

export default function GoalSettingScreen() {
  const { dailyGoal, setDailyGoal } = useStepsStore();
  const [selectedGoal, setSelectedGoal] = useState(dailyGoal);
  const [customInput, setCustomInput] = useState(dailyGoal.toString());

  const handlePresetSelect = (preset: number) => {
    setSelectedGoal(preset);
    setCustomInput(preset.toString());
  };

  const handleCustomInput = (text: string) => {
    setCustomInput(text);
    const num = parseInt(text, 10);
    if (!Number.isNaN(num) && num > 0) {
      setSelectedGoal(num);
    }
  };

  const handleIncrement = () => {
    const newGoal = selectedGoal + STEP_INCREMENT;
    setSelectedGoal(newGoal);
    setCustomInput(newGoal.toString());
  };

  const handleDecrement = () => {
    const newGoal = Math.max(MIN_GOAL, selectedGoal - STEP_INCREMENT);
    setSelectedGoal(newGoal);
    setCustomInput(newGoal.toString());
  };

  const handleSave = async () => {
    if (selectedGoal <= 0) {
      return;
    }

    try {
      await setDailyGoal(selectedGoal);
      router.back();
    } catch (error) {
      console.error('目標設定エラー:', error);
    }
  };

  return (
    <ScrollView
      testID="goal-setting-screen"
      className="flex-1 bg-black"
      contentContainerClassName="p-6"
    >
      <Text className="text-2xl font-bold text-white mb-6">歩数目標設定</Text>

      {/* 現在の目標 */}
      <Card className="p-6 mb-6">
        <Text className="text-sm text-gray-400 mb-2">現在の目標</Text>
        <Text className="text-4xl font-bold text-white">
          {selectedGoal.toLocaleString('ja-JP')}
        </Text>
        <Text className="text-lg text-gray-400">歩</Text>
      </Card>

      {/* プリセット */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-white mb-3">おすすめの目標</Text>
        <View className="flex-row flex-wrap gap-3">
          {PRESETS.map((preset) => (
            <TouchableOpacity
              key={preset}
              testID={`preset-${preset}`}
              onPress={() => handlePresetSelect(preset)}
              className={`flex-1 min-w-[45%] p-4 rounded-lg border-2 ${
                selectedGoal === preset
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 bg-gray-900'
              }`}
            >
              <Text
                className={`text-center text-lg font-semibold ${
                  selectedGoal === preset ? 'text-blue-500' : 'text-white'
                }`}
              >
                {preset.toLocaleString('ja-JP')}
              </Text>
              <Text className="text-center text-xs text-gray-400 mt-1">歩</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* カスタム入力 */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-white mb-3">カスタム設定</Text>
        <Card className="p-4">
          {/* ステッパー */}
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              testID="decrement-button"
              onPress={handleDecrement}
              className="w-12 h-12 bg-gray-700 rounded-full items-center justify-center"
            >
              <Text className="text-white text-2xl">−</Text>
            </TouchableOpacity>

            <TextInput
              testID="custom-goal-input"
              value={customInput}
              onChangeText={handleCustomInput}
              keyboardType="number-pad"
              className="flex-1 mx-4 text-center text-2xl font-semibold text-white bg-gray-900 p-3 rounded-lg"
              placeholderTextColor="#6b7280"
            />

            <TouchableOpacity
              testID="increment-button"
              onPress={handleIncrement}
              className="w-12 h-12 bg-gray-700 rounded-full items-center justify-center"
            >
              <Text className="text-white text-2xl">＋</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-center text-sm text-gray-400">
            {STEP_INCREMENT}歩ずつ調整できます
          </Text>
        </Card>
      </View>

      {/* 保存ボタン */}
      <Button testID="save-button" onPress={handleSave} className="mb-6">
        保存
      </Button>
    </ScrollView>
  );
}
