import { fireEvent, render, screen } from '@testing-library/react-native';
import type { Exercise } from '@/types/exercise';
import type { ActiveWorkoutSet } from '@/types/workout';
import ExerciseCard from '../ExerciseCard';

describe('ExerciseCard', () => {
  const mockExercise: Exercise = {
    id: 'ex-1',
    name: 'ベンチプレス',
    category: 'chest',
    isCustom: false,
    createdAt: '2025-01-01T00:00:00.000Z',
  };

  const mockSets: ActiveWorkoutSet[] = [
    {
      id: 'set-1',
      exerciseId: 'ex-1',
      setNumber: 1,
      weightKg: 60,
      reps: 10,
      isCompleted: true,
    },
    {
      id: 'set-2',
      exerciseId: 'ex-1',
      setNumber: 2,
      weightKg: 60,
      reps: 10,
      isCompleted: false,
    },
  ];

  const defaultProps = {
    exercise: mockExercise,
    sets: mockSets,
    onAddSet: jest.fn(),
    onUpdateSet: jest.fn(),
    onRemoveSet: jest.fn(),
    onToggleComplete: jest.fn(),
    onRemoveExercise: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('種目カードが正しくレンダリングされる', () => {
    render(<ExerciseCard {...defaultProps} />);
    expect(screen.getByTestId('exercise-card-ex-1')).toBeTruthy();
  });

  it('種目名が表示される', () => {
    render(<ExerciseCard {...defaultProps} />);
    expect(screen.getByText('ベンチプレス')).toBeTruthy();
  });

  it('セット一覧が表示される', () => {
    render(<ExerciseCard {...defaultProps} />);
    expect(screen.getByTestId('set-row-set-1')).toBeTruthy();
    expect(screen.getByTestId('set-row-set-2')).toBeTruthy();
  });

  it('セット追加ボタンが表示される', () => {
    render(<ExerciseCard {...defaultProps} />);
    expect(screen.getByTestId('add-set-button')).toBeTruthy();
  });

  it('削除ボタンが表示される', () => {
    render(<ExerciseCard {...defaultProps} />);
    expect(screen.getByTestId('remove-exercise-button')).toBeTruthy();
  });

  it('セット追加ボタンをタップするとonAddSetが呼ばれる', () => {
    const onAddSet = jest.fn();
    render(<ExerciseCard {...defaultProps} onAddSet={onAddSet} />);

    const button = screen.getByTestId('add-set-button');
    fireEvent.press(button);

    expect(onAddSet).toHaveBeenCalledTimes(1);
  });

  it('削除ボタンをタップするとonRemoveExerciseが呼ばれる', () => {
    const onRemoveExercise = jest.fn();
    render(<ExerciseCard {...defaultProps} onRemoveExercise={onRemoveExercise} />);

    const button = screen.getByTestId('remove-exercise-button');
    fireEvent.press(button);

    expect(onRemoveExercise).toHaveBeenCalledTimes(1);
  });

  it('セットが空の場合、空のメッセージが表示される', () => {
    render(<ExerciseCard {...defaultProps} sets={[]} />);
    expect(screen.getByText('セットを追加してください')).toBeTruthy();
  });

  it('セットヘッダーが表示される', () => {
    render(<ExerciseCard {...defaultProps} />);
    expect(screen.getByText('Set')).toBeTruthy();
    expect(screen.getByText('重量')).toBeTruthy();
    expect(screen.getByText('回数')).toBeTruthy();
  });
});
