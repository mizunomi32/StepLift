import { render } from '@testing-library/react-native';
import { StepGoalRing } from '../StepGoalRing';

describe('StepGoalRing', () => {
  it('目標未達成の場合に正しく表示される', () => {
    const { getByTestId, getByText } = render(
      <StepGoalRing currentSteps={5000} goalSteps={10000} />
    );

    expect(getByTestId('step-goal-ring')).toBeTruthy();
    expect(getByText('5,000')).toBeTruthy();
    expect(getByText('50%')).toBeTruthy();
  });

  it('目標達成の場合に正しく表示される', () => {
    const { getByTestId, getByText } = render(
      <StepGoalRing currentSteps={10000} goalSteps={10000} />
    );

    expect(getByTestId('step-goal-ring')).toBeTruthy();
    expect(getByText('10,000')).toBeTruthy();
    expect(getByText('100%')).toBeTruthy();
  });

  it('目標を超過した場合に正しく表示される', () => {
    const { getByTestId, getByText } = render(
      <StepGoalRing currentSteps={12456} goalSteps={10000} />
    );

    expect(getByTestId('step-goal-ring')).toBeTruthy();
    expect(getByText('12,456')).toBeTruthy();
    expect(getByText('124%')).toBeTruthy();
  });

  it('歩数がゼロの場合に正しく表示される', () => {
    const { getByTestId, getByText } = render(<StepGoalRing currentSteps={0} goalSteps={10000} />);

    expect(getByTestId('step-goal-ring')).toBeTruthy();
    expect(getByText('0')).toBeTruthy();
    expect(getByText('0%')).toBeTruthy();
  });

  it('カスタムサイズを指定できる', () => {
    const { getByTestId } = render(
      <StepGoalRing currentSteps={5000} goalSteps={10000} size={300} />
    );

    const ring = getByTestId('step-goal-ring');
    expect(ring).toBeTruthy();
  });

  it('SVG円形プログレスが描画される', () => {
    const { getByTestId } = render(<StepGoalRing currentSteps={5000} goalSteps={10000} />);

    expect(getByTestId('step-goal-ring-background')).toBeTruthy();
    expect(getByTestId('step-goal-ring-progress')).toBeTruthy();
  });

  it('達成時に特別なスタイルが適用される', () => {
    const { getByTestId } = render(<StepGoalRing currentSteps={10000} goalSteps={10000} />);

    const container = getByTestId('step-goal-ring');
    expect(container).toBeTruthy();
  });
});
