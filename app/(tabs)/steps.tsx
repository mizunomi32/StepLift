import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useStepsStore } from '@/lib/stores/steps-store';
import { StepGoalRing } from '@/components/steps/StepGoalRing';
import { StepStats } from '@/components/steps/StepStats';
import { WeeklyStepChart } from '@/components/steps/WeeklyStepChart';
import { getTodaySteps } from '@/lib/db/queries/steps';
import { calculateDistance, calculateCalories } from '@/lib/utils/step-calculations';

export default function StepsScreen() {
  const {
    todaySteps,
    dailyGoal,
    weeklyRecords,
    startTracking,
    loadWeeklyRecords,
  } = useStepsStore();

  useEffect(() => {
    startTracking();
    loadWeeklyRecords();
  }, []);

  const isAchieved = todaySteps >= dailyGoal;
  const todayRecord = weeklyRecords.find(
    (r) => r.date === new Date().toISOString().split('T')[0]
  );

  const distanceKm = todayRecord?.distanceKm ?? calculateDistance(todaySteps);
  const calories = todayRecord?.calories ?? calculateCalories(todaySteps);

  return (
    <ScrollView
      testID="steps-screen"
      className="flex-1 bg-black"
      contentContainerClassName="p-6"
    >
      {/* 円形プログレスリング */}
      <View className="items-center mt-8 mb-6">
        <StepGoalRing currentSteps={todaySteps} goalSteps={dailyGoal} />
      </View>

      {/* 目標情報 */}
      <View className="mb-6">
        <Link href="/steps/goal-setting" asChild>
          <TouchableOpacity
            testID="goal-setting-link"
            className="flex-row items-center justify-center p-4 bg-gray-900 rounded-lg"
          >
            <Text className="text-gray-400 mr-2">🎯 目標:</Text>
            <Text className="text-white font-semibold">
              {dailyGoal.toLocaleString('ja-JP')}歩
            </Text>
            {isAchieved && (
              <>
                <Text className="text-green-500 ml-3 font-semibold">✓ 達成!</Text>
              </>
            )}
            <Text className="text-gray-500 ml-auto">›</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* 統計カード */}
      <View className="mb-6">
        <StepStats distanceKm={distanceKm} calories={calories} />
      </View>

      {/* 週間グラフ */}
      <View className="mb-6">
        <WeeklyStepChart records={weeklyRecords} goal={dailyGoal} />
      </View>
    </ScrollView>
  );
}
