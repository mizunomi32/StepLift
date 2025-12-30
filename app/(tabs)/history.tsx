import React from 'react';
import { View, Text } from 'react-native';

export default function HistoryScreen() {
  return (
    <View className="flex-1 bg-black" testID="history-screen">
      <Text className="text-white">履歴</Text>
    </View>
  );
}
