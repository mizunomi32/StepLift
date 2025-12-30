import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '@/components/ui/Card';
import type { StepRecord } from '@/types/steps';

interface WeeklyStepChartProps {
  records: StepRecord[];
  goal: number;
}

export function WeeklyStepChart({ records, goal }: WeeklyStepChartProps) {
  const weekdays = ['月', '火', '水', '木', '金', '土', '日'];

  // 過去7日間のデータを作成
  const getLast7Days = () => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const record = records.find((r) => r.date === dateStr);
      const dayOfWeek = date.getDay(); // 0=日, 1=月, ...
      const weekdayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 月曜始まりに変換

      days.push({
        date: dateStr,
        steps: record?.steps || 0,
        weekday: weekdays[weekdayIndex],
      });
    }

    return days;
  };

  const last7Days = getLast7Days();
  const maxSteps = Math.max(...last7Days.map((d) => d.steps), goal);
  const chartHeight = 150;

  return (
    <Card testID="weekly-step-chart" className="p-4">
      <Text className="text-lg font-semibold text-white mb-4">今週の推移</Text>

      <View className="relative" style={{ height: chartHeight }}>
        {/* 目標ライン */}
        <View
          testID="goal-line"
          className="absolute left-0 right-0 border-t border-dashed border-gray-600"
          style={{
            top: chartHeight - (goal / maxSteps) * chartHeight,
          }}
        />

        {/* 棒グラフ */}
        <View className="flex-row items-end justify-around h-full">
          {last7Days.map((day, index) => {
            const barHeight = (day.steps / maxSteps) * chartHeight;
            const isAchieved = day.steps >= goal;

            return (
              <View
                key={day.date}
                testID={`chart-bar-${index}`}
                className="flex-1 items-center justify-end mx-1"
              >
                {/* 棒グラフバー */}
                <View
                  className={`w-full rounded-t ${
                    isAchieved ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{
                    height: Math.max(barHeight, 2), // 最小高さ2px
                  }}
                />
              </View>
            );
          })}
        </View>
      </View>

      {/* 曜日ラベル */}
      <View className="flex-row justify-around mt-2">
        {last7Days.map((day) => (
          <View key={day.date} className="flex-1 items-center">
            <Text className="text-xs text-gray-400">{day.weekday}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}
