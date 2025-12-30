# AGENTS.md

## Project Overview

**StepLift** - 筋トレのワークアウト記録と歩数計を統合したフィットネスアプリ

Expo SDK 54 / React Nativeを使用したモバイルアプリケーション。モバイルファーストのパターン、パフォーマンス、クロスプラットフォーム互換性を優先。

## Documentation Resources

Expoの公式ドキュメントを参照:

- **https://docs.expo.dev/llms.txt** - ドキュメントインデックス
- **https://docs.expo.dev/llms-full.txt** - Expo完全ドキュメント
- **https://docs.expo.dev/llms-eas.txt** - EASドキュメント
- **https://docs.expo.dev/llms-sdk.txt** - Expo SDKドキュメント

## Project Structure

```
/
├── app/                      # Expo Router (ファイルベースルーティング)
│   ├── (tabs)/               # タブナビゲーション
│   │   ├── _layout.tsx       # タブレイアウト
│   │   ├── index.tsx         # ダッシュボード画面
│   │   ├── workout.tsx       # ワークアウト画面
│   │   ├── steps.tsx         # 歩数画面
│   │   └── history.tsx       # 履歴画面
│   ├── workout/              # ワークアウト詳細
│   │   └── [id].tsx          # ワークアウト詳細画面
│   ├── settings/             # 設定
│   │   └── index.tsx         # 設定画面
│   └── _layout.tsx           # ルートレイアウト (テーマ、DB初期化)
│
├── components/               # 再利用可能なコンポーネント
│   ├── ui/                   # UIプリミティブ
│   │   ├── button.tsx        # ボタンコンポーネント
│   │   ├── card.tsx          # カードコンポーネント
│   │   └── ...
│   ├── workout/              # ワークアウト関連
│   │   ├── ExerciseCard.tsx
│   │   ├── SetRow.tsx
│   │   ├── TimeEditButton.tsx
│   │   └── ...
│   ├── steps/                # 歩数関連
│   │   ├── StepsCard.tsx
│   │   ├── WeeklyChart.tsx
│   │   └── ...
│   └── settings/             # 設定関連
│       ├── SettingsSection.tsx
│       └── SettingsItem.tsx
│
├── lib/                      # ビジネスロジック
│   ├── db/                   # データベース層
│   │   ├── index.ts          # DB初期化・エクスポート
│   │   ├── migrations.ts     # マイグレーション
│   │   ├── exercises.ts      # 種目CRUD
│   │   ├── workouts.ts       # ワークアウトCRUD
│   │   └── steps.ts          # 歩数CRUD
│   ├── stores/               # Zustand ストア
│   │   ├── workout-store.ts  # ワークアウト状態管理
│   │   ├── steps-store.ts    # 歩数状態管理
│   │   └── settings-store.ts # 設定状態管理
│   └── services/             # 外部サービス
│       └── healthkit.ts      # HealthKit連携
│
├── constants/                # 定数
│   └── colors.ts             # カラーパレット
│
├── hooks/                    # カスタムフック
│   └── use-color-scheme.ts   # カラースキーム
│
├── types/                    # TypeScript型定義
│   ├── workout.ts            # ワークアウト型
│   ├── steps.ts              # 歩数型
│   └── exercise.ts           # 種目型
│
├── __tests__/                # テストファイル
│   └── ...
│
├── docs/                     # ドキュメント
│   ├── PRD.md                # 製品要件定義書
│   ├── ARCHITECTURE.md       # アーキテクチャ
│   ├── DATA_MODEL.md         # データモデル
│   └── SCREENS.md            # 画面設計
│
├── app.json                  # Expo設定
├── eas.json                  # EAS Build設定
├── package.json              # 依存関係
└── tsconfig.json             # TypeScript設定
```

## Essential Commands

### Development

```bash
pnpm start                    # 開発サーバー起動
npx expo start --clear        # キャッシュクリアして起動
npx expo run:ios              # iOSシミュレーターでビルド
npx expo run:ios --device     # iOS実機でビルド
npx expo run:android          # Androidでビルド
```

### Testing & Linting

```bash
pnpm test                     # テスト実行
pnpm test:watch               # ウォッチモード
pnpm test:coverage            # カバレッジ付き
pnpm lint                     # Biome lint実行
pnpm lint:fix                 # 自動修正付きlint
pnpm format                   # コードフォーマット
```

### Build & Deploy

```bash
pnpm draft                    # プレビュー更新を公開
pnpm development-builds       # 開発ビルド作成
pnpm deploy                   # 本番デプロイ
```

## Technology Stack

| カテゴリ | 技術 |
|----------|------|
| フレームワーク | Expo SDK 54 / React Native |
| ナビゲーション | Expo Router |
| スタイリング | NativeWind (Tailwind CSS) |
| 状態管理 | Zustand |
| データベース | expo-sqlite |
| HealthKit | react-native-health |
| テスト | Jest + Testing Library |
| Linter/Formatter | Biome |

## Development Guidelines

### Code Style

- **TypeScript**: すべての新規コードでTypeScriptを使用
- **命名規則**: 意味のある説明的な名前を使用
- **自己文書化コード**: 複雑なロジックにのみコメントを追加

### React Patterns

- 関数コンポーネント + Hooks
- React Compiler有効
- 適切な依存配列
- 必要に応じてメモ化 (useMemo, useCallback)

### State Management

- **Zustand**: グローバル状態管理
- **ストア構造**: 機能ごとに分離 (workout, steps, settings)
- **永続化**: SQLiteでデータ永続化

### Database

- **expo-sqlite**: ローカルデータベース
- **マイグレーション**: バージョン管理されたスキーマ変更
- **CRUD関数**: lib/db/配下に集約

## HealthKit Integration

HealthKit連携はネイティブモジュールを使用するため、開発ビルドが必要。

```bash
# 開発ビルドを作成
npx expo run:ios --device
```

Expo Goでは動作しないため、`Constants.appOwnership`で判定して適切なメッセージを表示。

## Troubleshooting

### Expo Goでエラーが発生する場合

ネイティブモジュール (HealthKitなど) を使用する機能は開発ビルドが必要:

```bash
npx expo run:ios --device
```

### メトロバンドラーのキャッシュ問題

```bash
npx expo start --clear
```

### Xcodeの設定

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

## AI Agent Instructions

1. **ドキュメント優先**: 実装前に関連ドキュメントを確認
2. **既存パターンに従う**: 既存コンポーネントのパターンを参考に
3. **型安全性**: TypeScriptの型を活用
4. **テスト**: 新機能にはテストを追加
