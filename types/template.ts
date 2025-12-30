export interface TemplateExercise {
  exerciseId: string;
  defaultSets: number;
  defaultReps: number | null;
  defaultWeight: number | null;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: TemplateExercise[];
  createdAt: string;
}

// データベースの行データ (snake_case)
export interface WorkoutTemplateRow {
  id: string;
  name: string;
  exercises: string; // JSON文字列
  created_at: string;
}

// 行データをTypeScriptオブジェクトに変換
export function workoutTemplateFromRow(row: WorkoutTemplateRow): WorkoutTemplate {
  return {
    id: row.id,
    name: row.name,
    exercises: JSON.parse(row.exercises) as TemplateExercise[],
    createdAt: row.created_at,
  };
}

// TypeScriptオブジェクトを行データに変換
export function workoutTemplateToRow(
  template: Omit<WorkoutTemplate, 'id' | 'createdAt'>
): Omit<WorkoutTemplateRow, 'id' | 'created_at'> {
  return {
    name: template.name,
    exercises: JSON.stringify(template.exercises),
  };
}
