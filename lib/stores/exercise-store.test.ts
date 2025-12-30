import * as exerciseQueries from '@/lib/db/queries/exercises';
import type { Exercise, ExerciseCategory } from '@/types/exercise';
import { useExerciseStore } from './exercise-store';

// モック
jest.mock('@/lib/db/queries/exercises');

describe('useExerciseStore', () => {
  const mockExercises: Exercise[] = [
    {
      id: 'ex1',
      name: 'ベンチプレス',
      category: 'chest',
      isCustom: false,
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'ex2',
      name: 'スクワット',
      category: 'legs',
      isCustom: false,
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'ex3',
      name: 'カスタム種目',
      category: 'chest',
      isCustom: true,
      createdAt: '2024-01-02T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    // ストアをリセット
    const store = useExerciseStore.getState();
    store.exercises = [];
    store.recentExercises = [];
    jest.clearAllMocks();
  });

  describe('loadExercises', () => {
    it('種目一覧を読み込める', async () => {
      const mockGetAllExercises = exerciseQueries.getAllExercises as jest.Mock;
      mockGetAllExercises.mockReturnValue(mockExercises);

      const { loadExercises } = useExerciseStore.getState();
      await loadExercises();

      const state = useExerciseStore.getState();
      expect(state.exercises).toEqual(mockExercises);
      expect(mockGetAllExercises).toHaveBeenCalled();
    });

    it('エラーが発生した場合は空配列を設定する', async () => {
      const mockGetAllExercises = exerciseQueries.getAllExercises as jest.Mock;
      mockGetAllExercises.mockImplementation(() => {
        throw new Error('Database error');
      });

      const { loadExercises } = useExerciseStore.getState();
      await loadExercises();

      const state = useExerciseStore.getState();
      expect(state.exercises).toEqual([]);
    });
  });

  describe('getExercisesByCategory', () => {
    it('カテゴリ別に種目を取得できる', async () => {
      const mockGetAllExercises = exerciseQueries.getAllExercises as jest.Mock;
      mockGetAllExercises.mockReturnValue(mockExercises);

      const { loadExercises, getExercisesByCategory } = useExerciseStore.getState();
      await loadExercises();

      const chestExercises = getExercisesByCategory('chest');
      expect(chestExercises).toHaveLength(2);
      expect(chestExercises[0].category).toBe('chest');
      expect(chestExercises[1].category).toBe('chest');

      const legExercises = getExercisesByCategory('legs');
      expect(legExercises).toHaveLength(1);
      expect(legExercises[0].category).toBe('legs');
    });

    it('該当する種目がない場合は空配列を返す', async () => {
      const mockGetAllExercises = exerciseQueries.getAllExercises as jest.Mock;
      mockGetAllExercises.mockReturnValue(mockExercises);

      const { loadExercises, getExercisesByCategory } = useExerciseStore.getState();
      await loadExercises();

      const cardioExercises = getExercisesByCategory('cardio');
      expect(cardioExercises).toEqual([]);
    });
  });

  describe('addCustomExercise', () => {
    it('カスタム種目を追加できる', async () => {
      const newExercise: Exercise = {
        id: 'custom1',
        name: '新しい種目',
        category: 'arms',
        isCustom: true,
        createdAt: new Date().toISOString(),
      };

      const mockCreateCustomExercise = exerciseQueries.createCustomExercise as jest.Mock;
      mockCreateCustomExercise.mockReturnValue(newExercise);

      const { addCustomExercise } = useExerciseStore.getState();
      await addCustomExercise('新しい種目', 'arms');

      const state = useExerciseStore.getState();
      expect(state.exercises).toContainEqual(newExercise);
      expect(mockCreateCustomExercise).toHaveBeenCalledWith({
        name: '新しい種目',
        category: 'arms',
        isCustom: true,
      });
    });

    it('エラーが発生した場合はスローする', async () => {
      const mockCreateCustomExercise = exerciseQueries.createCustomExercise as jest.Mock;
      mockCreateCustomExercise.mockImplementation(() => {
        throw new Error('Database error');
      });

      const { addCustomExercise } = useExerciseStore.getState();
      await expect(addCustomExercise('新しい種目', 'arms')).rejects.toThrow('Database error');
    });
  });

  describe('addToRecent', () => {
    it('最近使用した種目に追加できる', async () => {
      const mockGetAllExercises = exerciseQueries.getAllExercises as jest.Mock;
      mockGetAllExercises.mockReturnValue(mockExercises);

      const { loadExercises, addToRecent } = useExerciseStore.getState();
      await loadExercises();

      addToRecent('ex1');

      const state = useExerciseStore.getState();
      expect(state.recentExercises).toHaveLength(1);
      expect(state.recentExercises[0].id).toBe('ex1');
    });

    it('同じ種目を追加した場合は先頭に移動する', async () => {
      const mockGetAllExercises = exerciseQueries.getAllExercises as jest.Mock;
      mockGetAllExercises.mockReturnValue(mockExercises);

      const { loadExercises, addToRecent } = useExerciseStore.getState();
      await loadExercises();

      addToRecent('ex1');
      addToRecent('ex2');
      addToRecent('ex1'); // ex1を再度追加

      const state = useExerciseStore.getState();
      expect(state.recentExercises).toHaveLength(2);
      expect(state.recentExercises[0].id).toBe('ex1'); // ex1が先頭に
      expect(state.recentExercises[1].id).toBe('ex2');
    });

    it('最大10件まで保持する', async () => {
      const manyExercises: Exercise[] = Array.from({ length: 15 }, (_, i) => ({
        id: `ex${i}`,
        name: `Exercise ${i}`,
        category: 'chest' as ExerciseCategory,
        isCustom: false,
        createdAt: new Date().toISOString(),
      }));

      const mockGetAllExercises = exerciseQueries.getAllExercises as jest.Mock;
      mockGetAllExercises.mockReturnValue(manyExercises);

      const { loadExercises, addToRecent } = useExerciseStore.getState();
      await loadExercises();

      // 15件追加
      for (let i = 0; i < 15; i++) {
        addToRecent(`ex${i}`);
      }

      const state = useExerciseStore.getState();
      expect(state.recentExercises).toHaveLength(10);
      // 最後に追加した10件が保持される
      expect(state.recentExercises[0].id).toBe('ex14');
      expect(state.recentExercises[9].id).toBe('ex5');
    });

    it('存在しない種目IDの場合は何もしない', async () => {
      const mockGetAllExercises = exerciseQueries.getAllExercises as jest.Mock;
      mockGetAllExercises.mockReturnValue(mockExercises);

      const { loadExercises, addToRecent } = useExerciseStore.getState();
      await loadExercises();

      addToRecent('nonexistent');

      const state = useExerciseStore.getState();
      expect(state.recentExercises).toHaveLength(0);
    });
  });
});
