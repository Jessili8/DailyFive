import React, { useEffect, useState } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Text,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import Animated, { 
  FadeInUp, 
  FadeInDown,
  Layout 
} from 'react-native-reanimated';
import { format, subDays } from 'date-fns';
import { useTheme } from '@/context/ThemeContext';
import EntryInput from '@/components/EntryInput';
import ProgressIndicator from '@/components/ProgressIndicator';
import SaveButton from '@/components/SaveButton';
import { useEntries } from '@/hooks/useEntries';
import { spacing, fontFamily, fontSizes, borderRadius } from '@/constants/theme';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

export default function TodayScreen() {
  const { colors } = useTheme();
  const { saveEntries, getEntriesByDate } = useEntries();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState<string[]>(['', '', '', '', '']);
  const [isSaving, setIsSaving] = useState(false);
  const [saveComplete, setSaveComplete] = useState(false);
  
  const completedCount = entries.filter(entry => entry.trim().length > 0).length;
  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  
  useEffect(() => {
    loadEntries();
  }, [selectedDate]);
  
  const loadEntries = async () => {
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const savedEntries = await getEntriesByDate(dateString);
    if (savedEntries) {
      setEntries(savedEntries);
    } else {
      setEntries(['', '', '', '', '']);
    }
  };

  const handleChangeText = (index: number, text: string) => {
    const newEntries = [...entries];
    newEntries[index] = text;
    setEntries(newEntries);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    await saveEntries(entries, dateString);
    setIsSaving(false);
    setSaveComplete(true);
    
    setTimeout(() => {
      setSaveComplete(false);
    }, 2000);
  };

  const changeDate = (days: number) => {
    setSelectedDate(current => subDays(current, days));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View 
            entering={FadeInDown.duration(600).delay(100)}
            style={styles.header}
          >
            <View style={styles.dateSelector}>
              <TouchableOpacity 
                onPress={() => changeDate(-1)}
                style={[styles.dateButton, { backgroundColor: colors.surface }]}
              >
                <ChevronLeft size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              
              <Text style={[styles.date, { color: colors.textSecondary }]}>
                {format(selectedDate, 'MMMM d, yyyy')}
                {isToday && ' (Today)'}
              </Text>
              
              <TouchableOpacity 
                onPress={() => changeDate(1)}
                style={[styles.dateButton, { backgroundColor: colors.surface }]}
                disabled={isToday}
              >
                <ChevronRight 
                  size={20} 
                  color={isToday ? colors.disabled : colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.title, { color: colors.text }]}>
              What made this day great?
            </Text>
            <ProgressIndicator count={completedCount} total={5} />
          </Animated.View>

          <View style={styles.entriesContainer}>
            {entries.map((entry, index) => (
              <Animated.View 
                key={`entry-${index}`}
                entering={FadeInUp.duration(500).delay(200 + index * 100)}
                layout={Layout.springify()}
              >
                <EntryInput
                  value={entry}
                  onChangeText={(text) => handleChangeText(index, text)}
                  placeholder={`Good thing #${index + 1}`}
                  number={index + 1}
                />
              </Animated.View>
            ))}
          </View>
        </ScrollView>

        <SaveButton 
          onPress={handleSave} 
          isLoading={isSaving}
          isComplete={saveComplete}
          disabled={completedCount === 0}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    gap: spacing.md,
  },
  dateButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  date: {
    fontFamily: fontFamily.medium,
    fontSize: fontSizes.sm,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.xxl,
    marginBottom: spacing.md,
  },
  entriesContainer: {
    gap: spacing.md,
  },
});