import React from 'react';
import { render, screen } from '@testing-library/react-native';
import StepsScreen from '../steps';

describe('StepsScreen', () => {
  it('画面が正しくレンダリングされる', () => {
    render(<StepsScreen />);
    expect(screen.getByText('歩数')).toBeTruthy();
  });

  it('背景色がダークモード対応している', () => {
    const { getByTestId } = render(<StepsScreen />);
    const container = getByTestId('steps-screen');
    expect(container.props.className).toContain('bg-black');
  });

  it('フルスクリーンで表示される', () => {
    const { getByTestId } = render(<StepsScreen />);
    const container = getByTestId('steps-screen');
    expect(container.props.className).toContain('flex-1');
  });
});
