import { Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';

interface StepStatsProps {
  distanceKm: number | null;
  calories: number | null;
}

export function StepStats({ distanceKm, calories }: StepStatsProps) {
  const formatDistance = (km: number | null) => {
    if (km === null) return '-';
    return km.toFixed(1);
  };

  const formatCalories = (cal: number | null) => {
    if (cal === null) return '-';
    return Math.round(cal).toString();
  };

  return (
    <Card testID="step-stats" className="p-4">
      <View className="flex-row justify-around">
        {/* 距離 */}
        <View className="flex-1 items-center">
          <Text testID="distance-icon" className="text-2xl mb-1">
            📏
          </Text>
          <Text className="text-sm text-gray-400">距離</Text>
          <Text className="text-xl font-semibold text-white mt-1">
            {formatDistance(distanceKm)} km
          </Text>
        </View>

        {/* 区切り線 */}
        <View className="w-px bg-gray-700 mx-4" />

        {/* カロリー */}
        <View className="flex-1 items-center">
          <Text testID="calories-icon" className="text-2xl mb-1">
            🔥
          </Text>
          <Text className="text-sm text-gray-400">カロリー</Text>
          <Text className="text-xl font-semibold text-white mt-1">
            {formatCalories(calories)} kcal
          </Text>
        </View>
      </View>
    </Card>
  );
}
