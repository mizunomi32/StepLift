import React from 'react';
import { View, Text } from 'react-native';

export default function StepsScreen() {
  return (
    <View className="flex-1 bg-black" testID="steps-screen">
      <Text className="text-white">歩数</Text>
    </View>
  );
}
