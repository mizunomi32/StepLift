import { Card } from '@/components/ui/Card';
import React from 'react';
import { Text, View } from 'react-native';

interface TodayStepsCardProps {
  steps: number;
  goal: number;
  streakDays: number;
}

export function TodayStepsCard({ steps, goal, streakDays }: TodayStepsCardProps) {
  const percentage = goal > 0 ? Math.round((steps / goal) * 100) : 0;
  const progressWidth = Math.min(percentage, 100);

  const formatNumber = (num: number): string => {
    return num.toLocaleString('ja-JP');
  };

  return (
    <Card className="p-4 my-4">
      <Text className="text-lg font-semibold text-white mb-4">今日の歩数</Text>

      <View className="flex-row items-center mb-3">
        {/* 歩数表示 */}
        <View className="flex-1 mr-4">
          <Text className="text-3xl font-bold text-white">{formatNumber(steps)}</Text>
          <Text className="text-sm text-gray-400 mt-1">/ {formatNumber(goal)} 歩</Text>
          <View className="h-2 bg-gray-800 rounded-full mt-2">
            <View
              className="h-2 rounded-full"
              style={{
                width: `${Math.min(progressWidth, 100)}%`,
                backgroundColor: percentage >= 100 ? '#22c55e' : '#3b82f6',
              }}
            />
          </View>
          <Text className="text-base text-blue-400 mt-2">{percentage}%</Text>
        </View>
      </View>

      {/* ストリーク表示 */}
      {streakDays > 0 && (
        <View className="mt-2 pt-3 border-t border-gray-800">
          <Text className="text-sm text-orange-400">
            🔥 {streakDays}日連続達成中
          </Text>
        </View>
      )}
    </Card>
  );
}
