# StepLift データベース

expo-sqliteを使用したローカルデータベースの実装。

## ディレクトリ構成

```
lib/db/
├── index.ts                 # データベース接続と初期化
├── schema.ts                # テーブル定義SQL
├── migrations/              # マイグレーション
│   ├── index.ts            # マイグレーション管理
│   └── 001_initial.ts      # 初期セットアップ
├── queries/                 # クエリ関数
│   ├── exercises.ts        # 種目クエリ
│   ├── workouts.ts         # ワークアウトクエリ
│   ├── workout-sets.ts     # セットクエリ
│   └── steps.ts            # 歩数クエリ
└── test-db.ts              # テストスクリプト
```

## 使用方法

### データベース初期化

アプリ起動時に自動的に初期化されます（`app/_layout.tsx`で実行）。

```typescript
import { initializeDatabase } from '@/lib/db';

initializeDatabase();
```

### クエリ関数の使用

#### 種目（Exercises）

```typescript
import { getAllExercises, getExercisesByCategory, createCustomExercise } from '@/lib/db/queries/exercises';

// すべての種目を取得
const exercises = getAllExercises();

// カテゴリ別に取得
const chestExercises = getExercisesByCategory('chest');

// カスタム種目を作成
const customExercise = createCustomExercise({
  name: 'マイエクササイズ',
  category: 'chest',
  isCustom: true,
});
```

#### ワークアウト（Workouts）

```typescript
import { createWorkout, getWorkoutById, updateWorkout, finishWorkout } from '@/lib/db/queries/workouts';

// ワークアウトを開始
const workout = createWorkout();

// ワークアウトを取得
const workoutDetails = getWorkoutWithSets(workout.id);

// ワークアウトを終了
finishWorkout(workout.id);
```

#### セット（Workout Sets）

```typescript
import { addSet, updateSet, getSetsByWorkoutId } from '@/lib/db/queries/workout-sets';

// セットを追加
const set = addSet({
  workoutId: 'workout_id',
  exerciseId: 'exercise_id',
  setNumber: 1,
  weightKg: 50,
  reps: 10,
  notes: null,
});

// セットを更新
updateSet(set.id, { weightKg: 52.5 });

// ワークアウトのすべてのセットを取得
const sets = getSetsByWorkoutId('workout_id');
```

#### 歩数（Steps）

```typescript
import { upsertStepRecord, getStepRecordByDate, getStepGoal, updateStepGoal } from '@/lib/db/queries/steps';

// 歩数記録を保存
const stepRecord = upsertStepRecord({
  date: '2025-01-01',
  steps: 8000,
  distanceKm: 6.4,
  calories: 320,
  source: 'sensor',
});

// 日付で歩数記録を取得
const record = getStepRecordByDate('2025-01-01');

// 歩数目標を取得
const goal = getStepGoal();

// 歩数目標を更新
updateStepGoal(12000);
```

## テーブル構成

### exercises (種目マスタ)
- プリセット種目とカスタム種目を管理
- カテゴリ: chest, back, shoulders, arms, legs, core, cardio

### workouts (ワークアウトセッション)
- ワークアウトの開始/終了時刻とメモを記録

### workout_sets (セット記録)
- ワークアウトの各セット情報（種目、重量、回数）を記録

### step_records (歩数記録)
- 日別の歩数、距離、カロリーを記録

### step_goals (歩数目標)
- ユーザーの1日の歩数目標を管理

### workout_templates (ワークアウトテンプレート)
- よく使うワークアウトをテンプレートとして保存

## マイグレーション

データベースのバージョンは`PRAGMA user_version`で管理されています。

### 新しいマイグレーションの追加方法

1. `lib/db/migrations/`に新しいファイルを作成（例: `002_add_feature.ts`）
2. `up`関数を実装
3. `lib/db/migrations/index.ts`の`MIGRATIONS`配列に追加

```typescript
// 002_add_feature.ts
import type { SQLiteDatabase } from 'expo-sqlite';

export function up(db: SQLiteDatabase): void {
  // マイグレーション処理
  db.execSync('ALTER TABLE workouts ADD COLUMN duration INTEGER');
}

// index.ts
export const MIGRATIONS: Migration[] = [
  { version: 1, up: migration001.up },
  { version: 2, up: migration002.up }, // 追加
];
```

## データベースのリセット（開発/テスト用）

```typescript
import { resetDatabase } from '@/lib/db';

// 警告: すべてのデータが削除されます
await resetDatabase();
```

## エラーハンドリング

すべてのクエリ関数はエラーが発生した場合に`Error`をthrowします。

```typescript
try {
  const exercises = getAllExercises();
} catch (error) {
  console.error('種目の取得に失敗しました:', error);
}
```

## 型定義

データベースの型定義は`types/`ディレクトリに配置されています。

- `types/exercise.ts` - Exercise, ExerciseCategory
- `types/workout.ts` - Workout, WorkoutSet, WorkoutWithSets
- `types/steps.ts` - StepRecord, StepGoal, StepSource
- `types/template.ts` - WorkoutTemplate, TemplateExercise

## プリセットデータ

初期マイグレーションで以下のデータが投入されます。

- **プリセット種目**: 31種目（constants/exercises.ts）
- **デフォルト歩数目標**: 10,000歩

## パフォーマンス考慮事項

- 外部キー制約が有効化されています
- 頻繁に検索されるカラムにインデックスを作成済み
  - exercises: category, is_custom
  - workouts: started_at, finished_at
  - workout_sets: workout_id, exercise_id
  - step_records: date

## 今後の拡張予定

- [ ] ワークアウトテンプレート機能の実装
- [ ] データのエクスポート/インポート機能
- [ ] クラウドバックアップ機能
