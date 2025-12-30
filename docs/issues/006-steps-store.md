# Issue #006: 歩数ストア実装

## 概要
歩数トラッキング機能の状態管理とデバイスセンサー/ヘルスAPI連携を実装する。

## タスク

### 1. 型定義
`types/steps.ts`:

```typescript
export type StepSource = 'sensor' | 'healthkit' | 'health_connect' | 'manual';

export interface StepRecord {
  id: string;
  date: string; // YYYY-MM-DD
  steps: number;
  distanceKm: number | null;
  calories: number | null;
  source: StepSource;
}

export interface StepGoal {
  dailySteps: number;
}

export interface DailyStepSummary {
  date: string;
  steps: number;
  goal: number;
  percentage: number;
  distanceKm: number | null;
  calories: number | null;
}
```

### 2. 歩数ストア実装
`lib/stores/steps-store.ts`:

```typescript
interface StepsState {
  // 状態
  todaySteps: number;
  dailyGoal: number;
  weeklyRecords: StepRecord[];
  isTracking: boolean;

  // アクション
  startTracking: () => Promise<void>;
  stopTracking: () => void;
  updateTodaySteps: (steps: number) => void;
  setDailyGoal: (steps: number) => Promise<void>;
  loadWeeklyRecords: () => Promise<void>;
  syncWithHealthAPI: () => Promise<void>;
}
```

### 3. 歩数センサー連携
`lib/hooks/use-pedometer.ts`:

```typescript
import { Pedometer } from 'expo-sensors';

export function usePedometer() {
  // Pedometerサブスクリプション
  // 歩数更新のコールバック
  // 権限チェック
}
```

### 4. HealthKit連携 (iOS)
`lib/services/healthkit.ts`:

```typescript
// expo-health または react-native-health を使用
export async function requestHealthKitPermissions(): Promise<boolean>;
export async function getTodaySteps(): Promise<number>;
export async function getStepHistory(days: number): Promise<StepRecord[]>;
```

### 5. Health Connect連携 (Android)
`lib/services/health-connect.ts`:

```typescript
// react-native-health-connect を使用
export async function requestHealthConnectPermissions(): Promise<boolean>;
export async function getTodaySteps(): Promise<number>;
export async function getStepHistory(days: number): Promise<StepRecord[]>;
```

### 6. 歩数計算ユーティリティ
`lib/utils/step-calculations.ts`:

```typescript
// 歩幅の推定（身長から）
export function estimateStrideLength(heightCm: number): number;

// 距離計算
export function calculateDistance(steps: number, strideLengthM: number): number;

// カロリー計算
export function calculateCalories(steps: number, weightKg: number): number;

// 日付ユーティリティ
export function getWeekDates(): string[];
export function formatDate(date: Date): string;
```

## 受け入れ条件
- [ ] 今日の歩数が取得できる
- [ ] 歩数目標の設定・取得ができる
- [ ] 週間の歩数履歴が取得できる
- [ ] 距離・カロリーが計算される
- [ ] iOS/Androidそれぞれで歩数が取得できる
- [ ] データベースに歩数が保存される

## 参照ドキュメント
- [DATA_MODEL.md](../DATA_MODEL.md) - steps関連テーブル
- [PRD.md](../PRD.md) - 歩数トラッキング機能

## 依存関係
- #001 (プロジェクト基盤セットアップ)
- #002 (データベースセットアップ)

## 追加パッケージ
```bash
pnpm add expo-sensors
# iOS: HealthKit設定が必要
# Android: Health Connect設定が必要
```

## 優先度
**高** - MVP コア機能

## 見積もり
Medium (3-4時間)
