import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { useHistoryStore } from '@/lib/stores/history-store';
import HistoryScreen from '../history';

// モック
jest.mock('@/lib/stores/history-store');
jest.mock('expo-router');

describe('HistoryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('画面が正しくレンダリングされる', () => {
    (useHistoryStore as unknown as jest.Mock).mockReturnValue({
      selectedMonth: '2025-01',
      selectedDate: null,
      workouts: [],
      setSelectedMonth: jest.fn(),
      setSelectedDate: jest.fn(),
      loadWorkouts: jest.fn(),
    });

    const { getByText } = render(<HistoryScreen />);
    expect(getByText('履歴')).toBeTruthy();
  });

  it('カレンダーが表示される', () => {
    (useHistoryStore as unknown as jest.Mock).mockReturnValue({
      selectedMonth: '2025-01',
      selectedDate: null,
      workouts: [],
      setSelectedMonth: jest.fn(),
      setSelectedDate: jest.fn(),
      loadWorkouts: jest.fn(),
    });

    const { getByTestId } = render(<HistoryScreen />);
    expect(getByTestId('workout-calendar')).toBeTruthy();
  });

  it('選択日の履歴が表示される', async () => {
    const mockWorkouts = [
      {
        id: 'workout1',
        startedAt: '2025-01-15T10:00:00Z',
        finishedAt: '2025-01-15T11:00:00Z',
        notes: null,
        createdAt: '2025-01-15T10:00:00Z',
        sets: [
          {
            id: 'set1',
            workoutId: 'workout1',
            exerciseId: 'exercise1',
            setNumber: 1,
            weightKg: 60,
            reps: 10,
            notes: null,
            createdAt: '2025-01-15T10:00:00Z',
            exercise: {
              id: 'exercise1',
              name: 'ベンチプレス',
              category: 'chest' as const,
              isCustom: false,
              createdAt: '2025-01-01T00:00:00Z',
            },
          },
        ],
      },
    ];

    (useHistoryStore as unknown as jest.Mock).mockReturnValue({
      selectedMonth: '2025-01',
      selectedDate: '2025-01-15',
      workouts: mockWorkouts,
      setSelectedMonth: jest.fn(),
      setSelectedDate: jest.fn(),
      loadWorkouts: jest.fn(),
    });

    const { getByText } = render(<HistoryScreen />);

    await waitFor(() => {
      expect(getByText(/ベンチプレス/)).toBeTruthy();
    });
  });

  it('履歴アイテムをタップすると詳細画面に遷移する', async () => {
    const mockWorkouts = [
      {
        id: 'workout1',
        startedAt: '2025-01-15T10:00:00Z',
        finishedAt: '2025-01-15T11:00:00Z',
        notes: null,
        createdAt: '2025-01-15T10:00:00Z',
        sets: [],
      },
    ];

    (useHistoryStore as unknown as jest.Mock).mockReturnValue({
      selectedMonth: '2025-01',
      selectedDate: '2025-01-15',
      workouts: mockWorkouts,
      setSelectedMonth: jest.fn(),
      setSelectedDate: jest.fn(),
      loadWorkouts: jest.fn(),
    });

    const { getByTestId } = render(<HistoryScreen />);

    fireEvent.press(getByTestId('workout-history-item'));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith('/workout/workout1');
    });
  });

  it('ワークアウトがない場合は空の状態が表示される', () => {
    (useHistoryStore as unknown as jest.Mock).mockReturnValue({
      selectedMonth: '2025-01',
      selectedDate: '2025-01-15',
      workouts: [],
      setSelectedMonth: jest.fn(),
      setSelectedDate: jest.fn(),
      loadWorkouts: jest.fn(),
    });

    const { getByText } = render(<HistoryScreen />);

    expect(getByText('記録がありません')).toBeTruthy();
  });
});
