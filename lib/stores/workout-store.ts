import { create } from 'zustand';
import { addSet as dbAddSet } from '@/lib/db/queries/workout-sets';
import { createWorkout, finishWorkout } from '@/lib/db/queries/workouts';
import type { Exercise } from '@/types/exercise';
import type { ActiveWorkout, ActiveWorkoutSet } from '@/types/workout';

interface WorkoutState {
  // 状態
  activeWorkout: ActiveWorkout | null;
  isWorkoutActive: boolean;

  // アクション
  startWorkout: () => void;
  endWorkout: () => Promise<void>;
  discardWorkout: () => void;

  addExercise: (exercise: Exercise) => void;
  removeExercise: (exerciseId: string) => void;

  addSet: (exerciseId: string) => void;
  updateSet: (exerciseId: string, setId: string, data: Partial<ActiveWorkoutSet>) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  toggleSetComplete: (exerciseId: string, setId: string) => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  activeWorkout: null,
  isWorkoutActive: false,

  startWorkout: () => {
    const { isWorkoutActive } = get();

    if (isWorkoutActive) {
      throw new Error('すでにアクティブなワークアウトがあります');
    }

    const newWorkout: ActiveWorkout = {
      id: `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      startedAt: new Date().toISOString(),
      exercises: [],
    };

    set({
      activeWorkout: newWorkout,
      isWorkoutActive: true,
    });

    console.log('[WorkoutStore] ワークアウトを開始しました');
  },

  addExercise: (exercise: Exercise) => {
    const { activeWorkout } = get();

    if (!activeWorkout) {
      throw new Error('アクティブなワークアウトがありません');
    }

    const updatedWorkout: ActiveWorkout = {
      ...activeWorkout,
      exercises: [
        ...activeWorkout.exercises,
        {
          exercise,
          sets: [],
        },
      ],
    };

    set({ activeWorkout: updatedWorkout });
    console.log('[WorkoutStore] 種目を追加しました:', exercise.name);
  },

  removeExercise: (exerciseId: string) => {
    const { activeWorkout } = get();

    if (!activeWorkout) {
      throw new Error('アクティブなワークアウトがありません');
    }

    const updatedWorkout: ActiveWorkout = {
      ...activeWorkout,
      exercises: activeWorkout.exercises.filter((e) => e.exercise.id !== exerciseId),
    };

    set({ activeWorkout: updatedWorkout });
    console.log('[WorkoutStore] 種目を削除しました:', exerciseId);
  },

  addSet: (exerciseId: string) => {
    const { activeWorkout } = get();

    if (!activeWorkout) {
      throw new Error('アクティブなワークアウトがありません');
    }

    const exerciseIndex = activeWorkout.exercises.findIndex((e) => e.exercise.id === exerciseId);
    if (exerciseIndex === -1) {
      throw new Error('種目が見つかりません');
    }

    const currentSets = activeWorkout.exercises[exerciseIndex].sets;
    const newSetNumber = currentSets.length + 1;

    const newSet: ActiveWorkoutSet = {
      id: `temp_set_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      exerciseId,
      setNumber: newSetNumber,
      weightKg: null,
      reps: null,
      isCompleted: false,
    };

    const updatedExercises = [...activeWorkout.exercises];
    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      sets: [...currentSets, newSet],
    };

    const updatedWorkout: ActiveWorkout = {
      ...activeWorkout,
      exercises: updatedExercises,
    };

