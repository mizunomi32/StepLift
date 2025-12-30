import { fireEvent, render } from '@testing-library/react-native';
import { WorkoutCalendar } from '../WorkoutCalendar';

// 2025-01-15にDateを固定
const MOCK_DATE = new Date('2025-01-15T12:00:00.000Z');

describe('WorkoutCalendar', () => {
  // 日付をモック
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(MOCK_DATE);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const mockWorkouts = [
    {
      id: 'workout1',
      startedAt: '2025-01-15T10:00:00Z',
      finishedAt: '2025-01-15T11:00:00Z',
      notes: null,
      createdAt: '2025-01-15T10:00:00Z',
      sets: [],
    },
    {
      id: 'workout2',
      startedAt: '2025-01-13T14:00:00Z',
      finishedAt: '2025-01-13T15:00:00Z',
      notes: null,
      createdAt: '2025-01-13T14:00:00Z',
      sets: [],
    },
  ];

  it('カレンダーが表示される', () => {
    const { getByText } = render(
      <WorkoutCalendar
        workouts={mockWorkouts}
        selectedDate={null}
        onSelectDate={jest.fn()}
        onMonthChange={jest.fn()}
      />
    );

    expect(getByText(/2025年1月/)).toBeTruthy();
  });

  it('ワークアウト実施日にドットが表示される', () => {
    const { getByTestId } = render(
      <WorkoutCalendar
        workouts={mockWorkouts}
        selectedDate={null}
        onSelectDate={jest.fn()}
        onMonthChange={jest.fn()}
      />
    );

    expect(getByTestId('workout-dot-15')).toBeTruthy();
    expect(getByTestId('workout-dot-13')).toBeTruthy();
  });

  it('日付をタップすると選択される', () => {
    const onSelectDate = jest.fn();
    const { getByTestId } = render(
      <WorkoutCalendar
        workouts={mockWorkouts}
        selectedDate={null}
        onSelectDate={onSelectDate}
        onMonthChange={jest.fn()}
      />
    );

    fireEvent.press(getByTestId('calendar-day-15'));

    expect(onSelectDate).toHaveBeenCalledWith('2025-01-15');
  });

  it('月移動ボタンが機能する', () => {
    const onMonthChange = jest.fn();
    const { getByTestId } = render(
      <WorkoutCalendar
        workouts={mockWorkouts}
        selectedDate={null}
        onSelectDate={jest.fn()}
        onMonthChange={onMonthChange}
      />
    );

    // 初期状態のonMonthChange呼び出しをリセット
    onMonthChange.mockClear();

    fireEvent.press(getByTestId('next-month-button'));
    expect(onMonthChange).toHaveBeenCalledWith('2025-02');

    fireEvent.press(getByTestId('prev-month-button'));
    expect(onMonthChange).toHaveBeenCalledWith('2025-01');
  });
});
