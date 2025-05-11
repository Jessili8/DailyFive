import React, { useEffect, useState } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Text,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import Animated, { 
  FadeInUp, 
  FadeInDown,
  Layout 
} from 'react-native-reanimated';
import { format } from 'date-fns';
import { useTheme } from '@/context/ThemeContext';
import EntryInput from '@/components/EntryInput';
import ProgressIndicator from '@/components/ProgressIndicator';
import SaveButton from '@/components/SaveButton';
import { useEntries } from '@/hooks/useEntries';
import { spacing, fontFamily, fontSizes } from '@/constants/theme';

export default function TodayScreen() {
  const { colors } = useTheme();
  const today = format(new Date(), 'MMMM d, yyyy');
  const { saveEntries, getTodayEntries } = useEntries();
  
  const [entries, setEntries] = useState<string[]>(['', '', '', '', '']);
  const [isSaving, setIsSaving] = useState(false);
  const [saveComplete, setSaveComplete] = useState(false);
  
  const completedCount = entries.filter(entry => entry.trim().length > 0).length;
  
  useEffect(() => {
    loadTodayEntries();
  }, []);
  
  const loadTodayEntries = async () => {
    const todayEntries = await getTodayEntries();
    if (todayEntries) {
      setEntries(todayEntries);
    }
  };

  const handleChangeText = (index: number, text: string) => {
    const newEntries = [...entries];
    newEntries[index] = text;
    setEntries(newEntries);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await saveEntries(entries);
    setIsSaving(false);
    setSaveComplete(true);
    
    setTimeout(() => {
      setSaveComplete(false);
    }, 2000);
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
            <Text style={[styles.date, { color: colors.textSecondary }]}>
              {today}
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>
              What made today great?
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
  date: {
    fontFamily: fontFamily.medium,
    fontSize: fontSizes.sm,
    marginBottom: spacing.xs,
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