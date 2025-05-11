import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { useEntries } from '@/hooks/useEntries';
import { format, parseISO } from 'date-fns';
import { spacing, fontFamily, fontSizes, borderRadius, shadow } from '@/constants/theme';
import EntryList from '@/components/EntryList';
import { useFocusEffect } from 'expo-router';

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
  
  const renderDateItem = ({ item }: { item: DailyEntry }) => {
    const isSelected = selectedDate === item.date;
    const formattedDate = format(parseISO(item.date), 'MMM d');
    
    return (
      <TouchableOpacity
        style={[
          styles.dateItem,
          { 
            backgroundColor: isSelected ? colors.primary[500] : colors.surface,
            borderColor: isSelected ? colors.primary[500] : colors.border,
          },
          shadow.sm
        ]}
        onPress={() => setSelectedDate(item.date)}
      >
        <Text 
          style={[
            styles.dateText, 
            { color: isSelected ? 'white' : colors.text }
          ]}
        >
          {formattedDate}
        </Text>
      </TouchableOpacity>
    );
  };
  
  const selectedEntries = entries.find(entry => entry.date === selectedDate)?.entries || [];
  
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
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View 
        entering={FadeIn.duration(500)}
        style={styles.datesContainer}
      >
        <FlatList
          data={entries}
          renderItem={renderDateItem}
          keyExtractor={item => item.date}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.datesList}
        />
      </Animated.View>
      
      {selectedDate && (
        <Animated.View 
          entering={FadeIn.duration(500).delay(300)}
          style={styles.entriesContainer}
        >
          <Text style={[styles.selectedDate, { color: colors.text }]}>
            {format(parseISO(selectedDate), 'MMMM d, yyyy')}
          </Text>
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
  datesContainer: {
    marginBottom: spacing.lg,
  },
  datesList: {
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  dateItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  dateText: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSizes.sm,
  },
  entriesContainer: {
    flex: 1,
  },
  selectedDate: {
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.lg,
    marginBottom: spacing.md,
  },
});