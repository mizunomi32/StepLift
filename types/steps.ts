export type StepSource = 'sensor' | 'healthkit' | 'health_connect' | 'manual';

export interface StepRecord {
  id: string;
  date: string; // YYYY-MM-DD
  steps: number;
  distanceKm: number | null;
  calories: number | null;
  source: StepSource;
  createdAt: string;
}

export interface StepGoal {
  id: string;
  dailySteps: number;
  updatedAt: string;
}

// データベースの行データ (snake_case)
export interface StepRecordRow {
  id: string;
  date: string;
  steps: number;
  distance_km: number | null;
  calories: number | null;
  source: StepSource;
  created_at: string;
}

export interface StepGoalRow {
  id: string;
  daily_steps: number;
  updated_at: string;
}

// 行データをTypeScriptオブジェクトに変換
export function stepRecordFromRow(row: StepRecordRow): StepRecord {
  return {
    id: row.id,
    date: row.date,
    steps: row.steps,
    distanceKm: row.distance_km,
    calories: row.calories,
    source: row.source,
    createdAt: row.created_at,
  };
}

export function stepGoalFromRow(row: StepGoalRow): StepGoal {
  return {
    id: row.id,
    dailySteps: row.daily_steps,
    updatedAt: row.updated_at,
  };
}

export interface DailyStepSummary {
  date: string;
  steps: number;
  goal: number;
  percentage: number;
  distanceKm: number | null;
  calories: number | null;
}
