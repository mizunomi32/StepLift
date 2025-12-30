import { getDatabase } from '../index';
import type { StepRecord, StepRecordRow, StepGoal, StepGoalRow, StepSource } from '@/types/steps';
import { stepRecordFromRow, stepGoalFromRow } from '@/types/steps';

/**
 * 歩数記録をupsert (存在すれば更新、なければ挿入)
 */
export function upsertStepRecord(record: Omit<StepRecord, 'id' | 'createdAt'>): StepRecord {
  try {
    const db = getDatabase();

    // 同じ日付のレコードが存在するか確認
    const existing = getStepRecordByDate(record.date);

    if (existing) {
      // 更新
      db.runSync(
        `UPDATE step_records
         SET steps = ?, distance_km = ?, calories = ?, source = ?
         WHERE date = ?`,
        [
          record.steps,
          record.distanceKm ?? null,
          record.calories ?? null,
          record.source,
          record.date,
        ]
      );
      const updated = getStepRecordByDate(record.date);
      if (!updated) {
        throw new Error('歩数記録の更新に失敗しました');
      }
      console.log('[Steps] 歩数記録を更新しました:', updated);
      return updated;
    } else {
      // 挿入
      const id = `step_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      db.runSync(
        `INSERT INTO step_records
         (id, date, steps, distance_km, calories, source, created_at)
         VALUES (?, ?, ?, ?, ?, ?, datetime("now"))`,
        [
          id,
          record.date,
          record.steps,
          record.distanceKm ?? null,
          record.calories ?? null,
          record.source,
        ]
      );
      const created = getStepRecordByDate(record.date);
      if (!created) {
        throw new Error('歩数記録の作成に失敗しました');
      }
      console.log('[Steps] 歩数記録を作成しました:', created);
      return created;
    }
  } catch (error) {
    console.error('[Steps] 歩数記録のupsertエラー:', error);
    throw new Error(`歩数記録の保存に失敗しました: ${error}`);
  }
}

/**
 * 日付で歩数記録を取得
 */
export function getStepRecordByDate(date: string): StepRecord | null {
  try {
    const db = getDatabase();
    const row = db.getFirstSync<StepRecordRow>('SELECT * FROM step_records WHERE date = ?', [date]);
    return row ? stepRecordFromRow(row) : null;
  } catch (error) {
    console.error('[Steps] 歩数記録の取得エラー:', error);
    throw new Error(`歩数記録の取得に失敗しました: ${error}`);
  }
}

/**
 * 日付範囲で歩数記録を取得
 */
export function getStepRecordsByDateRange(startDate: string, endDate: string): StepRecord[] {
  try {
    const db = getDatabase();
    const rows = db.getAllSync<StepRecordRow>(
      `SELECT * FROM step_records
       WHERE date >= ? AND date <= ?
       ORDER BY date ASC`,
      [startDate, endDate]
    );
    return rows.map(stepRecordFromRow);
  } catch (error) {
    console.error('[Steps] 日付範囲での歩数記録取得エラー:', error);
    throw new Error(`歩数記録の取得に失敗しました: ${error}`);
  }
}

/**
 * 最近の歩数記録を取得
 */
export function getRecentStepRecords(limit: number = 30): StepRecord[] {
  try {
    const db = getDatabase();
    const rows = db.getAllSync<StepRecordRow>(
      'SELECT * FROM step_records ORDER BY date DESC LIMIT ?',
      [limit]
    );
    return rows.map(stepRecordFromRow);
  } catch (error) {
    console.error('[Steps] 最近の歩数記録取得エラー:', error);
    throw new Error(`歩数記録の取得に失敗しました: ${error}`);
  }
}

/**
 * 歩数記録を削除
 */
export function deleteStepRecord(date: string): boolean {
  try {
    const db = getDatabase();
    db.runSync('DELETE FROM step_records WHERE date = ?', [date]);
    console.log('[Steps] 歩数記録を削除しました:', date);
    return true;
  } catch (error) {
    console.error('[Steps] 歩数記録の削除エラー:', error);
    throw new Error(`歩数記録の削除に失敗しました: ${error}`);
  }
}

/**
 * 歩数目標を取得
 */
export function getStepGoal(): StepGoal | null {
  try {
    const db = getDatabase();
    // デフォルト目標を取得
    const row = db.getFirstSync<StepGoalRow>(
      'SELECT * FROM step_goals WHERE id = ?',
      ['default_goal']
    );
    return row ? stepGoalFromRow(row) : null;
  } catch (error) {
    console.error('[Steps] 歩数目標の取得エラー:', error);
    throw new Error(`歩数目標の取得に失敗しました: ${error}`);
  }
}

/**
 * 歩数目標を更新
 */
export function updateStepGoal(dailySteps: number): StepGoal {
  try {
    const db = getDatabase();

    // 既存の目標を確認
    const existing = getStepGoal();

    if (existing) {
      // 更新
      db.runSync(
        'UPDATE step_goals SET daily_steps = ?, updated_at = datetime("now") WHERE id = ?',
        [dailySteps, 'default_goal']
      );
    } else {
      // 新規作成 (通常はマイグレーションで作成されるが、念のため)
      db.runSync(
        'INSERT INTO step_goals (id, daily_steps, updated_at) VALUES (?, ?, datetime("now"))',
        ['default_goal', dailySteps]
      );
    }

    const updated = getStepGoal();
    if (!updated) {
      throw new Error('歩数目標の更新に失敗しました');
    }

    console.log('[Steps] 歩数目標を更新しました:', updated);
    return updated;
  } catch (error) {
    console.error('[Steps] 歩数目標の更新エラー:', error);
    throw new Error(`歩数目標の更新に失敗しました: ${error}`);
  }
}

/**
 * 期間の合計歩数を取得
 */
export function getTotalStepsByDateRange(startDate: string, endDate: string): number {
  try {
    const db = getDatabase();
    const result = db.getFirstSync<{ total: number }>(
      `SELECT SUM(steps) as total FROM step_records
       WHERE date >= ? AND date <= ?`,
      [startDate, endDate]
    );
    return result?.total ?? 0;
  } catch (error) {
    console.error('[Steps] 合計歩数の取得エラー:', error);
    throw new Error(`合計歩数の取得に失敗しました: ${error}`);
  }
}

/**
 * 期間の平均歩数を取得
 */
export function getAverageStepsByDateRange(startDate: string, endDate: string): number {
  try {
    const db = getDatabase();
    const result = db.getFirstSync<{ average: number }>(
      `SELECT AVG(steps) as average FROM step_records
       WHERE date >= ? AND date <= ?`,
      [startDate, endDate]
    );
    return Math.round(result?.average ?? 0);
  } catch (error) {
    console.error('[Steps] 平均歩数の取得エラー:', error);
    throw new Error(`平均歩数の取得に失敗しました: ${error}`);
  }
}

/**
 * 目標達成日数を取得
 */
export function getGoalAchievementDays(startDate: string, endDate: string): number {
  try {
    const db = getDatabase();
    const goal = getStepGoal();
    if (!goal) {
      return 0;
    }

    const result = db.getFirstSync<{ count: number }>(
      `SELECT COUNT(*) as count FROM step_records
       WHERE date >= ? AND date <= ? AND steps >= ?`,
      [startDate, endDate, goal.dailySteps]
    );
    return result?.count ?? 0;
  } catch (error) {
    console.error('[Steps] 目標達成日数の取得エラー:', error);
    throw new Error(`目標達成日数の取得に失敗しました: ${error}`);
  }
}

/**
 * 今日の歩数を取得
 */
export function getTodaySteps(): number {
  try {
    const today = new Date().toISOString().split('T')[0];
    const record = getStepRecordByDate(today);
    return record?.steps ?? 0;
  } catch (error) {
    console.error('[Steps] 今日の歩数取得エラー:', error);
    return 0;
  }
}

/**
 * 週間の歩数記録を取得（過去7日間）
 */
export function getWeeklyStepRecords(): StepRecord[] {
  try {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);

    const startDate = weekAgo.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];

    return getStepRecordsByDateRange(startDate, endDate);
  } catch (error) {
    console.error('[Steps] 週間歩数記録取得エラー:', error);
    return [];
  }
}

/**
 * 歩数記録を更新または作成（今日の日付で）
 */
export function updateOrCreateStepRecord(steps: number, distanceKm?: number | null, calories?: number | null, source: StepSource = 'sensor'): StepRecord {
  const today = new Date().toISOString().split('T')[0];
  return upsertStepRecord({
    date: today,
    steps,
    distanceKm: distanceKm ?? null,
    calories: calories ?? null,
    source,
  });
}
