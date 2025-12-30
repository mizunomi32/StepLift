import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { TodayStepsCard } from '@/components/dashboard/TodayStepsCard';
import { TodayWorkoutCard } from '@/components/dashboard/TodayWorkoutCard';
import { WeeklySummaryCard } from '@/components/dashboard/WeeklySummaryCard';
import { useStepsStore } from '@/lib/stores/steps-store';
import { useWorkoutStore } from '@/lib/stores/workout-store';
import { calculateWorkoutStreak, calculateStepStreak } from '@/lib/utils/streak';
import { getWorkoutsByDateRange, getWorkoutWithSets } from '@/lib/db/queries/workouts';
import { getStepRecordsByDateRange, getAverageStepsByDateRange } from '@/lib/db/queries/steps';
import type { WorkoutWithSets } from '@/types/workout';
import type { StepRecord } from '@/types/steps';

export default function DashboardScreen() {
  const router = useRouter();
  const { todaySteps, dailyGoal } = useStepsStore();
  const { startWorkout } = useWorkoutStore();

  const [todayWorkout, setTodayWorkout] = useState<WorkoutWithSets | null>(null);
  const [stepStreak, setStepStreak] = useState(0);
  const [workoutStreak, setWorkoutStreak] = useState(0);
  const [weeklyWorkoutCount, setWeeklyWorkoutCount] = useState(0);
  const [weeklyAverageSteps, setWeeklyAverageSteps] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, [todaySteps, dailyGoal]);

  // 画面にフォーカスが戻るたびにデータを再読み込み
  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [todaySteps, dailyGoal])
  );

  const loadDashboardData = () => {
    try {
      // 今日の日付
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      // 週間の日付範囲（過去7日間）
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 6);
      const weekAgoStr = weekAgo.toISOString().split('T')[0];

      // 今日のワークアウトを取得
      const todayWorkouts = getWorkoutsByDateRange(todayStr, todayStr);
      if (todayWorkouts.length > 0) {
        const workoutDetail = getWorkoutWithSets(todayWorkouts[0].id);
        setTodayWorkout(workoutDetail);
      } else {
        setTodayWorkout(null);
      }

      // 週間のワークアウト数を取得
      const weeklyWorkouts = getWorkoutsByDateRange(weekAgoStr, todayStr);
      setWeeklyWorkoutCount(weeklyWorkouts.length);

      // ワークアウトストリークを計算
      const allWorkouts = getWorkoutsByDateRange('2020-01-01', todayStr);
      setWorkoutStreak(calculateWorkoutStreak(allWorkouts));

      // 週間の歩数記録を取得
      const weeklySteps = getStepRecordsByDateRange(weekAgoStr, todayStr);
      const avgSteps = getAverageStepsByDateRange(weekAgoStr, todayStr);
      setWeeklyAverageSteps(avgSteps);

      // 歩数ストリークを計算
      const allStepRecords = getStepRecordsByDateRange('2020-01-01', todayStr);
      setStepStreak(calculateStepStreak(allStepRecords, dailyGoal));
    } catch (error) {
      console.error('[Dashboard] データ読み込みエラー:', error);
    }
  };

  const handleStartWorkout = () => {
    startWorkout();
    router.push('/(tabs)/workout');
  };

  const handleSettingsPress = () => {
    router.push('/settings');
  };

  return (
    <View className="flex-1 bg-black" testID="dashboard-screen">
      <ScrollView className="flex-1">
        {/* ヘッダー */}
        <View className="flex-row items-center justify-between p-4 pt-12">
          <Text className="text-2xl font-bold text-white">StepLift</Text>
          <TouchableOpacity onPress={handleSettingsPress} testID="settings-button">
            <Text className="text-2xl">⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* コンテンツ */}
        <View className="p-4 space-y-4">
          {/* 今日の歩数カード */}
          <TodayStepsCard steps={todaySteps} goal={dailyGoal} streakDays={stepStreak} />

          {/* 今日のワークアウトカード */}
          <TodayWorkoutCard workout={todayWorkout} onStartWorkout={handleStartWorkout} />

          {/* 週間サマリーカード */}
          <WeeklySummaryCard
            workoutCount={weeklyWorkoutCount}
            averageSteps={weeklyAverageSteps}
            streakDays={workoutStreak}
          />
        </View>
      </ScrollView>
    </View>
  );
}
