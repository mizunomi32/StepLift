# StepLift - 技術アーキテクチャ

## 技術スタック

### フロントエンド
| 技術 | バージョン | 用途 |
|------|-----------|------|
| React Native | 0.81.x | クロスプラットフォームUI |
| Expo | SDK 54 | 開発環境・ビルドツール |
| Expo Router | v6 | ファイルベースルーティング |
| TypeScript | 5.9.x | 型安全な開発 |
| NativeWind | v4 | Tailwind CSSスタイリング |
| Tailwind CSS | v3 | ユーティリティファーストCSS |

### 状態管理
| 技術 | 用途 |
|------|------|
| Zustand | グローバル状態管理 |
| React Query (TanStack Query) | サーバー状態・キャッシュ (将来) |

### データ永続化
| 技術 | 用途 |
|------|------|
| expo-sqlite | ローカルデータベース |
| expo-sqlite/kv-store | 簡易Key-Valueストア |

### ネイティブ機能
| 技術 | 用途 |
|------|------|
| expo-sensors | 歩数計 (Pedometer) |
| HealthKit (iOS) | ヘルスデータ連携 |
| Health Connect (Android) | ヘルスデータ連携 |
| expo-haptics | 触覚フィードバック |
| expo-notifications | プッシュ通知 (Phase 2) |

## ディレクトリ構成

```
/
├── app/                      # Expo Router ページ
│   ├── (tabs)/               # タブナビゲーション
│   │   ├── index.tsx         # ダッシュボード (ホーム)
│   │   ├── workout.tsx       # ワークアウト記録
│   │   ├── steps.tsx         # 歩数トラッキング
│   │   ├── history.tsx       # 履歴
│   │   └── _layout.tsx       # タブレイアウト
│   ├── workout/              # ワークアウト関連画面
│   │   ├── [id].tsx          # ワークアウト詳細
│   │   ├── new.tsx           # 新規ワークアウト
│   │   └── exercise/[id].tsx # 種目詳細
│   ├── settings/             # 設定画面
│   │   └── index.tsx
│   ├── _layout.tsx           # ルートレイアウト
│   └── modal.tsx             # モーダル
│
├── components/               # 再利用可能コンポーネント
│   ├── ui/                   # 基本UIコンポーネント
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── workout/              # ワークアウト関連
│   │   ├── ExerciseCard.tsx
│   │   ├── SetRow.tsx
│   │   └── WorkoutSummary.tsx
│   ├── steps/                # 歩数関連
│   │   ├── StepCounter.tsx
│   │   ├── StepChart.tsx
│   │   └── StepGoalRing.tsx
│   └── dashboard/            # ダッシュボード関連
│       ├── TodaySummary.tsx
│       ├── WeeklyChart.tsx
│       └── StreakBadge.tsx
│
├── lib/                      # ビジネスロジック・ユーティリティ
│   ├── db/                   # データベース関連
│   │   ├── schema.ts         # テーブル定義
│   │   ├── migrations/       # マイグレーション
│   │   └── queries/          # クエリ関数
│   ├── stores/               # Zustand ストア
│   │   ├── workout-store.ts
│   │   ├── steps-store.ts
│   │   └── settings-store.ts
│   ├── hooks/                # カスタムフック
│   │   ├── use-workouts.ts
│   │   ├── use-steps.ts
│   │   └── use-exercises.ts
│   └── utils/                # ユーティリティ関数
│       ├── date.ts
│       ├── calculations.ts
│       └── format.ts
│
├── constants/                # 定数
│   ├── exercises.ts          # プリセット種目
│   ├── colors.ts             # カラーパレット
│   └── config.ts             # アプリ設定
│
├── types/                    # TypeScript型定義
│   ├── workout.ts
│   ├── exercise.ts
│   ├── steps.ts
│   └── index.ts
│
├── assets/                   # 静的アセット
│   ├── images/
│   └── fonts/
│
├── docs/                     # ドキュメント
│
└── __tests__/                # テスト
    ├── components/
    ├── lib/
    └── e2e/
```

## アーキテクチャパターン

### レイヤー構成

```
┌─────────────────────────────────────────┐
│              Presentation               │
│         (app/, components/)             │
├─────────────────────────────────────────┤
│            State Management             │
│           (lib/stores/)                 │
├─────────────────────────────────────────┤
│           Business Logic                │
│        (lib/hooks/, lib/utils/)         │
├─────────────────────────────────────────┤
│            Data Access                  │
│         (lib/db/queries/)               │
├─────────────────────────────────────────┤
│              Storage                    │
│            (expo-sqlite)                │
└─────────────────────────────────────────┘
```

### データフロー

```
User Action
    │
    ▼
Component (UI)
    │
    ▼
Custom Hook (useWorkouts, useSteps)
    │
    ▼
Zustand Store (状態更新)
    │
    ▼
DB Query (永続化)
    │
    ▼
SQLite Database
```

## 命名規則

### ファイル名
- コンポーネント: `PascalCase.tsx` (例: `ExerciseCard.tsx`)
- フック: `use-kebab-case.ts` (例: `use-workouts.ts`)
- ユーティリティ: `kebab-case.ts` (例: `date-utils.ts`)
- 型定義: `kebab-case.ts` (例: `workout.ts`)
- 定数: `kebab-case.ts` (例: `exercises.ts`)

### 変数・関数
- 変数: `camelCase`
- 関数: `camelCase`
- コンポーネント: `PascalCase`
- 型/インターフェース: `PascalCase`
- 定数: `UPPER_SNAKE_CASE` or `camelCase`

### データベース
- テーブル名: `snake_case` (例: `workout_sets`)
- カラム名: `snake_case` (例: `created_at`)

## パフォーマンス最適化

### リスト表示
- `FlashList` を使用 (大量データの高速レンダリング)
- 適切なkeyExtractorの設定
- メモ化 (`React.memo`, `useMemo`)

### 画像
- `expo-image` で最適化・キャッシュ
- 適切なサイズ指定

### データベース
- インデックス設定
- 効率的なクエリ設計
- トランザクション活用

### アニメーション
- `react-native-reanimated` でネイティブスレッド実行
- Worklet活用

## テスト戦略

### ユニットテスト
- ユーティリティ関数
- カスタムフック
- Zustandストア

### コンポーネントテスト
- React Native Testing Library
- 主要コンポーネントのスナップショット

### E2Eテスト
- Maestro or Detox
- 主要ユーザーフロー

## セキュリティ考慮

- センシティブデータはSecureStoreに保存
- SQLiteにはユーザー認証情報を保存しない
- Phase 2以降: API通信はHTTPS必須
