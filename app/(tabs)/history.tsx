import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Platform,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { useEntries } from '@/hooks/useEntries';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { spacing, fontFamily, fontSizes, borderRadius, shadow } from '@/constants/theme';
import EntryList from '@/components/EntryList';
import { useFocusEffect } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
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
      setCurrentMonth(parseISO(allEntries[0].date));
    }
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const hasEntryForDate = (date: Date) => {
    return entries.some(entry => 
      isSameDay(parseISO(entry.date), date)
    );
  };

  const renderCalendarDay = (date: Date) => {
    const isSelected = selectedDate && isSameDay(parseISO(selectedDate), date);
    const hasEntry = hasEntryForDate(date);
    const isCurrentMonth = isSameMonth(date, currentMonth);

    return (
      <TouchableOpacity
        key={date.toISOString()}
        style={[
          styles.calendarDay,
          isSelected && { backgroundColor: colors.primary[500] },
          !isCurrentMonth && { opacity: 0.3 },
        ]}
        onPress={() => {
          if (hasEntry) {
            setSelectedDate(format(date, 'yyyy-MM-dd'));
          }
        }}
        disabled={!hasEntry}
      >
        <Text
          style={[
            styles.calendarDayText,
            { color: isSelected ? 'white' : colors.text },
            !hasEntry && { color: colors.textSecondary },
          ]}
        >
          {format(date, 'd')}
        </Text>
        {hasEntry && !isSelected && (
          <View 
            style={[
              styles.entryDot,
              { backgroundColor: colors.primary[500] }
            ]} 
          />
        )}
      </TouchableOpacity>
    );
  };
  
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
  const days = getDaysInMonth();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View 
        entering={FadeIn.duration(500)}
        style={styles.calendarContainer}
      >
        <View style={styles.calendarHeader}>
          <TouchableOpacity
            onPress={() => setCurrentMonth(date => new Date(date.setMonth(date.getMonth() - 1)))}
            style={[styles.monthButton, { backgroundColor: colors.surface }]}
          >
            <ChevronLeft size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <Text style={[styles.monthText, { color: colors.text }]}>
            {format(currentMonth, 'MMMM yyyy')}
          </Text>
          
          <TouchableOpacity
            onPress={() => setCurrentMonth(date => new Date(date.setMonth(date.getMonth() + 1)))}
            style={[styles.monthButton, { backgroundColor: colors.surface }]}
          >
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.calendar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.weekDays}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Text 
                key={day} 
                style={[styles.weekDayText, { color: colors.textSecondary }]}
              >
                {day}
              </Text>
            ))}
          </View>
          
          <View style={styles.calendarDays}>
            {days.map(date => renderCalendarDay(date))}
          </View>
        </View>
      </Animated.View>
      
      {selectedDate && (
        <Animated.View 
          entering={FadeIn.duration(500).delay(300)}
          style={styles.entriesContainer}
        >
          <Text style={[styles.selectedDateText, { color: colors.text }]}>
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
  calendarContainer: {
    marginBottom: spacing.xl,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  monthButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.lg,
  },
  calendar: {
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    ...shadow.sm,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  weekDayText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSizes.sm,
    width: 40,
    textAlign: 'center',
  },
  calendarDays: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  calendarDay: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xs,
  },
  calendarDayText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSizes.md,
  },
  entryDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: 6,
  },
  entriesContainer: {
    flex: 1,
  },
  selectedDateText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.lg,
    marginBottom: spacing.md,
  },
});