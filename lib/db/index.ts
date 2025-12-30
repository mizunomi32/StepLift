import * as SQLite from 'expo-sqlite';
import { getMigrationStatus, runMigrations } from './migrations';

/**
 * データベースインスタンス
 */
let database: SQLite.SQLiteDatabase | null = null;

/**
 * データベースを開く
 */
export function openDatabase(): SQLite.SQLiteDatabase {
  if (!database) {
    console.log('[Database] データベースを開いています...');
    database = SQLite.openDatabaseSync('steplift.db');
    console.log('[Database] データベースを開きました');
  }
  return database;
}

/**
 * データベースを初期化
 *
 * - データベースを開く
 * - 外部キー制約を有効化
 * - マイグレーションを実行
 */
export function initializeDatabase(): void {
  try {
    console.log('[Database] データベースの初期化を開始');

    const db = openDatabase();

    // 外部キー制約を有効化
    console.log('[Database] 外部キー制約を有効化中...');
    db.execSync('PRAGMA foreign_keys = ON');

    // マイグレーションの状態を確認
    const status = getMigrationStatus(db);
    console.log('[Database] マイグレーション状態:', status);

    // マイグレーションを実行
    if (!status.isUpToDate) {
      console.log(`[Database] ${status.pendingCount}個のマイグレーションを実行します`);
      const executedCount = runMigrations(db);
      console.log(`[Database] ${executedCount}個のマイグレーションが完了しました`);
    } else {
      console.log('[Database] データベースは最新です');
    }

    console.log('[Database] データベースの初期化が完了しました');
  } catch (error) {
    console.error('[Database] 初期化エラー:', error);
    throw new Error(`データベースの初期化に失敗しました: ${error}`);
  }
}

/**
 * データベースインスタンスを取得
 *
 * 初期化されていない場合は自動的に初期化します
 */
export function getDatabase(): SQLite.SQLiteDatabase {
  if (!database) {
    initializeDatabase();
  }
  return database!;
}

/**
 * データベースを閉じる
 *
 * テスト環境でのクリーンアップ用
 */
export function closeDatabase(): void {
  if (database) {
    console.log('[Database] データベースを閉じています...');
    database.closeSync();
    database = null;
    console.log('[Database] データベースを閉じました');
  }
}

/**
 * データベースをリセット (開発/テスト用)
 *
 * DANGER: すべてのデータが削除されます
 */
export async function resetDatabase(): Promise<void> {
  try {
    console.log('[Database] データベースをリセットしています...');

    // データベースを閉じる
    closeDatabase();

    // データベースファイルを削除
    await SQLite.deleteDatabaseAsync('steplift.db');

    console.log('[Database] データベースがリセットされました');

    // 再初期化
    initializeDatabase();
  } catch (error) {
    console.error('[Database] リセットエラー:', error);
    throw new Error(`データベースのリセットに失敗しました: ${error}`);
  }
}

// デフォルトエクスポート
export const db = { getDatabase, initializeDatabase, closeDatabase, resetDatabase };
