import { getDatabase } from '../index';
import type { Workout, WorkoutRow, WorkoutWithSets, WorkoutSetWithExerciseRow } from '@/types/workout';
import { workoutFromRow, workoutSetWithExerciseFromRow } from '@/types/workout';

/**
 * ワークアウトを作成
 */
export function createWorkout(startedAt?: string, notes?: string): Workout {
  try {
    const db = getDatabase();
    const id = `workout_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const started = startedAt || new Date().toISOString();

    db.runSync(
      'INSERT INTO workouts (id, started_at, finished_at, notes, created_at) VALUES (?, ?, ?, ?, datetime("now"))',
      [id, started, null, notes || null]
    );

    const created = getWorkoutById(id);
    if (!created) {
      throw new Error('ワークアウトの作成に失敗しました');
    }

    console.log('[Workouts] ワークアウトを作成しました:', created);
    return created;
  } catch (error) {
    console.error('[Workouts] ワークアウトの作成エラー:', error);
    throw new Error(`ワークアウトの作成に失敗しました: ${error}`);
  }
}

/**
 * IDでワークアウトを取得
 */
export function getWorkoutById(id: string): Workout | null {
  try {
    const db = getDatabase();
    const row = db.getFirstSync<WorkoutRow>('SELECT * FROM workouts WHERE id = ?', [id]);
    return row ? workoutFromRow(row) : null;
  } catch (error) {
    console.error('[Workouts] ワークアウトの取得エラー:', error);
    throw new Error(`ワークアウトの取得に失敗しました: ${error}`);
  }
}

/**
 * ワークアウトをセット情報とともに取得
 */
export function getWorkoutWithSets(id: string): WorkoutWithSets | null {
  try {
    const db = getDatabase();

    // ワークアウト情報を取得
    const workout = getWorkoutById(id);
    if (!workout) {
      return null;
    }

    // セット情報を取得
    const setRows = db.getAllSync<WorkoutSetWithExerciseRow>(
      `
      SELECT
        ws.*,
        e.id as exercise_id,
        e.name as exercise_name,
        e.category as exercise_category,
        e.is_custom as exercise_is_custom,
        e.created_at as exercise_created_at
      FROM workout_sets ws
      JOIN exercises e ON ws.exercise_id = e.id
      WHERE ws.workout_id = ?
      ORDER BY ws.set_number
      `,
      [id]
    );

    const sets = setRows.map(workoutSetWithExerciseFromRow);

    return {
      ...workout,
      sets,
    };
  } catch (error) {
    console.error('[Workouts] ワークアウト詳細の取得エラー:', error);
    throw new Error(`ワークアウト詳細の取得に失敗しました: ${error}`);
  }
}

/**
 * 日付範囲でワークアウトを取得
 */
export function getWorkoutsByDateRange(startDate: string, endDate: string): Workout[] {
  try {
    const db = getDatabase();
    const rows = db.getAllSync<WorkoutRow>(
      `
      SELECT * FROM workouts
      WHERE date(started_at) >= date(?) AND date(started_at) <= date(?)
      ORDER BY started_at DESC
      `,
      [startDate, endDate]
    );
    return rows.map(workoutFromRow);
  } catch (error) {
    console.error('[Workouts] 日付範囲でのワークアウト取得エラー:', error);
    throw new Error(`ワークアウトの取得に失敗しました: ${error}`);
  }
}

/**
 * 最近のワークアウトを取得
 */
export function getRecentWorkouts(limit: number = 10): Workout[] {
  try {
    const db = getDatabase();
    const rows = db.getAllSync<WorkoutRow>(
      'SELECT * FROM workouts ORDER BY started_at DESC LIMIT ?',
      [limit]
    );
    return rows.map(workoutFromRow);
  } catch (error) {
    console.error('[Workouts] 最近のワークアウト取得エラー:', error);
    throw new Error(`ワークアウトの取得に失敗しました: ${error}`);
  }
}

/**
 * 進行中のワークアウトを取得
 */
export function getActiveWorkout(): Workout | null {
  try {
    const db = getDatabase();
    const row = db.getFirstSync<WorkoutRow>(
      'SELECT * FROM workouts WHERE finished_at IS NULL ORDER BY started_at DESC LIMIT 1'
    );
    return row ? workoutFromRow(row) : null;
  } catch (error) {
    console.error('[Workouts] 進行中ワークアウトの取得エラー:', error);
    throw new Error(`ワークアウトの取得に失敗しました: ${error}`);
  }
}

/**
 * ワークアウトを更新
 */
export function updateWorkout(
  id: string,
  updates: Partial<Omit<Workout, 'id' | 'createdAt'>>
): Workout {
  try {
    const db = getDatabase();

    // 既存のワークアウトを確認
    const existing = getWorkoutById(id);
    if (!existing) {
      throw new Error(`ワークアウトが見つかりません: ${id}`);
    }

    // 更新可能なフィールドのみを処理
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.startedAt !== undefined) {
      fields.push('started_at = ?');
      values.push(updates.startedAt);
    }
    if (updates.finishedAt !== undefined) {
      fields.push('finished_at = ?');
      values.push(updates.finishedAt);
    }
    if (updates.notes !== undefined) {
      fields.push('notes = ?');
      values.push(updates.notes);
    }

    if (fields.length === 0) {
      return existing;
    }

    values.push(id);
    const sql = `UPDATE workouts SET ${fields.join(', ')} WHERE id = ?`;
    db.runSync(sql, values);

    const updated = getWorkoutById(id);
    if (!updated) {
      throw new Error('ワークアウトの更新に失敗しました');
    }

    console.log('[Workouts] ワークアウトを更新しました:', updated);
    return updated;
  } catch (error) {
    console.error('[Workouts] ワークアウトの更新エラー:', error);
    throw new Error(`ワークアウトの更新に失敗しました: ${error}`);
  }
}

/**
 * ワークアウトを終了
 */
export function finishWorkout(id: string, finishedAt?: string): Workout {
  const finished = finishedAt || new Date().toISOString();
  return updateWorkout(id, { finishedAt: finished });
}

/**
 * ワークアウトを削除
 */
export function deleteWorkout(id: string): boolean {
  try {
    const db = getDatabase();

    // ワークアウトが存在するか確認
    const existing = getWorkoutById(id);
    if (!existing) {
      throw new Error(`ワークアウトが見つかりません: ${id}`);
    }

    // CASCADE削除により、関連するセットも自動的に削除される
    db.runSync('DELETE FROM workouts WHERE id = ?', [id]);
    console.log('[Workouts] ワークアウトを削除しました:', id);
    return true;
  } catch (error) {
    console.error('[Workouts] ワークアウトの削除エラー:', error);
    throw new Error(`ワークアウトの削除に失敗しました: ${error}`);
  }
}

/**
 * ワークアウト総数を取得
 */
export function getWorkoutCount(): number {
  try {
    const db = getDatabase();
    const result = db.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM workouts');
    return result?.count ?? 0;
  } catch (error) {
    console.error('[Workouts] ワークアウト数の取得エラー:', error);
    throw new Error(`ワークアウト数の取得に失敗しました: ${error}`);
  }
}
