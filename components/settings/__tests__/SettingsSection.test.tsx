import React from 'react';
import { render } from '@testing-library/react-native';
import { SettingsSection } from '../SettingsSection';
import { Text } from 'react-native';

describe('SettingsSection', () => {
  it('タイトルを表示する', () => {
    const { getByText } = render(
      <SettingsSection title="目標">
        <Text>Content</Text>
      </SettingsSection>
    );

    expect(getByText('目標')).toBeTruthy();
  });

  it('子要素を表示する', () => {
    const { getByText } = render(
      <SettingsSection title="目標">
        <Text>Test Content</Text>
      </SettingsSection>
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('複数の子要素を表示する', () => {
    const { getByText } = render(
      <SettingsSection title="表示">
        <Text>Item 1</Text>
        <Text>Item 2</Text>
        <Text>Item 3</Text>
      </SettingsSection>
    );

    expect(getByText('Item 1')).toBeTruthy();
    expect(getByText('Item 2')).toBeTruthy();
    expect(getByText('Item 3')).toBeTruthy();
  });

  it('testIDが設定されている', () => {
    const { getByTestId } = render(
      <SettingsSection title="目標">
        <Text>Content</Text>
      </SettingsSection>
    );

    expect(getByTestId('settings-section-目標')).toBeTruthy();
  });
});
