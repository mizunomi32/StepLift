import React from 'react';
import { View, Text } from 'react-native';

export default function WorkoutScreen() {
  return (
    <View className="flex-1 bg-black" testID="workout-screen">
      <Text className="text-white">ワークアウト</Text>
    </View>
  );
}
