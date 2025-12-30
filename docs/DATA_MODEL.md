# StepLift - データモデル

## ER図

```
┌─────────────────┐       ┌─────────────────┐
│    exercises    │       │    workouts     │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ name            │       │ started_at      │
│ category        │       │ finished_at     │
│ is_custom       │       │ notes           │
│ created_at      │       │ created_at      │
└────────┬────────┘       └────────┬────────┘
         │                         │
         │    ┌────────────────────┘
         │    │
         ▼    ▼
┌─────────────────────────┐
│     workout_sets        │
├─────────────────────────┤
│ id (PK)                 │
│ workout_id (FK)         │
│ exercise_id (FK)        │
│ set_number              │
│ weight_kg               │
│ reps                    │
│ notes                   │
│ created_at              │
└─────────────────────────┘

┌─────────────────┐       ┌─────────────────┐
│  step_records   │       │   step_goals    │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ date            │       │ daily_steps     │
│ steps           │       │ updated_at      │
│ distance_km     │       └─────────────────┘
│ calories        │
│ source          │       ┌─────────────────┐
│ created_at      │       │ workout_templates│
└─────────────────┘       ├─────────────────┤
                          │ id (PK)         │
                          │ name            │
                          │ exercises (JSON)│
                          │ created_at      │
                          └─────────────────┘
```

## テーブル定義

### exercises (種目マスタ)

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | TEXT | PK | UUID |
| name | TEXT | NOT NULL | 種目名 |
| category | TEXT | NOT NULL | カテゴリ (chest, back, etc.) |
| is_custom | INTEGER | DEFAULT 0 | カスタム種目フラグ (0/1) |
| created_at | TEXT | NOT NULL | 作成日時 (ISO8601) |

```sql
CREATE TABLE exercises (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  is_custom INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_exercises_category ON exercises(category);
```

### workouts (ワークアウトセッション)

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | TEXT | PK | UUID |
| started_at | TEXT | NOT NULL | 開始日時 |
| finished_at | TEXT | | 終了日時 |
| notes | TEXT | | メモ |
| created_at | TEXT | NOT NULL | 作成日時 |

```sql
CREATE TABLE workouts (
  id TEXT PRIMARY KEY,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_workouts_started_at ON workouts(started_at);
```

### workout_sets (セット記録)

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | TEXT | PK | UUID |
| workout_id | TEXT | FK, NOT NULL | ワークアウトID |
| exercise_id | TEXT | FK, NOT NULL | 種目ID |
| set_number | INTEGER | NOT NULL | セット番号 |
| weight_kg | REAL | | 重量 (kg) |
| reps | INTEGER | | 回数 |
| notes | TEXT | | メモ |
| created_at | TEXT | NOT NULL | 作成日時 |

```sql
CREATE TABLE workout_sets (
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

CREATE INDEX idx_workout_sets_workout_id ON workout_sets(workout_id);
CREATE INDEX idx_workout_sets_exercise_id ON workout_sets(exercise_id);
```

### step_records (歩数記録)

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | TEXT | PK | UUID |
| date | TEXT | UNIQUE, NOT NULL | 日付 (YYYY-MM-DD) |
| steps | INTEGER | NOT NULL | 歩数 |
| distance_km | REAL | | 距離 (km) |
| calories | INTEGER | | 消費カロリー |
| source | TEXT | | データソース (sensor/healthkit/manual) |
| created_at | TEXT | NOT NULL | 作成日時 |

```sql
CREATE TABLE step_records (
  id TEXT PRIMARY KEY,
  date TEXT UNIQUE NOT NULL,
  steps INTEGER NOT NULL DEFAULT 0,
  distance_km REAL,
  calories INTEGER,
  source TEXT DEFAULT 'sensor',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_step_records_date ON step_records(date);
```

### step_goals (歩数目標)

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | TEXT | PK | UUID |
| daily_steps | INTEGER | NOT NULL | 1日の目標歩数 |
| updated_at | TEXT | NOT NULL | 更新日時 |

