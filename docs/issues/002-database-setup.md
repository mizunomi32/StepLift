# Issue #002: データベースセットアップ

## 概要
expo-sqliteを使用してローカルデータベースを構築する。テーブル作成、マイグレーション、基本クエリ関数を実装する。

## タスク

### 1. データベース初期化
`lib/db/index.ts` にデータベース接続とセットアップを実装：

```typescript
import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('steplift.db');
```

### 2. スキーマ定義
`lib/db/schema.ts` にテーブル作成SQLを定義：

- `exercises` - 種目マスタ
- `workouts` - ワークアウトセッション
- `workout_sets` - セット記録
- `step_records` - 歩数記録
- `step_goals` - 歩数目標
- `workout_templates` - テンプレート

詳細は [DATA_MODEL.md](../DATA_MODEL.md) を参照。

### 3. マイグレーション実装
`lib/db/migrations/` に以下を実装：

```typescript
// lib/db/migrations/001_initial.ts
export function up(db: SQLiteDatabase) {
  // テーブル作成
}

// lib/db/migrations/index.ts
export const MIGRATIONS = [
  { version: 1, up: migration001 },
];

export async function runMigrations(db: SQLiteDatabase) {
  // バージョン管理とマイグレーション実行
}
```

### 4. プリセット種目の投入
`constants/exercises.ts` のプリセット種目をデータベースに投入する初期化処理。

### 5. 基本クエリ関数
`lib/db/queries/` に以下のクエリ関数を実装：

**exercises.ts:**
- `getAllExercises()`
- `getExercisesByCategory(category)`
- `createCustomExercise(exercise)`

**workouts.ts:**
- `createWorkout()`
- `getWorkoutById(id)`
- `getWorkoutsByDateRange(start, end)`
- `updateWorkout(id, data)`
- `deleteWorkout(id)`

**workout-sets.ts:**
- `addSet(set)`
- `updateSet(id, data)`
- `deleteSet(id)`
- `getSetsByWorkoutId(workoutId)`

**steps.ts:**
- `upsertStepRecord(record)`
- `getStepRecordByDate(date)`
- `getStepRecordsByDateRange(start, end)`
- `getStepGoal()`
- `updateStepGoal(dailySteps)`

## 受け入れ条件
- [ ] データベースが正常に初期化される
- [ ] マイグレーションが正しく実行される
- [ ] プリセット種目がデータベースに存在する
- [ ] 各クエリ関数が動作する
- [ ] エラーハンドリングが実装されている

## 参照ドキュメント
- [DATA_MODEL.md](../DATA_MODEL.md)
- [ARCHITECTURE.md](../ARCHITECTURE.md)

## 依存関係
- #001 (プロジェクト基盤セットアップ)

## 優先度
**高** - ワークアウト・歩数機能の前提

## 見積もり
Medium (2-4時間)
