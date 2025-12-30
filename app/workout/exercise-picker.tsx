'use client';

import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, SectionList } from 'react-native';
import { useRouter } from 'expo-router';
import { getAllExercises } from '@/lib/db/queries/exercises';
import { useWorkoutStore } from '@/lib/stores/workout-store';
import type { Exercise, ExerciseCategory } from '@/types/exercise';

const CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  chest: '胸',
  back: '背中',
  shoulders: '肩',
  arms: '腕',
  legs: '脚',
  core: '体幹',
  cardio: '有酸素',
};

export default function ExercisePickerScreen() {
  const router = useRouter();
  const { addExercise } = useWorkoutStore();
  const [searchQuery, setSearchQuery] = useState('');

  const allExercises = useMemo(() => {
    try {
      return getAllExercises();
    } catch (error) {
      console.error('種目取得エラー:', error);
      return [];
    }
  }, []);

  const filteredExercises = useMemo(() => {
    if (!searchQuery.trim()) {
      return allExercises;
    }

    const query = searchQuery.toLowerCase().trim();
    return allExercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(query)
    );
  }, [allExercises, searchQuery]);

  const exercisesByCategory = useMemo(() => {
    const categories: ExerciseCategory[] = ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardio'];
    return categories
      .map((category) => ({
        title: CATEGORY_LABELS[category],
        category,
        data: filteredExercises.filter((ex) => ex.category === category),
      }))
      .filter((section) => section.data.length > 0);
  }, [filteredExercises]);

  const handleSelectExercise = (exercise: Exercise) => {
    addExercise(exercise);
    router.back();
  };

  const handleAddCustomExercise = () => {
    // TODO: カスタム種目追加モーダルを実装
    console.log('カスタム種目追加');
  };

  return (
    <View testID="exercise-picker-screen" className="flex-1 bg-black">
      {/* ヘッダー */}
      <View className="px-6 py-4 bg-gray-900 border-b border-gray-800">
        <View className="flex-row items-center mb-4">
          <Pressable onPress={() => router.back()} className="mr-4">
            <Text className="text-blue-500 text-lg">←</Text>
          </Pressable>
          <Text className="text-white text-xl font-semibold">種目を選択</Text>
        </View>

        {/* 検索バー */}
        <TextInput
          testID="exercise-search-input"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="種目を検索..."
          placeholderTextColor="#6B7280"
          className="bg-gray-800 text-white px-4 py-3 rounded-lg"
        />
      </View>

      {/* 種目一覧 */}
      <SectionList
        sections={exercisesByCategory}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => (
          <View
            testID={`category-section-${section.category}`}
            className="px-6 py-3 bg-gray-900"
          >
            <Text className="text-white font-semibold text-base">{section.title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <Pressable
            testID={`exercise-item-${item.id}`}
            onPress={() => handleSelectExercise(item)}
            className="px-6 py-4 border-b border-gray-800 active:bg-gray-900"
          >
            <Text className="text-white text-base">{item.name}</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <View className="py-12">
            <Text className="text-gray-500 text-center">種目が見つかりませんでした</Text>
          </View>
        }
        ListFooterComponent={
          <View className="px-6 py-4">
            <Pressable
              testID="add-custom-exercise-button"
              onPress={handleAddCustomExercise}
              className="py-4 bg-gray-800 rounded-lg items-center active:bg-gray-700"
            >
              <Text className="text-blue-500 font-medium">+ カスタム種目を追加</Text>
            </Pressable>
          </View>
        }
        className="flex-1"
      />
    </View>
  );
}
