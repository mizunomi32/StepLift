import { Card } from '@/components/ui/Card';
import React from 'react';
import { Text, View } from 'react-native';

interface WeeklySummaryCardProps {
  workoutCount: number;
  averageSteps: number;
  streakDays: number;
}

export function WeeklySummaryCard({
  workoutCount,
  averageSteps,
  streakDays,
}: WeeklySummaryCardProps) {
  const formatNumber = (num: number): string => {
    return num.toLocaleString('ja-JP');
  };

  return (
    <Card className="p-4 my-4">
      <Text className="text-lg font-semibold text-white mb-4">週間サマリー</Text>

      <View className="space-y-3">
        <View className="flex-row items-center">
          <Text className="text-2xl mr-3" testID="icon-workout">
            📊
          </Text>
          <View className="flex-1">
            <Text className="text-sm text-gray-400">ワークアウト</Text>
            <Text className="text-xl font-semibold text-white">{workoutCount}回</Text>
          </View>
        </View>

        <View className="flex-row items-center">
          <Text className="text-2xl mr-3" testID="icon-steps">
            👟
          </Text>
          <View className="flex-1">
            <Text className="text-sm text-gray-400">平均歩数</Text>
            <Text className="text-xl font-semibold text-white">{formatNumber(averageSteps)}歩</Text>
          </View>
        </View>

        <View className="flex-row items-center">
          <Text className="text-2xl mr-3" testID="icon-streak">
            📅
          </Text>
          <View className="flex-1">
            <Text className="text-sm text-gray-400">ストリーク</Text>
            <Text className="text-xl font-semibold text-white">{streakDays}日</Text>
          </View>
        </View>
      </View>
    </Card>
  );
}