```sql
CREATE TABLE step_goals (
  id TEXT PRIMARY KEY,
  daily_steps INTEGER NOT NULL DEFAULT 10000,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### workout_templates (ワークアウトテンプレート)

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | TEXT | PK | UUID |
| name | TEXT | NOT NULL | テンプレート名 |
| exercises | TEXT | NOT NULL | 種目リスト (JSON) |
| created_at | TEXT | NOT NULL | 作成日時 |

```sql
CREATE TABLE workout_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  exercises TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## TypeScript型定義

```typescript
// types/exercise.ts
export type ExerciseCategory =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'arms'
  | 'legs'
  | 'core'
  | 'cardio';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  isCustom: boolean;
  createdAt: string;
}

// types/workout.ts
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

// types/steps.ts
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

// types/template.ts
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
```

## プリセット種目データ

```typescript
// constants/exercises.ts
export const PRESET_EXERCISES: Omit<Exercise, 'id' | 'createdAt'>[] = [
  // 胸
  { name: 'ベンチプレス', category: 'chest', isCustom: false },
  { name: 'インクラインベンチプレス', category: 'chest', isCustom: false },
  { name: 'ダンベルフライ', category: 'chest', isCustom: false },
  { name: 'チェストプレス', category: 'chest', isCustom: false },
  { name: '腕立て伏せ', category: 'chest', isCustom: false },

  // 背中
  { name: 'デッドリフト', category: 'back', isCustom: false },
  { name: 'ラットプルダウン', category: 'back', isCustom: false },
  { name: 'ベントオーバーロウ', category: 'back', isCustom: false },
  { name: 'シーテッドロウ', category: 'back', isCustom: false },
  { name: '懸垂', category: 'back', isCustom: false },

  // 肩
  { name: 'ショルダープレス', category: 'shoulders', isCustom: false },
  { name: 'サイドレイズ', category: 'shoulders', isCustom: false },
  { name: 'フロントレイズ', category: 'shoulders', isCustom: false },
  { name: 'リアデルトフライ', category: 'shoulders', isCustom: false },

  // 腕
  { name: 'バーベルカール', category: 'arms', isCustom: false },
  { name: 'ダンベルカール', category: 'arms', isCustom: false },
  { name: 'トライセプスプッシュダウン', category: 'arms', isCustom: false },
  { name: 'スカルクラッシャー', category: 'arms', isCustom: false },

  // 脚
  { name: 'スクワット', category: 'legs', isCustom: false },
  { name: 'レッグプレス', category: 'legs', isCustom: false },
  { name: 'レッグカール', category: 'legs', isCustom: false },
  { name: 'レッグエクステンション', category: 'legs', isCustom: false },
  { name: 'カーフレイズ', category: 'legs', isCustom: false },
  { name: 'ランジ', category: 'legs', isCustom: false },

  // 体幹
  { name: 'プランク', category: 'core', isCustom: false },
  { name: 'クランチ', category: 'core', isCustom: false },
  { name: 'レッグレイズ', category: 'core', isCustom: false },
  { name: 'アブローラー', category: 'core', isCustom: false },

  // 有酸素
  { name: 'トレッドミル', category: 'cardio', isCustom: false },
  { name: 'エアロバイク', category: 'cardio', isCustom: false },
  { name: 'ローイングマシン', category: 'cardio', isCustom: false },
];
```

## マイグレーション戦略

### 初回セットアップ
1. テーブル作成
2. プリセット種目の投入
3. デフォルト歩数目標の設定

### バージョン管理
- `user_version` プラグマで管理
- マイグレーションファイルはバージョン番号順に実行

```typescript
// lib/db/migrations/index.ts
export const MIGRATIONS = [
  { version: 1, up: migration001_initial },
  { version: 2, up: migration002_add_templates },
  // ...
];
```