    set({ activeWorkout: updatedWorkout });
    console.log('[WorkoutStore] セットを追加しました:', newSet);
  },

  updateSet: (exerciseId: string, setId: string, data: Partial<ActiveWorkoutSet>) => {
    const { activeWorkout } = get();

    if (!activeWorkout) {
      throw new Error('アクティブなワークアウトがありません');
    }

    const exerciseIndex = activeWorkout.exercises.findIndex((e) => e.exercise.id === exerciseId);
    if (exerciseIndex === -1) {
      throw new Error('種目が見つかりません');
    }

    const setIndex = activeWorkout.exercises[exerciseIndex].sets.findIndex((s) => s.id === setId);
    if (setIndex === -1) {
      throw new Error('セットが見つかりません');
    }

    const updatedExercises = [...activeWorkout.exercises];
    const updatedSets = [...updatedExercises[exerciseIndex].sets];
    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      ...data,
    };

    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      sets: updatedSets,
    };

    const updatedWorkout: ActiveWorkout = {
      ...activeWorkout,
      exercises: updatedExercises,
    };

    set({ activeWorkout: updatedWorkout });
    console.log('[WorkoutStore] セットを更新しました:', setId, data);
  },

  removeSet: (exerciseId: string, setId: string) => {
    const { activeWorkout } = get();

    if (!activeWorkout) {
      throw new Error('アクティブなワークアウトがありません');
    }

    const exerciseIndex = activeWorkout.exercises.findIndex((e) => e.exercise.id === exerciseId);
    if (exerciseIndex === -1) {
      throw new Error('種目が見つかりません');
    }

    const updatedExercises = [...activeWorkout.exercises];
    let updatedSets = updatedExercises[exerciseIndex].sets.filter((s) => s.id !== setId);

    // セット番号を再採番
    updatedSets = updatedSets.map((set, index) => ({
      ...set,
      setNumber: index + 1,
    }));

    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      sets: updatedSets,
    };

    const updatedWorkout: ActiveWorkout = {
      ...activeWorkout,
      exercises: updatedExercises,
    };

    set({ activeWorkout: updatedWorkout });
    console.log('[WorkoutStore] セットを削除しました:', setId);
  },

  toggleSetComplete: (exerciseId: string, setId: string) => {
    const { activeWorkout } = get();

    if (!activeWorkout) {
      throw new Error('アクティブなワークアウトがありません');
    }

    const exerciseIndex = activeWorkout.exercises.findIndex((e) => e.exercise.id === exerciseId);
    if (exerciseIndex === -1) {
      throw new Error('種目が見つかりません');
    }

    const setIndex = activeWorkout.exercises[exerciseIndex].sets.findIndex((s) => s.id === setId);
    if (setIndex === -1) {
      throw new Error('セットが見つかりません');
    }

    const updatedExercises = [...activeWorkout.exercises];
    const updatedSets = [...updatedExercises[exerciseIndex].sets];
    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      isCompleted: !updatedSets[setIndex].isCompleted,
    };

    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      sets: updatedSets,
    };

    const updatedWorkout: ActiveWorkout = {
      ...activeWorkout,
      exercises: updatedExercises,
    };

    set({ activeWorkout: updatedWorkout });
    console.log('[WorkoutStore] セット完了状態をトグルしました:', setId);
  },

  endWorkout: async () => {
    const { activeWorkout } = get();

    if (!activeWorkout) {
      throw new Error('アクティブなワークアウトがありません');
    }

    try {
      // データベースにワークアウトを作成
      const workout = createWorkout(activeWorkout.startedAt);

      // 各セットをデータベースに保存
      for (const exerciseData of activeWorkout.exercises) {
        for (const set of exerciseData.sets) {
          // 完了したセットのみを保存
          if (set.isCompleted) {
            dbAddSet({
              workoutId: workout.id,
              exerciseId: set.exerciseId,
              setNumber: set.setNumber,
              weightKg: set.weightKg,
              reps: set.reps,
              notes: null,
            });
          }
        }
      }

      // ワークアウトを終了
      finishWorkout(workout.id);

      // ストアをクリア
      set({
        activeWorkout: null,
        isWorkoutActive: false,
      });

      console.log('[WorkoutStore] ワークアウトを終了してDBに保存しました:', workout.id);
    } catch (error) {
      console.error('[WorkoutStore] ワークアウトの終了エラー:', error);
      throw error;
    }
  },

  discardWorkout: () => {
    set({
      activeWorkout: null,
      isWorkoutActive: false,
    });

    console.log('[WorkoutStore] ワークアウトを破棄しました');
  },
}));
