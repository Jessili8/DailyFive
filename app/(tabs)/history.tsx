import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Platform,
  Modal,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { useEntries } from '@/hooks/useEntries';
import { format, parseISO, isValid } from 'date-fns';
import { spacing, fontFamily, fontSizes, borderRadius, shadow } from '@/constants/theme';
import EntryList from '@/components/EntryList';
import { useFocusEffect } from 'expo-router';
import { Calendar, ChevronDown } from 'lucide-react-native';

interface DailyEntry {
  date: string;
  entries: string[];
}

export default function HistoryScreen() {
  const { colors } = useTheme();
  const { getAllEntries } = useEntries();
  
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Use useFocusEffect to reload entries when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadEntries();
    }, [])
  );
  
  const loadEntries = async () => {
    setLoading(true);
    const allEntries = await getAllEntries();
    setEntries(allEntries);
    setLoading(false);
    
    if (allEntries.length > 0) {
      setSelectedDate(allEntries[0].date);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };
  
  const DatePickerModal = () => (
    <Modal
      visible={showDatePicker}
      transparent
      animationType="fade"
      onRequestClose={() => setShowDatePicker(false)}
    >
      <TouchableOpacity
        style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}
        onPress={() => setShowDatePicker(false)}
        activeOpacity={1}
      >
        <View 
          style={[
            styles.datePickerContainer,
            { backgroundColor: colors.card }
          ]}
        >
          <Text style={[styles.datePickerTitle, { color: colors.text }]}>
            Select Date
          </Text>
          <FlatList
            data={entries}
            keyExtractor={item => item.date}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.datePickerItem,
                  selectedDate === item.date && {
                    backgroundColor: colors.primary[500],
                  },
                ]}
                onPress={() => handleDateSelect(item.date)}
              >
                <Text
                  style={[
                    styles.datePickerItemText,
                    { color: selectedDate === item.date ? 'white' : colors.text },
                  ]}
                >
                  {format(parseISO(item.date), 'MMMM d, yyyy')}
                </Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.datePickerList}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
  
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary[500]} size="large" />
      </View>
    );
  }
  
  if (entries.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No entries yet. Start recording your daily highlights!
        </Text>
      </View>
    );
  }
  
  const selectedEntries = entries.find(entry => entry.date === selectedDate)?.entries || [];
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View 
        entering={FadeIn.duration(500)}
        style={styles.header}
      >
        <TouchableOpacity
          style={[
            styles.dateSelector,
            { backgroundColor: colors.card, borderColor: colors.border }
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <Calendar size={20} color={colors.primary[500]} />
          <Text style={[styles.selectedDate, { color: colors.text }]}>
            {selectedDate ? format(parseISO(selectedDate), 'MMMM d, yyyy') : 'Select Date'}
          </Text>
          <ChevronDown size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </Animated.View>
      
      <DatePickerModal />
      
      {selectedDate && (
        <Animated.View 
          entering={FadeIn.duration(500).delay(300)}
          style={styles.entriesContainer}
        >
          <EntryList entries={selectedEntries} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSizes.md,
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    marginBottom: spacing.xl,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    gap: spacing.sm,
  },
  selectedDate: {
    flex: 1,
    fontFamily: fontFamily.semibold,
    fontSize: fontSizes.md,
  },
  entriesContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  datePickerContainer: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadow.lg,
  },
  datePickerTitle: {
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.xl,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  datePickerList: {
    gap: spacing.xs,
  },
  datePickerItem: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  datePickerItemText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSizes.md,
  },
});