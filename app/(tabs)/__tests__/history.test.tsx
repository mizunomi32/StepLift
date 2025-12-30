import React from 'react';
import { render, screen } from '@testing-library/react-native';
import HistoryScreen from '../history';

describe('HistoryScreen', () => {
  it('画面が正しくレンダリングされる', () => {
    render(<HistoryScreen />);
    expect(screen.getByText('履歴')).toBeTruthy();
  });

  it('背景色がダークモード対応している', () => {
    const { getByTestId } = render(<HistoryScreen />);
    const container = getByTestId('history-screen');
    expect(container.props.className).toContain('bg-black');
  });

  it('フルスクリーンで表示される', () => {
    const { getByTestId } = render(<HistoryScreen />);
    const container = getByTestId('history-screen');
    expect(container.props.className).toContain('flex-1');
  });
});
