# Issue #004: ワークアウトストア実装

## 概要
Zustandを使用してワークアウト機能の状態管理を実装する。

## タスク

### 1. 型定義
`types/workout.ts` に型を定義：

```typescript
export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  isCustom: boolean;
}

export interface WorkoutSet {
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
    sets: WorkoutSet[];
  }[];
}
```

### 2. ワークアウトストア実装
`lib/stores/workout-store.ts`:

```typescript
interface WorkoutState {
  // 状態
  activeWorkout: ActiveWorkout | null;
  isWorkoutActive: boolean;

  // アクション
  startWorkout: () => void;
  endWorkout: () => Promise<void>;
  discardWorkout: () => void;

  addExercise: (exercise: Exercise) => void;
  removeExercise: (exerciseId: string) => void;

  addSet: (exerciseId: string) => void;
  updateSet: (exerciseId: string, setId: string, data: Partial<WorkoutSet>) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  toggleSetComplete: (exerciseId: string, setId: string) => void;
}
```

### 3. 永続化連携
ワークアウト終了時にデータベースに保存：
- `endWorkout()` でDBにワークアウトとセットを保存
- アクティブワークアウトは一時的にAsyncStorageに保存（アプリ終了対策）

### 4. 種目ストア実装
`lib/stores/exercise-store.ts`:

```typescript
interface ExerciseState {
  exercises: Exercise[];
  recentExercises: Exercise[];

  loadExercises: () => Promise<void>;
  getExercisesByCategory: (category: ExerciseCategory) => Exercise[];
  addCustomExercise: (name: string, category: ExerciseCategory) => Promise<void>;
  addToRecent: (exerciseId: string) => void;
}
```

## 受け入れ条件
- [ ] ワークアウトの開始・終了ができる
- [ ] 種目の追加・削除ができる
- [ ] セットの追加・更新・削除ができる
- [ ] セット完了のトグルができる
- [ ] ワークアウト終了時にDBに保存される
- [ ] 種目一覧がDBから読み込める

## 参照ドキュメント
- [DATA_MODEL.md](../DATA_MODEL.md) - 型定義
- [ARCHITECTURE.md](../ARCHITECTURE.md) - 状態管理

## 依存関係
- #001 (プロジェクト基盤セットアップ)
- #002 (データベースセットアップ)

## 優先度
**高** - ワークアウト画面の前提

## 見積もり
Medium (2-3時間)
