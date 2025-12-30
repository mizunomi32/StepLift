# Issue #005: ワークアウト記録画面

## 概要
ワークアウトの記録画面を実装する。種目追加、セット入力、タイマー表示を含む。

## タスク

### 1. ワークアウト画面の実装
`app/(tabs)/workout.tsx`:

**非アクティブ時:**
- 「ワークアウトを開始」ボタンを表示
- 最近のワークアウト履歴を表示（オプション）

**アクティブ時:**
- 経過時間タイマー
- 種目追加ボタン
- 種目カードのリスト
- 「ワークアウトを終了」ボタン

### 2. ワークアウトタイマーコンポーネント
`components/workout/WorkoutTimer.tsx`:

```tsx
interface WorkoutTimerProps {
  startedAt: string;
}

// 経過時間を MM:SS または HH:MM:SS 形式で表示
```

### 3. 種目カードコンポーネント
`components/workout/ExerciseCard.tsx`:

```tsx
interface ExerciseCardProps {
  exercise: Exercise;
  sets: WorkoutSet[];
  onAddSet: () => void;
  onUpdateSet: (setId: string, data: Partial<WorkoutSet>) => void;
  onRemoveSet: (setId: string) => void;
  onToggleComplete: (setId: string) => void;
  onRemoveExercise: () => void;
}
```

表示内容:
- 種目名
- セット一覧（テーブル形式）
- セット追加ボタン
- 編集・削除アイコン

### 4. セット行コンポーネント
`components/workout/SetRow.tsx`:

```tsx
interface SetRowProps {
  set: WorkoutSet;
  onUpdate: (data: Partial<WorkoutSet>) => void;
  onToggleComplete: () => void;
  onRemove: () => void;
}
```

入力項目:
- セット番号（表示のみ）
- 重量 (kg) - 数値入力
- 回数 (reps) - 数値入力
- 完了チェックボックス

### 5. 種目選択画面
`app/workout/exercise-picker.tsx`:

- カテゴリ別セクション
- 検索機能
- 最近使用した種目
- カスタム種目追加

### 6. ハプティクスフィードバック
- セット完了時: Medium impact
- ワークアウト開始/終了: Light impact

## ワイヤーフレーム

```
┌─────────────────────────────────────┐
│  ワークアウト            00:12:34  │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │ ＋ 種目を追加               │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ベンチプレス           ✏️ 🗑 │   │
│  ├─────────────────────────────┤   │
│  │ Set  Weight   Reps    ✓    │   │
│  │  1   60 kg    10     [✓]   │   │
│  │  2   60 kg    10     [✓]   │   │
│  │  3   60 kg     8     [ ]   │   │
│  │ ┌──────────────────────┐   │   │
│  │ │ ＋ セットを追加      │   │   │
│  │ └──────────────────────┘   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     ワークアウトを終了      │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

## 受け入れ条件
- [ ] ワークアウトの開始・終了ができる
- [ ] 種目を追加できる
- [ ] セットの追加・編集・削除ができる
- [ ] 完了チェックが動作する
- [ ] タイマーが正しく動作する
- [ ] 種目選択画面で検索・選択ができる
- [ ] ダークテーマが適用されている

## 参照ドキュメント
- [SCREENS.md](../SCREENS.md) - ワークアウト記録セクション
- [DATA_MODEL.md](../DATA_MODEL.md) - 型定義

## 依存関係
- #003 (タブナビゲーション)
- #004 (ワークアウトストア)

## 優先度
**高** - MVP コア機能

## 見積もり
Large (4-6時間)
