import { fireEvent, render, screen } from '@testing-library/react-native';
import type { ActiveWorkoutSet } from '@/types/workout';
import SetRow from '../SetRow';

describe('SetRow', () => {
  const mockSet: ActiveWorkoutSet = {
    id: 'set-1',
    exerciseId: 'ex-1',
    setNumber: 1,
    weightKg: 60,
    reps: 10,
    isCompleted: false,
  };

  const defaultProps = {
    set: mockSet,
    onUpdate: jest.fn(),
    onToggleComplete: jest.fn(),
    onRemove: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('セット行が正しくレンダリングされる', () => {
    render(<SetRow {...defaultProps} />);
    expect(screen.getByTestId('set-row-set-1')).toBeTruthy();
  });

  it('セット番号が表示される', () => {
    render(<SetRow {...defaultProps} />);
    expect(screen.getByText('1')).toBeTruthy();
  });

  it('重量入力欄が表示される', () => {
    render(<SetRow {...defaultProps} />);
    expect(screen.getByTestId('weight-input')).toBeTruthy();
  });

  it('回数入力欄が表示される', () => {
    render(<SetRow {...defaultProps} />);
    expect(screen.getByTestId('reps-input')).toBeTruthy();
  });

  it('完了チェックボックスが表示される', () => {
    render(<SetRow {...defaultProps} />);
    expect(screen.getByTestId('complete-checkbox')).toBeTruthy();
  });

  it('重量が初期値として表示される', () => {
    render(<SetRow {...defaultProps} />);
    const input = screen.getByTestId('weight-input');
    expect(input.props.value).toBe('60');
  });

  it('回数が初期値として表示される', () => {
    render(<SetRow {...defaultProps} />);
    const input = screen.getByTestId('reps-input');
    expect(input.props.value).toBe('10');
  });

  it('重量を変更するとonUpdateが呼ばれる', () => {
    const onUpdate = jest.fn();
    render(<SetRow {...defaultProps} onUpdate={onUpdate} />);

    const input = screen.getByTestId('weight-input');
    fireEvent.changeText(input, '70');

    expect(onUpdate).toHaveBeenCalledWith({ weightKg: 70 });
  });

  it('回数を変更するとonUpdateが呼ばれる', () => {
    const onUpdate = jest.fn();
    render(<SetRow {...defaultProps} onUpdate={onUpdate} />);

    const input = screen.getByTestId('reps-input');
    fireEvent.changeText(input, '12');

    expect(onUpdate).toHaveBeenCalledWith({ reps: 12 });
  });

  it('完了チェックボックスをタップするとonToggleCompleteが呼ばれる', () => {
    const onToggleComplete = jest.fn();
    render(<SetRow {...defaultProps} onToggleComplete={onToggleComplete} />);

    const checkbox = screen.getByTestId('complete-checkbox');
    fireEvent.press(checkbox);

    expect(onToggleComplete).toHaveBeenCalledTimes(1);
  });

  it('完了状態がチェックボックスに反映される', () => {
    const completedSet = { ...mockSet, isCompleted: true };
    render(<SetRow {...defaultProps} set={completedSet} />);

    const checkbox = screen.getByTestId('complete-checkbox');
    expect(checkbox.props.accessibilityState.checked).toBe(true);
  });

  it('未完了状態がチェックボックスに反映される', () => {
    render(<SetRow {...defaultProps} />);

    const checkbox = screen.getByTestId('complete-checkbox');
    expect(checkbox.props.accessibilityState.checked).toBe(false);
  });

  it('重量がnullの場合、空文字が表示される', () => {
    const setWithoutWeight = { ...mockSet, weightKg: null };
    render(<SetRow {...defaultProps} set={setWithoutWeight} />);

    const input = screen.getByTestId('weight-input');
    expect(input.props.value).toBe('');
  });

  it('回数がnullの場合、空文字が表示される', () => {
    const setWithoutReps = { ...mockSet, reps: null };
    render(<SetRow {...defaultProps} set={setWithoutReps} />);

    const input = screen.getByTestId('reps-input');
    expect(input.props.value).toBe('');
  });

  it('削除ボタンが表示される', () => {
    render(<SetRow {...defaultProps} />);
    expect(screen.getByTestId('remove-set-button')).toBeTruthy();
  });

  it('削除ボタンをタップするとonRemoveが呼ばれる', () => {
    const onRemove = jest.fn();
    render(<SetRow {...defaultProps} onRemove={onRemove} />);

    const button = screen.getByTestId('remove-set-button');
    fireEvent.press(button);

    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
