import React from 'react';
import { render, screen } from '@testing-library/react-native';
import WorkoutScreen from '../workout';

describe('WorkoutScreen', () => {
  it('画面が正しくレンダリングされる', () => {
    render(<WorkoutScreen />);
    expect(screen.getByText('ワークアウト')).toBeTruthy();
  });

  it('背景色がダークモード対応している', () => {
    const { getByTestId } = render(<WorkoutScreen />);
    const container = getByTestId('workout-screen');
    expect(container.props.className).toContain('bg-black');
  });

  it('フルスクリーンで表示される', () => {
    const { getByTestId } = render(<WorkoutScreen />);
    const container = getByTestId('workout-screen');
    expect(container.props.className).toContain('flex-1');
  });
});
