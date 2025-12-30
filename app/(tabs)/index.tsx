import React from 'react';
import { View, Text } from 'react-native';

export default function DashboardScreen() {
  return (
    <View className="flex-1 bg-black" testID="dashboard-screen">
      <Text className="text-white">ダッシュボード</Text>
    </View>
  );
}
