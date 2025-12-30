# Issue #003: タブナビゲーション実装

## 概要
アプリのメインナビゲーションとなる4つのタブを実装する。

## タスク

### 1. タブレイアウトの更新
`app/(tabs)/_layout.tsx` を更新して4つのタブを設定：

| タブ | ファイル | アイコン | ラベル |
|------|----------|----------|--------|
| ホーム | `index.tsx` | home | ホーム |
| 筋トレ | `workout.tsx` | dumbbell | 筋トレ |
| 歩数 | `steps.tsx` | footprints | 歩数 |
| 履歴 | `history.tsx` | clipboard-list | 履歴 |

### 2. タブ画面のスケルトン作成
各タブ画面の基本構造を作成：

**app/(tabs)/index.tsx** (ダッシュボード):
```tsx
export default function DashboardScreen() {
  return (
    <View className="flex-1 bg-black">
      <Text className="text-white">ダッシュボード</Text>
    </View>
  );
}
```

**app/(tabs)/workout.tsx**:
```tsx
export default function WorkoutScreen() {
  return (
    <View className="flex-1 bg-black">
      <Text className="text-white">ワークアウト</Text>
    </View>
  );
}
```

**app/(tabs)/steps.tsx**:
```tsx
export default function StepsScreen() {
  return (
    <View className="flex-1 bg-black">
      <Text className="text-white">歩数</Text>
    </View>
  );
}
```

**app/(tabs)/history.tsx**:
```tsx
export default function HistoryScreen() {
  return (
    <View className="flex-1 bg-black">
      <Text className="text-white">履歴</Text>
    </View>
  );
}
```

### 3. アイコン設定
`@expo/vector-icons` または `expo-symbols` を使用してタブアイコンを設定。

### 4. ダークモード対応
タブバーをダークテーマに対応させる：
- 背景色: #0A0A0A
- アクティブ: #22C55E (プライマリ)
- 非アクティブ: #9CA3AF

### 5. 不要なファイル削除
既存のサンプル画面（explore.tsx など）を削除。

## 受け入れ条件
- [ ] 4つのタブが正しく表示される
- [ ] タブ間の遷移が正常に動作する
- [ ] アイコンとラベルが表示される
- [ ] ダークテーマが適用されている
- [ ] アクティブタブが視覚的に区別できる

## 参照ドキュメント
- [SCREENS.md](../SCREENS.md) - タブナビゲーションセクション
- [ARCHITECTURE.md](../ARCHITECTURE.md) - ディレクトリ構成

## 依存関係
- #001 (プロジェクト基盤セットアップ)

## 優先度
**高** - 画面遷移の基盤

## 見積もり
Small (1時間)
