import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { spacing, fontFamily, fontSizes, borderRadius, shadow } from '@/constants/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft } from 'lucide-react-native';

export default function AboutScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'About Daily Five',
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTitleStyle: {
            fontFamily: fontFamily.semibold,
            color: colors.text,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <ArrowLeft
              color={colors.primary[500]}
              size={24}
              onPress={() => router.back()}
              style={{ marginRight: spacing.md }}
            />
          ),
        }} 
      />
      
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
            The Power of Daily Gratitude
          </Text>
          
          <Text style={[styles.paragraph, { color: colors.text }]}>
            Inspired by renowned actress Song Hye-kyo's personal practice, Daily Five is more than just an app – it's a journey toward mindful appreciation and joy in everyday life.
          </Text>
          
          <Text style={[styles.paragraph, { color: colors.text }]}>
            Song Hye-kyo shared that she maintains a daily ritual of writing down five things she's grateful for, a practice that has profoundly impacted her perspective and well-being. This simple yet powerful habit helps cultivate a positive mindset and reminds us of the beauty in our daily experiences.
          </Text>
          
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Why Five Things?
          </Text>
          
          <Text style={[styles.paragraph, { color: colors.text }]}>
            The number five is significant yet achievable. It encourages us to look beyond the obvious and discover deeper sources of gratitude in our lives. Whether it's a warm cup of coffee, a friend's smile, or a moment of peace, every detail matters.
          </Text>
          
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            The Science of Gratitude
          </Text>
          
          <Text style={[styles.paragraph, { color: colors.text }]}>
            Research shows that practicing gratitude can lead to:
          </Text>
          
          <View style={styles.bulletPoints}>
            {[
              'Increased happiness and life satisfaction',
              'Better sleep quality',
              'Reduced stress and anxiety',
              'Improved relationships',
              'Greater resilience in challenging times'
            ].map((point, index) => (
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
            Your Daily Practice
          </Text>
          
          <Text style={[styles.paragraph, { color: colors.text }]}>
            We encourage you to make this practice your own. Take a moment each day to reflect on what brings you joy, what you're thankful for, or what made your day special. Over time, you'll build a beautiful collection of memories and gratitude that you can look back on.
          </Text>
        </Animated.View>
      </ScrollView>
    </>
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