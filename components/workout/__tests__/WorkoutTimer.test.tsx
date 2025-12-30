import React from 'react';
import { render, screen, act } from '@testing-library/react-native';
import WorkoutTimer from '../WorkoutTimer';

describe('WorkoutTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('タイマーが正しくレンダリングされる', () => {
    const startedAt = new Date('2025-01-15T10:00:00.000Z').toISOString();
    render(<WorkoutTimer startedAt={startedAt} />);
    expect(screen.getByTestId('workout-timer')).toBeTruthy();
  });

  it('経過時間が00:00で開始される', () => {
    const now = new Date('2025-01-15T10:00:00.000Z');
    jest.setSystemTime(now);

    render(<WorkoutTimer startedAt={now.toISOString()} />);
    expect(screen.getByText('00:00')).toBeTruthy();
  });

  it('30秒経過後に00:30と表示される', () => {
    const startedAt = new Date('2025-01-15T10:00:00.000Z');
    jest.setSystemTime(startedAt);

    render(<WorkoutTimer startedAt={startedAt.toISOString()} />);

    act(() => {
      jest.setSystemTime(new Date(startedAt.getTime() + 30000)); // 30秒後
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('00:30')).toBeTruthy();
  });

  it('1分経過後に01:00と表示される', () => {
    const startedAt = new Date('2025-01-15T10:00:00.000Z');
    jest.setSystemTime(startedAt);

    render(<WorkoutTimer startedAt={startedAt.toISOString()} />);

    act(() => {
      jest.setSystemTime(new Date(startedAt.getTime() + 60000)); // 1分後
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('01:00')).toBeTruthy();
  });

  it('1時間経過後に01:00:00と表示される', () => {
    const startedAt = new Date('2025-01-15T10:00:00.000Z');
    jest.setSystemTime(startedAt);

    render(<WorkoutTimer startedAt={startedAt.toISOString()} />);

    act(() => {
      jest.setSystemTime(new Date(startedAt.getTime() + 3600000)); // 1時間後
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('01:00:00')).toBeTruthy();
  });

  it('1時間23分45秒経過後に01:23:45と表示される', () => {
    const startedAt = new Date('2025-01-15T10:00:00.000Z');
    jest.setSystemTime(startedAt);

    render(<WorkoutTimer startedAt={startedAt.toISOString()} />);

    act(() => {
      jest.setSystemTime(new Date(startedAt.getTime() + 5025000)); // 1時間23分45秒後
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('01:23:45')).toBeTruthy();
  });

  it('タイマーが1秒ごとに更新される', () => {
    const startedAt = new Date('2025-01-15T10:00:00.000Z');
    jest.setSystemTime(startedAt);

    render(<WorkoutTimer startedAt={startedAt.toISOString()} />);

    expect(screen.getByText('00:00')).toBeTruthy();

    act(() => {
      jest.setSystemTime(new Date(startedAt.getTime() + 1000));
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('00:01')).toBeTruthy();

    act(() => {
      jest.setSystemTime(new Date(startedAt.getTime() + 2000));
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('00:02')).toBeTruthy();
  });
});
