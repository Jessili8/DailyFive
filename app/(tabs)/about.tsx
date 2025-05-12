import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { spacing, fontFamily, fontSizes, borderRadius, shadow } from '@/constants/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AboutScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Image 
        source={{ uri: 'https://images.pexels.com/photos/5853034/pexels-photo-5853034.jpeg' }}
        style={styles.image}
      />
      
      <Animated.View 
        entering={FadeInDown.duration(600).delay(100)}
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, shadow.sm]}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          {t('about.title')}
        </Text>
        
        <Text style={[styles.paragraph, { color: colors.text }]}>
          {t('about.inspiration')}
        </Text>
        
        <Text style={[styles.paragraph, { color: colors.text }]}>
          {t('about.practice')}
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('about.whyFiveTitle')}
        </Text>
        
        <Text style={[styles.paragraph, { color: colors.text }]}>
          {t('about.whyFiveText')}
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('about.scienceTitle')}
        </Text>
        
        <Text style={[styles.paragraph, { color: colors.text }]}>
          {t('about.scienceIntro')}
        </Text>
        
        <View style={styles.bulletPoints}>
          {t('about.benefits').split('|').map((point, index) => (
            <View key={index} style={styles.bulletPoint}>
              <View 
                style={[
                  styles.bullet, 
                  { backgroundColor: colors.primary[500] }
                ]} 
              />
              <Text style={[styles.bulletText, { color: colors.text }]}>
                {point}
              </Text>
            </View>
          ))}
        </View>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('about.practiceTitle')}
        </Text>
        
        <Text style={[styles.paragraph, { color: colors.text }]}>
          {t('about.practiceText')}
        </Text>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.xxl,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSizes.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  paragraph: {
    fontFamily: fontFamily.regular,
    fontSize: fontSizes.md,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  bulletPoints: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  bulletText: {
    fontFamily: fontFamily.regular,
    fontSize: fontSizes.md,
    flex: 1,
  },
});