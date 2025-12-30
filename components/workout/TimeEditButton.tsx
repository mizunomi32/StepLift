import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/colors';

interface TimeEditButtonProps {
  /** 表示するラベル（例: "開始時刻", "終了時刻"） */
  label: string;
  /** 現在の時刻 */
  time: Date;
  /** 時刻が変更されたときのコールバック */
  onChange: (newTime: Date) => void;
  /** テストID（開始時刻: "edit-start-time-button", 終了時刻: "edit-end-time-button"） */
  testID?: string;
  /** DateTimePickerのテストID */
  pickerTestID?: string;
}

/**
 * 時刻編集ボタンコンポーネント
 * タップすると DateTimePicker を表示し、時刻を編集できる
 */
export function TimeEditButton({
  label,
  time,
  onChange,
  testID,
  pickerTestID,
}: TimeEditButtonProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const [showPicker, setShowPicker] = useState(false);

  const handlePress = () => {
    setShowPicker(true);
  };

  const handlePickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // iOSでは常に表示状態を保持、Androidではイベント後に閉じる
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
    }

    // キャンセル時
    if (event.type === 'dismissed') {
      setShowPicker(false);
    }
  };

  const handleDismiss = () => {
    setShowPicker(false);
  };

  const timeText = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;

  return (
    <View>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.button, { opacity: pressed ? 0.7 : 1 }]}
        testID={testID}
      >
        <View style={styles.content}>
          <Text style={[styles.label, { color: colors.subtext }]}>{label}</Text>
          <View style={styles.timeContainer}>
            <Text style={[styles.timeText, { color: colors.text }]}>{timeText}</Text>
            <IconSymbol name="pencil" size={16} color={colors.primary} />
          </View>
        </View>
      </Pressable>

      {showPicker && Platform.OS === 'ios' && (
        <View style={[styles.pickerContainer, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.pickerHeader}>
            <Pressable onPress={handleDismiss}>
              <Text style={[styles.doneButton, { color: colors.primary }]}>完了</Text>
            </Pressable>
          </View>
          <DateTimePicker
            testID={pickerTestID}
            value={time}
            mode="time"
            is24Hour={true}
            display="spinner"
            onChange={handlePickerChange}
            textColor={colors.text}
          />
        </View>
      )}

      {showPicker && Platform.OS === 'android' && (
        <DateTimePicker
          testID={pickerTestID}
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handlePickerChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  pickerContainer: {
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  doneButton: {
    fontSize: 16,
    fontWeight: '600',
  },
});
