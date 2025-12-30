import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { WorkoutCalendar } from '../WorkoutCalendar';

describe('WorkoutCalendar', () => {
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

    expect(getByText(/2025年/)).toBeTruthy();
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

    fireEvent.press(getByTestId('next-month-button'));
    expect(onMonthChange).toHaveBeenCalledWith('2025-02');

    fireEvent.press(getByTestId('prev-month-button'));
    expect(onMonthChange).toHaveBeenCalledWith('2024-12');
  });
});
