import { beforeEach, describe, expect, it } from '@jest/globals';
import * as setQueries from '@/lib/db/queries/workout-sets';
import * as workoutQueries from '@/lib/db/queries/workouts';
import type { Exercise } from '@/types/exercise';
import { useWorkoutStore } from './workout-store';

// モック
jest.mock('@/lib/db/queries/workouts');
jest.mock('@/lib/db/queries/workout-sets');

describe('useWorkoutStore', () => {
  const mockExercise: Exercise = {
    id: 'ex1',
    name: 'ベンチプレス',
    category: 'chest',
    isCustom: false,
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    // ストアをリセット
    const store = useWorkoutStore.getState();
    store.discardWorkout();
    jest.clearAllMocks();
  });

  describe('startWorkout', () => {
    it('ワークアウトを開始できる', () => {
      const { startWorkout } = useWorkoutStore.getState();

      startWorkout();

      const state = useWorkoutStore.getState();
      expect(state.isWorkoutActive).toBe(true);
      expect(state.activeWorkout).not.toBeNull();
      expect(state.activeWorkout?.exercises).toEqual([]);
    });

    it('既にアクティブなワークアウトがある場合はエラーをスローする', () => {
      const { startWorkout } = useWorkoutStore.getState();

      startWorkout();

      expect(() => startWorkout()).toThrow('すでにアクティブなワークアウトがあります');
    });
  });

  describe('addExercise', () => {
    it('種目を追加できる', () => {
      const { startWorkout, addExercise } = useWorkoutStore.getState();

      startWorkout();
      addExercise(mockExercise);

      const state = useWorkoutStore.getState();
      expect(state.activeWorkout?.exercises).toHaveLength(1);
      expect(state.activeWorkout?.exercises[0].exercise).toEqual(mockExercise);
      expect(state.activeWorkout?.exercises[0].sets).toEqual([]);
    });

    it('アクティブなワークアウトがない場合はエラーをスローする', () => {
      const { addExercise } = useWorkoutStore.getState();

      expect(() => addExercise(mockExercise)).toThrow('アクティブなワークアウトがありません');
    });
  });

  describe('removeExercise', () => {
    it('種目を削除できる', () => {
      const { startWorkout, addExercise, removeExercise } = useWorkoutStore.getState();

      startWorkout();
      addExercise(mockExercise);
      removeExercise(mockExercise.id);

      const state = useWorkoutStore.getState();
      expect(state.activeWorkout?.exercises).toHaveLength(0);
    });
  });

  describe('addSet', () => {
    it('セットを追加できる', () => {
      const { startWorkout, addExercise, addSet } = useWorkoutStore.getState();

      startWorkout();
      addExercise(mockExercise);
      addSet(mockExercise.id);

      const state = useWorkoutStore.getState();
      expect(state.activeWorkout?.exercises[0].sets).toHaveLength(1);
      expect(state.activeWorkout?.exercises[0].sets[0].setNumber).toBe(1);
      expect(state.activeWorkout?.exercises[0].sets[0].isCompleted).toBe(false);
    });

    it('複数のセットを追加できる', () => {
      const { startWorkout, addExercise, addSet } = useWorkoutStore.getState();

      startWorkout();
      addExercise(mockExercise);
      addSet(mockExercise.id);
      addSet(mockExercise.id);
      addSet(mockExercise.id);

      const state = useWorkoutStore.getState();
      expect(state.activeWorkout?.exercises[0].sets).toHaveLength(3);
      expect(state.activeWorkout?.exercises[0].sets[0].setNumber).toBe(1);
      expect(state.activeWorkout?.exercises[0].sets[1].setNumber).toBe(2);
      expect(state.activeWorkout?.exercises[0].sets[2].setNumber).toBe(3);
    });
  });

  describe('updateSet', () => {
    it('セットを更新できる', () => {
      const { startWorkout, addExercise, addSet, updateSet } = useWorkoutStore.getState();

      startWorkout();
      addExercise(mockExercise);
      addSet(mockExercise.id);

      const state = useWorkoutStore.getState();
      const setId = state.activeWorkout!.exercises[0].sets[0].id;

      updateSet(mockExercise.id, setId, { weightKg: 100, reps: 10 });

      const updatedState = useWorkoutStore.getState();
      expect(updatedState.activeWorkout?.exercises[0].sets[0].weightKg).toBe(100);
      expect(updatedState.activeWorkout?.exercises[0].sets[0].reps).toBe(10);
    });
  });

  describe('removeSet', () => {
    it('セットを削除できる', () => {
      const { startWorkout, addExercise, addSet, removeSet } = useWorkoutStore.getState();

      startWorkout();
      addExercise(mockExercise);
      addSet(mockExercise.id);
      addSet(mockExercise.id);

      const state = useWorkoutStore.getState();
      const setId = state.activeWorkout!.exercises[0].sets[0].id;

      removeSet(mockExercise.id, setId);

      const updatedState = useWorkoutStore.getState();
      expect(updatedState.activeWorkout?.exercises[0].sets).toHaveLength(1);
      // セット番号が再採番される
      expect(updatedState.activeWorkout?.exercises[0].sets[0].setNumber).toBe(1);
    });
  });

  describe('toggleSetComplete', () => {
    it('セット完了状態をトグルできる', () => {
      const { startWorkout, addExercise, addSet, toggleSetComplete } = useWorkoutStore.getState();

      startWorkout();
      addExercise(mockExercise);
      addSet(mockExercise.id);

      const state = useWorkoutStore.getState();
      const setId = state.activeWorkout!.exercises[0].sets[0].id;

      // 完了にする
      toggleSetComplete(mockExercise.id, setId);
      let updatedState = useWorkoutStore.getState();
      expect(updatedState.activeWorkout?.exercises[0].sets[0].isCompleted).toBe(true);

      // 未完了に戻す
      toggleSetComplete(mockExercise.id, setId);
      updatedState = useWorkoutStore.getState();
      expect(updatedState.activeWorkout?.exercises[0].sets[0].isCompleted).toBe(false);
    });
  });

  describe('endWorkout', () => {
    it('ワークアウトを終了してDBに保存できる', async () => {
      const mockCreateWorkout = workoutQueries.createWorkout as jest.Mock;
      const mockFinishWorkout = workoutQueries.finishWorkout as jest.Mock;
      const mockAddSet = setQueries.addSet as jest.Mock;

      mockCreateWorkout.mockReturnValue({
        id: 'workout1',
        startedAt: new Date().toISOString(),
        finishedAt: null,
        notes: null,
        createdAt: new Date().toISOString(),
      });

      mockFinishWorkout.mockReturnValue({
        id: 'workout1',
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString(),
        notes: null,
        createdAt: new Date().toISOString(),
      });

      mockAddSet.mockImplementation((set: any) => ({
        ...set,
        createdAt: new Date().toISOString(),
      }));

      const { startWorkout, addExercise, addSet, updateSet, toggleSetComplete, endWorkout } =
        useWorkoutStore.getState();

      startWorkout();
      addExercise(mockExercise);
      addSet(mockExercise.id);

      const state = useWorkoutStore.getState();
      const setId = state.activeWorkout!.exercises[0].sets[0].id;
      updateSet(mockExercise.id, setId, { weightKg: 100, reps: 10 });
      toggleSetComplete(mockExercise.id, setId);

      await endWorkout();

      // DBへの保存が呼ばれることを確認
      expect(mockCreateWorkout).toHaveBeenCalled();
      expect(mockFinishWorkout).toHaveBeenCalled();
      expect(mockAddSet).toHaveBeenCalled();

      // ストアがクリアされることを確認
      const finalState = useWorkoutStore.getState();
      expect(finalState.isWorkoutActive).toBe(false);
      expect(finalState.activeWorkout).toBeNull();
    });

    it('セットがないワークアウトも終了できる', async () => {
      const mockCreateWorkout = workoutQueries.createWorkout as jest.Mock;
      const mockFinishWorkout = workoutQueries.finishWorkout as jest.Mock;

      mockCreateWorkout.mockReturnValue({
        id: 'workout1',
        startedAt: new Date().toISOString(),
        finishedAt: null,
        notes: null,
        createdAt: new Date().toISOString(),
      });

      mockFinishWorkout.mockReturnValue({
        id: 'workout1',
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString(),
        notes: null,
        createdAt: new Date().toISOString(),
      });

      const { startWorkout, endWorkout } = useWorkoutStore.getState();

      startWorkout();
      await endWorkout();

      expect(mockCreateWorkout).toHaveBeenCalled();
      expect(mockFinishWorkout).toHaveBeenCalled();
    });

    it('アクティブなワークアウトがない場合はエラーをスローする', async () => {
      const { endWorkout } = useWorkoutStore.getState();

      await expect(endWorkout()).rejects.toThrow('アクティブなワークアウトがありません');
    });
  });

  describe('discardWorkout', () => {
    it('ワークアウトを破棄できる', () => {
      const { startWorkout, addExercise, discardWorkout } = useWorkoutStore.getState();

      startWorkout();
      addExercise(mockExercise);
      discardWorkout();

      const state = useWorkoutStore.getState();
      expect(state.isWorkoutActive).toBe(false);
      expect(state.activeWorkout).toBeNull();
    });
  });
});
