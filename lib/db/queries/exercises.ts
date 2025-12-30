import type { Exercise, ExerciseCategory, ExerciseRow } from '@/types/exercise';
import { exerciseFromRow } from '@/types/exercise';
import { getDatabase } from '../index';

/**
 * すべての種目を取得
 */
export function getAllExercises(): Exercise[] {
  try {
    const db = getDatabase();
    const rows = db.getAllSync<ExerciseRow>('SELECT * FROM exercises ORDER BY category, name');
    return rows.map(exerciseFromRow);
  } catch (error) {
    console.error('[Exercises] すべての種目の取得エラー:', error);
    throw new Error(`種目の取得に失敗しました: ${error}`);
  }
}

/**
 * カテゴリ別に種目を取得
 */
export function getExercisesByCategory(category: ExerciseCategory): Exercise[] {
  try {
    const db = getDatabase();
    const rows = db.getAllSync<ExerciseRow>(
      'SELECT * FROM exercises WHERE category = ? ORDER BY name',
      [category]
    );
    return rows.map(exerciseFromRow);
  } catch (error) {
    console.error('[Exercises] カテゴリ別種目の取得エラー:', error);
    throw new Error(`カテゴリ別種目の取得に失敗しました: ${error}`);
  }
}

/**
 * IDで種目を取得
 */
export function getExerciseById(id: string): Exercise | null {
  try {
    const db = getDatabase();
    const row = db.getFirstSync<ExerciseRow>('SELECT * FROM exercises WHERE id = ?', [id]);
    return row ? exerciseFromRow(row) : null;
  } catch (error) {
    console.error('[Exercises] 種目の取得エラー:', error);
    throw new Error(`種目の取得に失敗しました: ${error}`);
  }
}

/**
 * カスタム種目を作成
 */
export function createCustomExercise(exercise: Omit<Exercise, 'id' | 'createdAt'>): Exercise {
  try {
    const db = getDatabase();
    const id = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    db.runSync(
      'INSERT INTO exercises (id, name, category, is_custom, created_at) VALUES (?, ?, ?, ?, datetime("now"))',
      [id, exercise.name, exercise.category, exercise.isCustom ? 1 : 0]
    );

    const created = getExerciseById(id);
    if (!created) {
      throw new Error('種目の作成に失敗しました');
    }

    console.log('[Exercises] カスタム種目を作成しました:', created);
    return created;
  } catch (error) {
    console.error('[Exercises] カスタム種目の作成エラー:', error);
    throw new Error(`カスタム種目の作成に失敗しました: ${error}`);
  }
}

/**
 * 種目を更新
 */
export function updateExercise(
  id: string,
  updates: Partial<Omit<Exercise, 'id' | 'createdAt'>>
): Exercise {
  try {
    const db = getDatabase();

    // 既存の種目を確認
    const existing = getExerciseById(id);
    if (!existing) {
      throw new Error(`種目が見つかりません: ${id}`);
    }

    // 更新可能なフィールドのみを処理
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.category !== undefined) {
      fields.push('category = ?');
      values.push(updates.category);
    }

    if (fields.length === 0) {
      return existing;
    }

    values.push(id);
    const sql = `UPDATE exercises SET ${fields.join(', ')} WHERE id = ?`;
    db.runSync(sql, values);

    const updated = getExerciseById(id);
    if (!updated) {
      throw new Error('種目の更新に失敗しました');
    }

    console.log('[Exercises] 種目を更新しました:', updated);
    return updated;
  } catch (error) {
    console.error('[Exercises] 種目の更新エラー:', error);
    throw new Error(`種目の更新に失敗しました: ${error}`);
  }
}

/**
 * カスタム種目を削除
 */
export function deleteCustomExercise(id: string): boolean {
  try {
    const db = getDatabase();

    // カスタム種目かどうかを確認
    const exercise = getExerciseById(id);
    if (!exercise) {
      throw new Error(`種目が見つかりません: ${id}`);
    }
    if (!exercise.isCustom) {
      throw new Error('プリセット種目は削除できません');
    }

    db.runSync('DELETE FROM exercises WHERE id = ?', [id]);
    console.log('[Exercises] カスタム種目を削除しました:', id);
    return true;
  } catch (error) {
    console.error('[Exercises] カスタム種目の削除エラー:', error);
    throw new Error(`カスタム種目の削除に失敗しました: ${error}`);
  }
}

/**
 * プリセット種目の数を取得
 */
export function getPresetExerciseCount(): number {
  try {
    const db = getDatabase();
    const result = db.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM exercises WHERE is_custom = 0'
    );
    return result?.count ?? 0;
  } catch (error) {
    console.error('[Exercises] プリセット種目数の取得エラー:', error);
    throw new Error(`プリセット種目数の取得に失敗しました: ${error}`);
  }
}

/**
 * カスタム種目の数を取得
 */
export function getCustomExerciseCount(): number {
  try {
    const db = getDatabase();
    const result = db.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM exercises WHERE is_custom = 1'
    );
    return result?.count ?? 0;
  } catch (error) {
    console.error('[Exercises] カスタム種目数の取得エラー:', error);
    throw new Error(`カスタム種目数の取得に失敗しました: ${error}`);
  }
}
