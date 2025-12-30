import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

interface WorkoutTimerProps {
  startedAt: string;
}

export default function WorkoutTimer({ startedAt }: WorkoutTimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const updateElapsed = () => {
      const now = new Date().getTime();
      const started = new Date(startedAt).getTime();
      const diff = Math.floor((now - started) / 1000);
      setElapsedSeconds(diff);
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);

    return () => clearInterval(interval);
  }, [startedAt]);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View testID="workout-timer" className="items-center">
      <Text className="text-white text-4xl font-bold">{formatTime(elapsedSeconds)}</Text>
    </View>
  );
}
