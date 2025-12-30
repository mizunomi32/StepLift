/**
 * データベース初期化テストスクリプト
 *
 * このファイルは開発時のテスト用です。
 * アプリから手動でimportして実行することで、データベースの動作を確認できます。
 */

import { getDatabase, initializeDatabase } from './index';
import { getMigrationStatus } from './migrations';
import { getAllExercises, getPresetExerciseCount } from './queries/exercises';
import { getStepGoal } from './queries/steps';

export function testDatabaseInitialization() {
  console.log('=== データベース初期化テスト開始 ===');

  try {
    // 1. データベース初期化
    console.log('\n[テスト1] データベースを初期化中...');
    initializeDatabase();
    console.log('✓ データベース初期化成功');

    // 2. マイグレーション状態を確認
    console.log('\n[テスト2] マイグレーション状態を確認中...');
    const db = getDatabase();
    const migrationStatus = getMigrationStatus(db);
    console.log('マイグレーション状態:', migrationStatus);
    if (!migrationStatus.isUpToDate) {
      throw new Error('マイグレーションが最新ではありません');
    }
    console.log('✓ マイグレーション状態確認成功');

    // 3. プリセット種目が正しく投入されているか確認
    console.log('\n[テスト3] プリセット種目を確認中...');
    const presetCount = getPresetExerciseCount();
    console.log(`プリセット種目数: ${presetCount}`);
    if (presetCount === 0) {
      throw new Error('プリセット種目が投入されていません');
    }
    console.log('✓ プリセット種目確認成功');

    // 4. すべての種目を取得
    console.log('\n[テスト4] すべての種目を取得中...');
    const exercises = getAllExercises();
    console.log(`取得した種目数: ${exercises.length}`);
    if (exercises.length !== presetCount) {
      throw new Error('種目数が一致しません');
    }
    console.log('種目サンプル:');
    console.log(exercises.slice(0, 3));
    console.log('✓ 種目取得成功');

    // 5. デフォルト歩数目標を確認
    console.log('\n[テスト5] 歩数目標を確認中...');
    const stepGoal = getStepGoal();
    if (!stepGoal) {
      throw new Error('歩数目標が設定されていません');
    }
    console.log('歩数目標:', stepGoal);
    if (stepGoal.dailySteps !== 10000) {
      throw new Error('デフォルト歩数目標が正しくありません');
    }
    console.log('✓ 歩数目標確認成功');

    console.log('\n=== すべてのテストが成功しました ===');
    return true;
  } catch (error) {
    console.error('\n=== テスト失敗 ===');
    console.error('エラー:', error);
    return false;
  }
}
