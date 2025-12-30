import { getDatabase } from '../index';
import type { WorkoutSet, WorkoutSetRow } from '@/types/workout';
import { workoutSetFromRow } from '@/types/workout';

/**
 * セットを追加
 */
export function addSet(set: Omit<WorkoutSet, 'id' | 'createdAt'>): WorkoutSet {
  try {
    const db = getDatabase();
    const id = `set_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    db.runSync(
      `INSERT INTO workout_sets
       (id, workout_id, exercise_id, set_number, weight_kg, reps, notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime("now"))`,
      [
        id,
        set.workoutId,
        set.exerciseId,
        set.setNumber,
        set.weightKg ?? null,
        set.reps ?? null,
        set.notes ?? null,
      ]
    );

    const created = getSetById(id);
    if (!created) {
      throw new Error('セットの作成に失敗しました');
    }

    console.log('[WorkoutSets] セットを追加しました:', created);
    return created;
  } catch (error) {
    console.error('[WorkoutSets] セットの追加エラー:', error);
    throw new Error(`セットの追加に失敗しました: ${error}`);
  }
}

/**
 * IDでセットを取得
 */
export function getSetById(id: string): WorkoutSet | null {
  try {
    const db = getDatabase();
    const row = db.getFirstSync<WorkoutSetRow>('SELECT * FROM workout_sets WHERE id = ?', [id]);
    return row ? workoutSetFromRow(row) : null;
  } catch (error) {
    console.error('[WorkoutSets] セットの取得エラー:', error);
    throw new Error(`セットの取得に失敗しました: ${error}`);
  }
}

/**
 * ワークアウトIDでセットを取得
 */
export function getSetsByWorkoutId(workoutId: string): WorkoutSet[] {
  try {
    const db = getDatabase();
    const rows = db.getAllSync<WorkoutSetRow>(
      'SELECT * FROM workout_sets WHERE workout_id = ? ORDER BY set_number',
      [workoutId]
    );
    return rows.map(workoutSetFromRow);
  } catch (error) {
    console.error('[WorkoutSets] ワークアウトのセット取得エラー:', error);
    throw new Error(`セットの取得に失敗しました: ${error}`);
  }
}

/**
 * 種目IDでセットを取得
 */
export function getSetsByExerciseId(exerciseId: string): WorkoutSet[] {
  try {
    const db = getDatabase();
    const rows = db.getAllSync<WorkoutSetRow>(
      'SELECT * FROM workout_sets WHERE exercise_id = ? ORDER BY created_at DESC',
      [exerciseId]
    );
    return rows.map(workoutSetFromRow);
  } catch (error) {
    console.error('[WorkoutSets] 種目のセット取得エラー:', error);
    throw new Error(`セットの取得に失敗しました: ${error}`);
  }
}

/**
 * セットを更新
 */
export function updateSet(
  id: string,
  updates: Partial<Omit<WorkoutSet, 'id' | 'workoutId' | 'exerciseId' | 'createdAt'>>
): WorkoutSet {
  try {
    const db = getDatabase();

    // 既存のセットを確認
    const existing = getSetById(id);
    if (!existing) {
      throw new Error(`セットが見つかりません: ${id}`);
    }

    // 更新可能なフィールドのみを処理
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.setNumber !== undefined) {
      fields.push('set_number = ?');
      values.push(updates.setNumber);
    }
    if (updates.weightKg !== undefined) {
      fields.push('weight_kg = ?');
      values.push(updates.weightKg);
    }
    if (updates.reps !== undefined) {
      fields.push('reps = ?');
      values.push(updates.reps);
    }
    if (updates.notes !== undefined) {
      fields.push('notes = ?');
      values.push(updates.notes);
    }

    if (fields.length === 0) {
      return existing;
    }

    values.push(id);
    const sql = `UPDATE workout_sets SET ${fields.join(', ')} WHERE id = ?`;
    db.runSync(sql, values);

    const updated = getSetById(id);
    if (!updated) {
      throw new Error('セットの更新に失敗しました');
    }

    console.log('[WorkoutSets] セットを更新しました:', updated);
    return updated;
  } catch (error) {
    console.error('[WorkoutSets] セットの更新エラー:', error);
    throw new Error(`セットの更新に失敗しました: ${error}`);
  }
}

/**
 * セットを削除
 */
export function deleteSet(id: string): boolean {
  try {
    const db = getDatabase();

    // セットが存在するか確認
    const existing = getSetById(id);
    if (!existing) {
      throw new Error(`セットが見つかりません: ${id}`);
    }

    db.runSync('DELETE FROM workout_sets WHERE id = ?', [id]);
    console.log('[WorkoutSets] セットを削除しました:', id);
    return true;
  } catch (error) {
    console.error('[WorkoutSets] セットの削除エラー:', error);
    throw new Error(`セットの削除に失敗しました: ${error}`);
  }
}

/**
 * ワークアウトのすべてのセットを削除
 */
export function deleteAllSetsByWorkoutId(workoutId: string): number {
  try {
    const db = getDatabase();
    const result = db.runSync('DELETE FROM workout_sets WHERE workout_id = ?', [workoutId]);
    const deletedCount = result.changes;
    console.log('[WorkoutSets] ワークアウトのセットを削除しました:', deletedCount);
    return deletedCount;
  } catch (error) {
    console.error('[WorkoutSets] セットの一括削除エラー:', error);
    throw new Error(`セットの削除に失敗しました: ${error}`);
  }
}

/**
 * 種目の最新セットを取得 (前回の記録を参照用に)
 */
export function getLatestSetByExerciseId(exerciseId: string): WorkoutSet | null {
  try {
    const db = getDatabase();
    const row = db.getFirstSync<WorkoutSetRow>(
      'SELECT * FROM workout_sets WHERE exercise_id = ? ORDER BY created_at DESC LIMIT 1',
      [exerciseId]
    );
    return row ? workoutSetFromRow(row) : null;
  } catch (error) {
    console.error('[WorkoutSets] 最新セットの取得エラー:', error);
    throw new Error(`最新セットの取得に失敗しました: ${error}`);
  }
}

/**
 * セット総数を取得
 */
export function getSetCount(): number {
  try {
    const db = getDatabase();
    const result = db.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM workout_sets');
    return result?.count ?? 0;
  } catch (error) {
    console.error('[WorkoutSets] セット数の取得エラー:', error);
    throw new Error(`セット数の取得に失敗しました: ${error}`);
  }
}
