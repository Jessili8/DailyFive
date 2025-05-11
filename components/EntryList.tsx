import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { spacing, fontFamily, fontSizes, borderRadius, shadow } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

interface EntryListProps {
  entries: string[];
}

const EntryList: React.FC<EntryListProps> = ({ entries }) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.container}>
      {entries.map((entry, index) => (
        entry.trim() ? (
          <Animated.View
            key={`entry-${index}`}
            entering={FadeIn.duration(300).delay(index * 50)}
            style={[
              styles.entryCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              shadow.sm
            ]}
          >
            <View
              style={[
                styles.entryNumberBadge,
                { backgroundColor: colors.primary[500] }
              ]}
            >
              <Text style={styles.entryNumberText}>{index + 1}</Text>
            </View>
            <Text style={[styles.entryText, { color: colors.text }]}>
              {entry}
            </Text>
          </Animated.View>
        ) : null
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  entryCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
  },
  entryNumberBadge: {
    position: 'absolute',
    top: -12,
    left: spacing.md,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryNumberText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.xs,
    color: 'white',
  },
  entryText: {
    fontFamily: fontFamily.regular,
    fontSize: fontSizes.md,
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    lineHeight: 22,
  },
});

export default EntryList;