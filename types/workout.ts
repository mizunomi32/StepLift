import type { Exercise, ExerciseRow } from './exercise';

export interface Workout {
  id: string;
  startedAt: string;
  finishedAt: string | null;
  notes: string | null;
  createdAt: string;
}

export interface WorkoutSet {
  id: string;
  workoutId: string;
  exerciseId: string;
  setNumber: number;
  weightKg: number | null;
  reps: number | null;
  notes: string | null;
  createdAt: string;
}

export interface WorkoutWithSets extends Workout {
  sets: (WorkoutSet & { exercise: Exercise })[];
}

// データベースの行データ (snake_case)
export interface WorkoutRow {
  id: string;
  started_at: string;
  finished_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface WorkoutSetRow {
  id: string;
  workout_id: string;
  exercise_id: string;
  set_number: number;
  weight_kg: number | null;
  reps: number | null;
  notes: string | null;
  created_at: string;
}

export interface WorkoutSetWithExerciseRow extends WorkoutSetRow {
  exercise_id: string;
  exercise_name: string;
  exercise_category: string;
  exercise_is_custom: number;
  exercise_created_at: string;
}

// 行データをTypeScriptオブジェクトに変換
export function workoutFromRow(row: WorkoutRow): Workout {
  return {
    id: row.id,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export function workoutSetFromRow(row: WorkoutSetRow): WorkoutSet {
  return {
    id: row.id,
    workoutId: row.workout_id,
    exerciseId: row.exercise_id,
    setNumber: row.set_number,
    weightKg: row.weight_kg,
    reps: row.reps,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export function workoutSetWithExerciseFromRow(row: WorkoutSetWithExerciseRow): WorkoutSet & { exercise: Exercise } {
  return {
    id: row.id,
    workoutId: row.workout_id,
    exerciseId: row.exercise_id,
    setNumber: row.set_number,
    weightKg: row.weight_kg,
    reps: row.reps,
    notes: row.notes,
    createdAt: row.created_at,
    exercise: {
      id: row.exercise_id,
      name: row.exercise_name,
      category: row.exercise_category as any,
      isCustom: row.exercise_is_custom === 1,
      createdAt: row.exercise_created_at,
    },
  };
}

// アクティブワークアウト用の型
export interface ActiveWorkoutSet {
  id: string;
  exerciseId: string;
  setNumber: number;
  weightKg: number | null;
  reps: number | null;
  isCompleted: boolean;
}

export interface ActiveWorkout {
  id: string;
  startedAt: string;
  exercises: {
    exercise: Exercise;
    sets: ActiveWorkoutSet[];
  }[];
}
