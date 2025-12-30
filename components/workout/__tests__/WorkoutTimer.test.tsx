import { act, render, screen } from '@testing-library/react-native';
import WorkoutTimer from '../WorkoutTimer';

describe('WorkoutTimer', () => {
  const START_DATE = new Date('2025-01-15T10:00:00.000Z');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(START_DATE);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('タイマーが正しくレンダリングされる', () => {
    render(<WorkoutTimer startedAt={START_DATE.toISOString()} />);
    expect(screen.getByTestId('workout-timer')).toBeTruthy();
  });

  it('経過時間が00:00で開始される', () => {
    render(<WorkoutTimer startedAt={START_DATE.toISOString()} />);
    expect(screen.getByText('00:00')).toBeTruthy();
  });

  it('30秒経過後に00:30と表示される', () => {
    render(<WorkoutTimer startedAt={START_DATE.toISOString()} />);

    act(() => {
      jest.advanceTimersByTime(30000); // 30秒進める
    });

    expect(screen.getByText('00:30')).toBeTruthy();
  });

  it('1分経過後に01:00と表示される', () => {
    render(<WorkoutTimer startedAt={START_DATE.toISOString()} />);

    act(() => {
      jest.advanceTimersByTime(60000); // 1分進める
    });

    expect(screen.getByText('01:00')).toBeTruthy();
  });

  it('1時間経過後に01:00:00と表示される', () => {
    render(<WorkoutTimer startedAt={START_DATE.toISOString()} />);

    act(() => {
      jest.advanceTimersByTime(3600000); // 1時間進める
    });

    expect(screen.getByText('01:00:00')).toBeTruthy();
  });

  it('1時間23分45秒経過後に01:23:45と表示される', () => {
    render(<WorkoutTimer startedAt={START_DATE.toISOString()} />);

    act(() => {
      jest.advanceTimersByTime(5025000); // 1時間23分45秒進める
    });

    expect(screen.getByText('01:23:45')).toBeTruthy();
  });

  it('タイマーが1秒ごとに更新される', () => {
    render(<WorkoutTimer startedAt={START_DATE.toISOString()} />);

    expect(screen.getByText('00:00')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(1000); // 1秒進める
    });

    expect(screen.getByText('00:01')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(1000); // さらに1秒進める
    });

    expect(screen.getByText('00:02')).toBeTruthy();
  });
});
