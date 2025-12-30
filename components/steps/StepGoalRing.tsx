import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface StepGoalRingProps {
  currentSteps: number;
  goalSteps: number;
  size?: number;
}

export function StepGoalRing({
  currentSteps,
  goalSteps,
  size = 240,
}: StepGoalRingProps) {
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((currentSteps / goalSteps) * 100, 200);
  const isAchieved = currentSteps >= goalSteps;

  // アニメーション用の値
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(percentage / 100, {
      damping: 15,
      stiffness: 80,
    });
  }, [percentage]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - progress.value);
    return {
      strokeDashoffset,
    };
  });

  const formatNumber = (num: number) => {
    return num.toLocaleString('ja-JP');
  };

  return (
    <View
      testID="step-goal-ring"
      className="items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Svg width={size} height={size}>
        {/* 背景の円 */}
        <Circle
          testID="step-goal-ring-background"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#333"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* プログレスの円 */}
        <AnimatedCircle
          testID="step-goal-ring-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isAchieved ? '#10b981' : '#3b82f6'}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
          animatedProps={animatedProps}
        />
      </Svg>

      {/* 中央のテキスト */}
      <View className="absolute items-center justify-center">
        <Text className="text-5xl font-bold text-white">
          {formatNumber(currentSteps)}
        </Text>
        <Text className="text-sm text-gray-400 mt-1">歩</Text>
        <Text
          className={`text-2xl font-semibold mt-2 ${
            isAchieved ? 'text-green-500' : 'text-blue-500'
          }`}
        >
          {Math.round(percentage)}%
        </Text>
      </View>
    </View>
  );
}
