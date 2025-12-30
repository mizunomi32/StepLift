/**
 * データベーススキーマ定義
 *
 * すべてのテーブル作成SQL文を定義します。
 */

export const CREATE_EXERCISES_TABLE = `
CREATE TABLE IF NOT EXISTS exercises (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  is_custom INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category);
CREATE INDEX IF NOT EXISTS idx_exercises_is_custom ON exercises(is_custom);
`;

export const CREATE_WORKOUTS_TABLE = `
CREATE TABLE IF NOT EXISTS workouts (
  id TEXT PRIMARY KEY,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_workouts_started_at ON workouts(started_at);
CREATE INDEX IF NOT EXISTS idx_workouts_finished_at ON workouts(finished_at);
`;

export const CREATE_WORKOUT_SETS_TABLE = `
CREATE TABLE IF NOT EXISTS workout_sets (
  id TEXT PRIMARY KEY,
  workout_id TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  set_number INTEGER NOT NULL,
  weight_kg REAL,
  reps INTEGER,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

CREATE INDEX IF NOT EXISTS idx_workout_sets_workout_id ON workout_sets(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_sets_exercise_id ON workout_sets(exercise_id);
`;

export const CREATE_STEP_RECORDS_TABLE = `
CREATE TABLE IF NOT EXISTS step_records (
  id TEXT PRIMARY KEY,
  date TEXT UNIQUE NOT NULL,
  steps INTEGER NOT NULL DEFAULT 0,
  distance_km REAL,
  calories INTEGER,
  source TEXT DEFAULT 'sensor',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_step_records_date ON step_records(date);
`;

export const CREATE_STEP_GOALS_TABLE = `
CREATE TABLE IF NOT EXISTS step_goals (
  id TEXT PRIMARY KEY,
  daily_steps INTEGER NOT NULL DEFAULT 10000,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

export const CREATE_WORKOUT_TEMPLATES_TABLE = `
CREATE TABLE IF NOT EXISTS workout_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  exercises TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

/**
 * すべてのテーブルを作成するSQL文の配列
 */
export const ALL_TABLE_SCHEMAS = [
  CREATE_EXERCISES_TABLE,
  CREATE_WORKOUTS_TABLE,
  CREATE_WORKOUT_SETS_TABLE,
  CREATE_STEP_RECORDS_TABLE,
  CREATE_STEP_GOALS_TABLE,
  CREATE_WORKOUT_TEMPLATES_TABLE,
];
