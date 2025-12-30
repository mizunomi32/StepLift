import React from 'react';
import { render, screen } from '@testing-library/react-native';
import DashboardScreen from '../index';

describe('DashboardScreen', () => {
  it('画面が正しくレンダリングされる', () => {
    render(<DashboardScreen />);
    expect(screen.getByText('ダッシュボード')).toBeTruthy();
  });

  it('背景色がダークモード対応している', () => {
    const { getByTestId } = render(<DashboardScreen />);
    const container = getByTestId('dashboard-screen');
    expect(container.props.className).toContain('bg-black');
  });

  it('フルスクリーンで表示される', () => {
    const { getByTestId } = render(<DashboardScreen />);
    const container = getByTestId('dashboard-screen');
    expect(container.props.className).toContain('flex-1');
  });
});
