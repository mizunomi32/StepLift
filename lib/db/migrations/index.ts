import type { SQLiteDatabase } from 'expo-sqlite';
import * as migration001 from './001_initial';

export interface Migration {
  version: number;
  up: (db: SQLiteDatabase) => void;
}

/**
 * すべてのマイグレーション定義
 * バージョン番号順に並べる
 */
export const MIGRATIONS: Migration[] = [
  { version: 1, up: migration001.up },
  // 将来のマイグレーションをここに追加
];

/**
 * 現在のデータベースバージョンを取得
 */
export function getCurrentVersion(db: SQLiteDatabase): number {
  try {
    const result = db.getFirstSync<{ user_version: number }>('PRAGMA user_version');
    return result?.user_version ?? 0;
  } catch (error) {
    console.error('[Migration] バージョン取得エラー:', error);
    return 0;
  }
}

/**
 * データベースバージョンを設定
 */
export function setVersion(db: SQLiteDatabase, version: number): void {
  try {
    db.execSync(`PRAGMA user_version = ${version}`);
  } catch (error) {
    console.error('[Migration] バージョン設定エラー:', error);
    throw error;
  }
}

/**
 * マイグレーションを実行
 *
 * @param db - SQLiteデータベースインスタンス
 * @returns 実行されたマイグレーション数
 */
export function runMigrations(db: SQLiteDatabase): number {
  try {
    const currentVersion = getCurrentVersion(db);
    console.log(`[Migration] 現在のバージョン: ${currentVersion}`);

    // 実行する必要のあるマイグレーションをフィルタリング
    const pendingMigrations = MIGRATIONS.filter((m) => m.version > currentVersion);

    if (pendingMigrations.length === 0) {
      console.log('[Migration] 実行するマイグレーションはありません');
      return 0;
    }

    console.log(`[Migration] ${pendingMigrations.length}個のマイグレーションを実行します`);

    // トランザクション内でマイグレーションを実行
    db.withTransactionSync(() => {
      for (const migration of pendingMigrations) {
        console.log(`[Migration] バージョン ${migration.version} を実行中...`);
        migration.up(db);
        setVersion(db, migration.version);
        console.log(`[Migration] バージョン ${migration.version} が完了しました`);
      }
    });

    const newVersion = getCurrentVersion(db);
    console.log(`[Migration] マイグレーション完了。新しいバージョン: ${newVersion}`);

    return pendingMigrations.length;
  } catch (error) {
    console.error('[Migration] マイグレーション実行エラー:', error);
    throw error;
  }
}

/**
 * マイグレーションの状態を確認
 */
export function getMigrationStatus(db: SQLiteDatabase): {
  currentVersion: number;
  latestVersion: number;
  pendingCount: number;
  isUpToDate: boolean;
} {
  const currentVersion = getCurrentVersion(db);
  const latestVersion = MIGRATIONS.length > 0 ? Math.max(...MIGRATIONS.map((m) => m.version)) : 0;
  const pendingCount = MIGRATIONS.filter((m) => m.version > currentVersion).length;

  return {
    currentVersion,
    latestVersion,
    pendingCount,
    isUpToDate: pendingCount === 0,
  };
}
