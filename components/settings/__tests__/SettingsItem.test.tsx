import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SettingsItem } from '../SettingsItem';
import { Text } from 'react-native';

describe('SettingsItem', () => {
  it('ラベルを表示する', () => {
    const { getByText } = render(
      <SettingsItem label="1日の歩数目標" />
    );

    expect(getByText('1日の歩数目標')).toBeTruthy();
  });

  it('値を表示する', () => {
    const { getByText } = render(
      <SettingsItem label="1日の歩数目標" value="10,000" />
    );

    expect(getByText('10,000')).toBeTruthy();
  });

  it('タップイベントを処理する', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <SettingsItem label="テーマ" value="システム" onPress={onPress} />
    );

    fireEvent.press(getByTestId('settings-item-テーマ'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('右側の要素を表示する', () => {
    const { getByText } = render(
      <SettingsItem
        label="テーマ"
        rightElement={<Text>カスタム要素</Text>}
      />
    );

    expect(getByText('カスタム要素')).toBeTruthy();
  });

  it('値とrightElementの両方は表示しない', () => {
    const { getByText, queryByText } = render(
      <SettingsItem
        label="テーマ"
        value="システム"
        rightElement={<Text>カスタム要素</Text>}
      />
    );

    // rightElementが優先される
    expect(getByText('カスタム要素')).toBeTruthy();
    expect(queryByText('システム')).toBeNull();
  });

  it('onPressが無い場合はタップできない', () => {
    const { getByTestId } = render(
      <SettingsItem label="バージョン" value="1.0.0" />
    );

    const item = getByTestId('settings-item-バージョン');
    expect(item.props.accessibilityState.disabled).toBe(true);
  });

  it('testIDが設定されている', () => {
    const { getByTestId } = render(
      <SettingsItem label="テーマ" value="システム" />
    );

    expect(getByTestId('settings-item-テーマ')).toBeTruthy();
  });
});
