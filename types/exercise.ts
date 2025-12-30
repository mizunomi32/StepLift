export type ExerciseCategory = 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core' | 'cardio';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  isCustom: boolean;
  createdAt: string;
}

// データベースの行データ (snake_case)
export interface ExerciseRow {
  id: string;
  name: string;
  category: ExerciseCategory;
  is_custom: number; // SQLite では boolean が 0/1
  created_at: string;
}

// 行データをTypeScriptオブジェクトに変換
export function exerciseFromRow(row: ExerciseRow): Exercise {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    isCustom: row.is_custom === 1,
    createdAt: row.created_at,
  };
}

// TypeScriptオブジェクトを行データに変換
export function exerciseToRow(
  exercise: Omit<Exercise, 'id' | 'createdAt'>
): Omit<ExerciseRow, 'id' | 'created_at'> {
  return {
    name: exercise.name,
    category: exercise.category,
    is_custom: exercise.isCustom ? 1 : 0,
  };
}
