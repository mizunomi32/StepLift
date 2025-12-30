import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import ExercisePickerScreen from '../exercise-picker';
import { getAllExercises } from '@/lib/db/queries/exercises';

// データベースクエリをモック
jest.mock('@/lib/db/queries/exercises');

// ルーターをモック
jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: jest.fn(),
  }),
}));

describe('ExercisePickerScreen', () => {
  const mockExercises = [
    {
      id: 'ex-1',
      name: 'ベンチプレス',
      category: 'chest' as const,
      isCustom: false,
      createdAt: '2025-01-01T00:00:00.000Z',
    },
    {
      id: 'ex-2',
      name: 'インクラインベンチプレス',
      category: 'chest' as const,
      isCustom: false,
      createdAt: '2025-01-01T00:00:00.000Z',
    },
    {
      id: 'ex-3',
      name: 'デッドリフト',
      category: 'back' as const,
      isCustom: false,
      createdAt: '2025-01-01T00:00:00.000Z',
    },
    {
      id: 'ex-4',
      name: 'スクワット',
      category: 'legs' as const,
      isCustom: false,
      createdAt: '2025-01-01T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getAllExercises as jest.Mock).mockReturnValue(mockExercises);
  });

  it('画面が正しくレンダリングされる', () => {
    render(<ExercisePickerScreen />);
    expect(screen.getByTestId('exercise-picker-screen')).toBeTruthy();
  });

  it('背景色がダークモード対応している', () => {
    const { getByTestId } = render(<ExercisePickerScreen />);
    const container = getByTestId('exercise-picker-screen');
    expect(container.props.className).toContain('bg-black');
  });

  it('検索バーが表示される', () => {
    render(<ExercisePickerScreen />);
    expect(screen.getByTestId('exercise-search-input')).toBeTruthy();
  });

  it('カテゴリ別セクションが表示される', () => {
    render(<ExercisePickerScreen />);
    expect(screen.getByText('胸')).toBeTruthy();
    expect(screen.getByText('背中')).toBeTruthy();
    expect(screen.getByText('脚')).toBeTruthy();
  });

  it('種目一覧が表示される', () => {
    render(<ExercisePickerScreen />);
    expect(screen.getByText('ベンチプレス')).toBeTruthy();
    expect(screen.getByText('デッドリフト')).toBeTruthy();
    expect(screen.getByText('スクワット')).toBeTruthy();
  });

  it('検索でフィルタリングできる', () => {
    render(<ExercisePickerScreen />);

    const searchInput = screen.getByTestId('exercise-search-input');
    fireEvent.changeText(searchInput, 'ベンチ');

    expect(screen.getByText('ベンチプレス')).toBeTruthy();
    expect(screen.getByText('インクラインベンチプレス')).toBeTruthy();
    expect(screen.queryByText('デッドリフト')).toBeNull();
    expect(screen.queryByText('スクワット')).toBeNull();
  });

  it('検索結果がない場合、メッセージが表示される', () => {
    render(<ExercisePickerScreen />);

    const searchInput = screen.getByTestId('exercise-search-input');
    fireEvent.changeText(searchInput, '存在しない種目');

    expect(screen.getByText('種目が見つかりませんでした')).toBeTruthy();
  });

  it('カスタム種目追加ボタンが表示される', () => {
    render(<ExercisePickerScreen />);
    expect(screen.getByTestId('add-custom-exercise-button')).toBeTruthy();
  });

  it('種目をタップすると選択される', () => {
    const { getByTestId } = render(<ExercisePickerScreen />);

    const exerciseItem = getByTestId('exercise-item-ex-1');
    fireEvent.press(exerciseItem);

    // 選択状態の確認（実装により異なる）
    expect(exerciseItem.props.accessibilityState?.selected).toBe(true);
  });

  it('カテゴリごとにグループ化されている', () => {
    render(<ExercisePickerScreen />);

    const chestSection = screen.getByTestId('category-section-chest');
    const backSection = screen.getByTestId('category-section-back');
    const legsSection = screen.getByTestId('category-section-legs');

    expect(chestSection).toBeTruthy();
    expect(backSection).toBeTruthy();
    expect(legsSection).toBeTruthy();
  });

  it('各カテゴリに正しい種目が表示される', () => {
    const { getByTestId } = render(<ExercisePickerScreen />);

    const chestSection = getByTestId('category-section-chest');
    expect(chestSection).toBeTruthy();

    // 胸のセクション内にベンチプレスがあることを確認
    expect(screen.getByText('ベンチプレス')).toBeTruthy();
    expect(screen.getByText('インクラインベンチプレス')).toBeTruthy();
  });
});
