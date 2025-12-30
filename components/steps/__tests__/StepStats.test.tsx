import { render } from '@testing-library/react-native';
import { StepStats } from '../StepStats';

describe('StepStats', () => {
  it('距離とカロリーの両方が表示される', () => {
    const { getByTestId, getByText } = render(<StepStats distanceKm={8.7} calories={423} />);

    expect(getByTestId('step-stats')).toBeTruthy();
    expect(getByText('8.7 km')).toBeTruthy();
    expect(getByText('423 kcal')).toBeTruthy();
  });

  it('距離がnullの場合は - と表示される', () => {
    const { getByTestId, getByText } = render(<StepStats distanceKm={null} calories={423} />);

    expect(getByTestId('step-stats')).toBeTruthy();
    expect(getByText('- km')).toBeTruthy();
    expect(getByText('423 kcal')).toBeTruthy();
  });

  it('カロリーがnullの場合は - と表示される', () => {
    const { getByTestId, getByText } = render(<StepStats distanceKm={8.7} calories={null} />);

    expect(getByTestId('step-stats')).toBeTruthy();
    expect(getByText('8.7 km')).toBeTruthy();
    expect(getByText('- kcal')).toBeTruthy();
  });

  it('両方nullの場合に正しく表示される', () => {
    const { getByTestId, getByText } = render(<StepStats distanceKm={null} calories={null} />);

    expect(getByTestId('step-stats')).toBeTruthy();
    expect(getByText('- km')).toBeTruthy();
    expect(getByText('- kcal')).toBeTruthy();
  });

  it('距離が小数点第1位まで表示される', () => {
    const { getByText } = render(<StepStats distanceKm={8.734} calories={423} />);

    expect(getByText('8.7 km')).toBeTruthy();
  });

  it('カロリーが整数で表示される', () => {
    // 423.7 -> Math.round = 424
    const { getByText } = render(<StepStats distanceKm={8.7} calories={423.7} />);

    // テキストが複数ノードに分かれているため、正規表現でマッチ
    expect(getByText(/424/)).toBeTruthy();
  });

  it('アイコンが表示される', () => {
    const { getByTestId } = render(<StepStats distanceKm={8.7} calories={423} />);

    expect(getByTestId('distance-icon')).toBeTruthy();
    expect(getByTestId('calories-icon')).toBeTruthy();
  });
});
