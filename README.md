# StepLift

筋トレのワークアウト記録と歩数計を統合したフィットネスアプリ

## 概要

StepLiftは、日々のトレーニングと活動量を一元管理できるモバイルアプリです。ジムでのワークアウト記録と歩数トラッキングを組み合わせ、フィットネス目標の達成をサポートします。

## 主な機能

- **ワークアウト記録**: 種目・重量・回数をセット単位で記録
- **歩数トラッキング**: HealthKit/Health Connect連携で自動計測
- **進捗ダッシュボード**: 今日のサマリー、週間グラフ、ストリーク表示
- **履歴管理**: 過去のワークアウトと歩数履歴を閲覧

## 技術スタック

- **フレームワーク**: Expo SDK 54 / React Native
- **ナビゲーション**: Expo Router (ファイルベースルーティング)
- **スタイリング**: NativeWind (Tailwind CSS)
- **状態管理**: Zustand
- **データベース**: expo-sqlite
- **ヘルスAPI**: react-native-health (iOS HealthKit)

## 開発環境のセットアップ

### 必要条件

- Node.js 18以上
- pnpm (推奨) または npm
- Xcode (iOS開発の場合)
- Android Studio (Android開発の場合)

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd StepLift

# 依存関係をインストール
pnpm install
```

### 開発サーバーの起動

```bash
# Expo開発サーバーを起動
pnpm start

# キャッシュをクリアして起動
npx expo start --clear
```

### ローカルビルド

```bash
# iOS シミュレーター
npx expo run:ios

# iOS 実機 (開発ビルド)
npx expo run:ios --device

# Android
npx expo run:android
```

> **Note**: HealthKit連携などのネイティブ機能は開発ビルドが必要です。Expo Goでは動作しません。

## テスト

```bash
# テスト実行
pnpm test

# ウォッチモード
pnpm test:watch

# カバレッジ付き
pnpm test:coverage
```

## プロジェクト構造

```
/
├── app/                    # Expo Router (ファイルベースルーティング)
│   ├── (tabs)/             # タブナビゲーション
│   │   ├── index.tsx       # ダッシュボード
│   │   ├── workout.tsx     # ワークアウト
│   │   ├── steps.tsx       # 歩数
│   │   └── history.tsx     # 履歴
│   ├── workout/            # ワークアウト詳細画面
│   ├── settings/           # 設定画面
│   └── _layout.tsx         # ルートレイアウト
├── components/             # 再利用可能なコンポーネント
│   ├── ui/                 # UIプリミティブ
│   ├── workout/            # ワークアウト関連
│   ├── steps/              # 歩数関連
│   └── settings/           # 設定関連
├── lib/                    # ビジネスロジック
│   ├── db/                 # データベース (SQLite)
│   ├── stores/             # Zustand ストア
│   └── services/           # 外部サービス連携
├── constants/              # 定数 (カラー等)
├── hooks/                  # カスタムフック
├── types/                  # TypeScript型定義
├── __tests__/              # テストファイル
└── docs/                   # ドキュメント
```

## EASビルド・デプロイ

```bash
# プレビュービルド
pnpm draft

# 開発ビルド (EAS)
pnpm development-builds

# 本番デプロイ
pnpm deploy
```

## ドキュメント

- [PRD (製品要件定義書)](docs/PRD.md)
- [アーキテクチャ](docs/ARCHITECTURE.md)
- [データモデル](docs/DATA_MODEL.md)
- [画面設計](docs/SCREENS.md)

## ライセンス

0BSD
