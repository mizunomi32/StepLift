import type { Exercise, ExerciseCategory } from '@/types/exercise';

export const PRESET_EXERCISES: Omit<Exercise, 'id' | 'createdAt'>[] = [
  // 胸
  { name: 'ベンチプレス', category: 'chest', isCustom: false },
  { name: 'インクラインベンチプレス', category: 'chest', isCustom: false },
  { name: 'ダンベルフライ', category: 'chest', isCustom: false },
  { name: 'チェストプレス', category: 'chest', isCustom: false },
  { name: '腕立て伏せ', category: 'chest', isCustom: false },

  // 背中
  { name: 'デッドリフト', category: 'back', isCustom: false },
  { name: 'ラットプルダウン', category: 'back', isCustom: false },
  { name: 'ベントオーバーロウ', category: 'back', isCustom: false },
  { name: 'シーテッドロウ', category: 'back', isCustom: false },
  { name: '懸垂', category: 'back', isCustom: false },

  // 肩
  { name: 'ショルダープレス', category: 'shoulders', isCustom: false },
  { name: 'サイドレイズ', category: 'shoulders', isCustom: false },
  { name: 'フロントレイズ', category: 'shoulders', isCustom: false },
  { name: 'リアデルトフライ', category: 'shoulders', isCustom: false },

  // 腕
  { name: 'バーベルカール', category: 'arms', isCustom: false },
  { name: 'ダンベルカール', category: 'arms', isCustom: false },
  { name: 'トライセプスプッシュダウン', category: 'arms', isCustom: false },
  { name: 'スカルクラッシャー', category: 'arms', isCustom: false },

  // 脚
  { name: 'スクワット', category: 'legs', isCustom: false },
  { name: 'レッグプレス', category: 'legs', isCustom: false },
  { name: 'レッグカール', category: 'legs', isCustom: false },
  { name: 'レッグエクステンション', category: 'legs', isCustom: false },
  { name: 'カーフレイズ', category: 'legs', isCustom: false },
  { name: 'ランジ', category: 'legs', isCustom: false },

  // 体幹
  { name: 'プランク', category: 'core', isCustom: false },
  { name: 'クランチ', category: 'core', isCustom: false },
  { name: 'レッグレイズ', category: 'core', isCustom: false },
  { name: 'アブローラー', category: 'core', isCustom: false },

  // 有酸素
  { name: 'トレッドミル', category: 'cardio', isCustom: false },
  { name: 'エアロバイク', category: 'cardio', isCustom: false },
  { name: 'ローイングマシン', category: 'cardio', isCustom: false },
];

// カテゴリごとの種目数
export const EXERCISE_COUNTS_BY_CATEGORY = PRESET_EXERCISES.reduce(
  (acc, exercise) => {
    acc[exercise.category] = (acc[exercise.category] || 0) + 1;
    return acc;
  },
  {} as Record<ExerciseCategory, number>
);
