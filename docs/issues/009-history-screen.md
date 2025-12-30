# Issue #009: 履歴画面

## 概要
ワークアウトと歩数の履歴を表示する画面を実装する。カレンダー表示と履歴リストを含む。

## タスク

### 1. 履歴画面
`app/(tabs)/history.tsx`:

- 月別カレンダー
- 日別履歴リスト
- フィルター機能

### 2. ワークアウトカレンダー
`components/history/WorkoutCalendar.tsx`:

```tsx
interface WorkoutCalendarProps {
  workouts: Workout[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onMonthChange: (month: string) => void;
}
```

機能:
- 月間カレンダー表示
- ワークアウト実施日にドット表示
- 日付選択でその日の履歴を表示
- 月移動ナビゲーション

### 3. 履歴アイテムコンポーネント
`components/history/WorkoutHistoryItem.tsx`:

```tsx
interface WorkoutHistoryItemProps {
  workout: WorkoutWithSets;
  onPress: () => void;
}
```

表示:
- 日付
- ワークアウト時間
- 種目数、セット数
- 主な種目名（2-3個）

### 4. ワークアウト詳細画面
`app/workout/[id].tsx`:

- ワークアウト詳細情報
- 全種目・全セットの表示
- メモの表示
- 編集・削除機能

### 5. 履歴データ取得フック
`lib/hooks/use-workout-history.ts`:

```typescript
export function useWorkoutHistory(month: string) {
  // 指定月のワークアウト一覧を取得
}

export function useWorkoutDetail(id: string) {
  // ワークアウト詳細を取得
}
```

### 6. 履歴ストア
`lib/stores/history-store.ts`:

```typescript
interface HistoryState {
  selectedMonth: string;
  selectedDate: string | null;
  workouts: WorkoutWithSets[];

  setSelectedMonth: (month: string) => void;
  setSelectedDate: (date: string | null) => void;
  loadWorkouts: (month: string) => Promise<void>;
}
```

## ワイヤーフレーム

```
┌─────────────────────────────────────┐
│  履歴                   📅 フィルタ │
├─────────────────────────────────────┤
│                                     │
│  2025年1月                         │
│  ┌─────────────────────────────┐   │
│  │ < 月 火 水 木 金 土 日  >   │   │
│  │     1  2  3  4  5  6        │   │
│  │        ●     ●  ●           │   │
│  │  7  8  9 10 11 12 13        │   │
│  │  ●     ●              ●     │   │
│  │ ...                         │   │
│  └─────────────────────────────┘   │
│                                     │
│  今日 - 1月15日                    │
│  ┌─────────────────────────────┐   │
│  │ 💪 上半身トレーニング   >    │   │
│  │    45分 • 6種目 • 18セット   │   │
│  │    ベンチプレス, ダンベル... │   │
│  └─────────────────────────────┘   │
│                                     │
│  1月13日                           │
│  ┌─────────────────────────────┐   │
│  │ 💪 脚トレーニング       >    │   │
│  │    38分 • 4種目 • 12セット   │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

## 受け入れ条件
- [ ] カレンダーが正しく表示される
- [ ] ワークアウト実施日にドットが表示される
- [ ] 月移動が動作する
- [ ] 日付選択でその日の履歴が表示される
- [ ] 履歴アイテムをタップで詳細画面へ遷移
- [ ] 詳細画面で全情報が表示される
- [ ] ダークテーマが適用されている

## 参照ドキュメント
- [SCREENS.md](../SCREENS.md) - 履歴セクション
- [DATA_MODEL.md](../DATA_MODEL.md) - workouts, workout_sets

## 依存関係
- #003 (タブナビゲーション)
- #004 (ワークアウトストア)
- #002 (データベースセットアップ)

## 優先度
**中** - MVP機能だが、記録機能の後で実装可能

## 見積もり
Medium (3-4時間)
