# Zustand ストア

このディレクトリには、アプリケーションの状態管理を行うZustandストアが含まれています。

## ストア一覧

### `workout-store.ts`

ワークアウトセッションの状態を管理します。

**状態:**
- `activeWorkout: ActiveWorkout | null` - 現在アクティブなワークアウト
- `isWorkoutActive: boolean` - ワークアウトが進行中かどうか

**アクション:**
- `startWorkout()` - ワークアウトを開始
- `endWorkout()` - ワークアウトを終了してDBに保存
- `discardWorkout()` - ワークアウトを破棄
- `addExercise(exercise)` - 種目を追加
- `removeExercise(exerciseId)` - 種目を削除
- `addSet(exerciseId)` - セットを追加
- `updateSet(exerciseId, setId, data)` - セットを更新
- `removeSet(exerciseId, setId)` - セットを削除
- `toggleSetComplete(exerciseId, setId)` - セット完了状態をトグル

**使用例:**

```typescript
import { useWorkoutStore } from '@/lib/stores/workout-store';

function WorkoutScreen() {
  const {
    activeWorkout,
    isWorkoutActive,
    startWorkout,
    addExercise,
    addSet,
    updateSet,
    toggleSetComplete,
    endWorkout
  } = useWorkoutStore();

  const handleStartWorkout = () => {
    startWorkout();
  };

  const handleAddExercise = (exercise: Exercise) => {
    addExercise(exercise);
  };

  const handleAddSet = (exerciseId: string) => {
    addSet(exerciseId);
  };

  const handleUpdateSet = (exerciseId: string, setId: string) => {
    updateSet(exerciseId, setId, {
      weightKg: 100,
      reps: 10
    });
  };

  const handleToggleComplete = (exerciseId: string, setId: string) => {
    toggleSetComplete(exerciseId, setId);
  };

  const handleEndWorkout = async () => {
    await endWorkout();
    // ワークアウトがDBに保存される
  };

  return (
    // UI コンポーネント
  );
}
```

### `exercise-store.ts`

種目マスタの状態を管理します。

**状態:**
- `exercises: Exercise[]` - すべての種目
- `recentExercises: Exercise[]` - 最近使用した種目(最大10件)

**アクション:**
- `loadExercises()` - DBから種目を読み込み
- `getExercisesByCategory(category)` - カテゴリ別に種目を取得
- `addCustomExercise(name, category)` - カスタム種目を追加
- `addToRecent(exerciseId)` - 最近使用した種目に追加

**使用例:**

```typescript
import { useExerciseStore } from '@/lib/stores/exercise-store';

function ExerciseListScreen() {
  const {
    exercises,
    recentExercises,
    loadExercises,
    getExercisesByCategory,
    addCustomExercise,
    addToRecent
  } = useExerciseStore();

  useEffect(() => {
    loadExercises();
  }, []);

  const chestExercises = getExercisesByCategory('chest');

  const handleAddCustom = async () => {
    await addCustomExercise('マイカスタム種目', 'chest');
  };

  const handleSelectExercise = (exerciseId: string) => {
    addToRecent(exerciseId);
    // 種目選択処理
  };

  return (
    // UI コンポーネント
  );
}
```

## データフロー

### ワークアウト開始から終了まで

1. **開始:** `startWorkout()` でアクティブワークアウトを作成
2. **種目追加:** `addExercise(exercise)` で種目を追加
3. **セット追加:** `addSet(exerciseId)` でセットを追加
4. **セット更新:** `updateSet(exerciseId, setId, data)` で重量・回数を入力
5. **セット完了:** `toggleSetComplete(exerciseId, setId)` で完了マーク
6. **終了:** `endWorkout()` でDBに保存してストアをクリア

### 種目の選択

1. **読み込み:** `loadExercises()` でDBから種目を取得
2. **フィルタ:** `getExercisesByCategory('chest')` でカテゴリ別に絞り込み
3. **選択:** 選択時に `addToRecent(exerciseId)` で履歴に追加
4. **カスタム追加:** `addCustomExercise('種目名', 'chest')` で新規作成

## テスト

各ストアには対応するテストファイルが用意されています:

- `workout-store.test.ts` - ワークアウトストアのテスト
- `exercise-store.test.ts` - 種目ストアのテスト

テストはTDD(テスト駆動開発)の原則に従って作成されており、期待される動作を定義しています。

## 注意事項

### ワークアウトストア

- アクティブなワークアウトは1つのみ
- `endWorkout()` 実行時に完了したセットのみがDBに保存される
- `discardWorkout()` はDBに保存せずにストアをクリア

### 種目ストア

- 最近使用した種目は最大10件まで保持
- 同じ種目を追加すると先頭に移動
- カスタム種目は即座にDBに保存される

## 関連ファイル

- `/types/workout.ts` - ワークアウト関連の型定義
- `/types/exercise.ts` - 種目関連の型定義
- `/lib/db/queries/workouts.ts` - ワークアウトのDBクエリ
- `/lib/db/queries/workout-sets.ts` - セットのDBクエリ
- `/lib/db/queries/exercises.ts` - 種目のDBクエリ
