import { create } from 'zustand';
import { createCustomExercise, getAllExercises } from '@/lib/db/queries/exercises';
import type { Exercise, ExerciseCategory } from '@/types/exercise';

interface ExerciseState {
  exercises: Exercise[];
  recentExercises: Exercise[];

  loadExercises: () => Promise<void>;
  getExercisesByCategory: (category: ExerciseCategory) => Exercise[];
  addCustomExercise: (name: string, category: ExerciseCategory) => Promise<void>;
  addToRecent: (exerciseId: string) => void;
}

const MAX_RECENT_EXERCISES = 10;

export const useExerciseStore = create<ExerciseState>((set, get) => ({
  exercises: [],
  recentExercises: [],

  loadExercises: async () => {
    try {
      const exercises = getAllExercises();
      set({ exercises });
      console.log('[ExerciseStore] 種目を読み込みました:', exercises.length);
    } catch (error) {
      console.error('[ExerciseStore] 種目の読み込みエラー:', error);
      set({ exercises: [] });
    }
  },

  getExercisesByCategory: (category: ExerciseCategory) => {
    const { exercises } = get();
    return exercises.filter((exercise) => exercise.category === category);
  },

  addCustomExercise: async (name: string, category: ExerciseCategory) => {
    try {
      const newExercise = createCustomExercise({
        name,
        category,
        isCustom: true,
      });

      const { exercises } = get();
      set({ exercises: [...exercises, newExercise] });

      console.log('[ExerciseStore] カスタム種目を追加しました:', newExercise);
    } catch (error) {
      console.error('[ExerciseStore] カスタム種目の追加エラー:', error);
      throw error;
    }
  },

  addToRecent: (exerciseId: string) => {
    const { exercises, recentExercises } = get();

    // 種目が存在するか確認
    const exercise = exercises.find((e) => e.id === exerciseId);
    if (!exercise) {
      console.warn('[ExerciseStore] 種目が見つかりません:', exerciseId);
      return;
    }

    // 既に最近使用した種目に含まれている場合は削除
    const filteredRecent = recentExercises.filter((e) => e.id !== exerciseId);

    // 先頭に追加
    const updatedRecent = [exercise, ...filteredRecent];

    // 最大件数まで保持
    const trimmedRecent = updatedRecent.slice(0, MAX_RECENT_EXERCISES);

    set({ recentExercises: trimmedRecent });
    console.log('[ExerciseStore] 最近使用した種目に追加しました:', exercise.name);
  },
}));
