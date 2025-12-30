import type { SQLiteDatabase } from 'expo-sqlite';
import { ALL_TABLE_SCHEMAS } from '../schema';
import { PRESET_EXERCISES } from '@/constants/exercises';

/**
 * マイグレーション001: 初期セットアップ
 *
 * - すべてのテーブルを作成
 * - プリセット種目を投入
 * - デフォルトの歩数目標を設定
 */
export function up(db: SQLiteDatabase): void {
  try {
    console.log('[Migration 001] 初期セットアップを開始');

    // すべてのテーブルを作成
    console.log('[Migration 001] テーブルを作成中...');
    for (const schema of ALL_TABLE_SCHEMAS) {
      db.execSync(schema);
    }

    // プリセット種目を投入
    console.log('[Migration 001] プリセット種目を投入中...');
    const insertExerciseStmt = db.prepareSync(
      'INSERT INTO exercises (id, name, category, is_custom, created_at) VALUES (?, ?, ?, ?, datetime("now"))'
    );

    try {
      for (let i = 0; i < PRESET_EXERCISES.length; i++) {
        const exercise = PRESET_EXERCISES[i];
        const id = `preset_${i + 1}`;
        insertExerciseStmt.executeSync([
          id,
          exercise.name,
          exercise.category,
          exercise.isCustom ? 1 : 0,
        ]);
      }
    } finally {
      insertExerciseStmt.finalizeSync();
    }

    // デフォルトの歩数目標を設定 (10,000歩)
    console.log('[Migration 001] デフォルト歩数目標を設定中...');
    db.runSync(
      'INSERT INTO step_goals (id, daily_steps, updated_at) VALUES (?, ?, datetime("now"))',
      ['default_goal', 10000]
    );

    console.log('[Migration 001] 初期セットアップが完了しました');
  } catch (error) {
    console.error('[Migration 001] エラーが発生しました:', error);
    throw error;
  }
}
