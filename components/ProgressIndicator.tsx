import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { spacing, fontFamily, fontSizes, borderRadius } from '@/constants/theme';

interface ProgressIndicatorProps {
  count: number;
  total: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ count, total }) => {
  const { colors } = useTheme();
  const [prevCount, setPrevCount] = React.useState(count);
  const [animate, setAnimate] = React.useState(false);
  
  React.useEffect(() => {
    if (count > prevCount) {
      setAnimate(true);
      setPrevCount(count);
    } else {
      setPrevCount(count);
    }
  }, [count, prevCount]);
  
  const progressWidth = `${(count / total) * 100}%`;
  
  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(progressWidth, { duration: 400 }),
    };
  });
  
  const animatedCircleStyle = useAnimatedStyle(() => {
    if (animate) {
      return {
        transform: [
          {
            scale: withSequence(
              withTiming(1.2, { duration: 100 }),
              withTiming(1, { duration: 200 }, () => {
                runOnJS(setAnimate)(false);
              })
            ),
          },
        ],
      };
    }
    return {
      transform: [{ scale: 1 }],
    };
  });
  
  return (
    <View style={styles.container}>
      <View style={[styles.progressBar, { backgroundColor: colors.surface }]}>
        <Animated.View
          style={[
            styles.progressFill,
            { backgroundColor: colors.primary[500] },
            animatedProgressStyle,
          ]}
        />
      </View>
      
      <View style={styles.countContainer}>
        <Animated.View
          style={[
            styles.countCircle,
            { backgroundColor: colors.primary[500] },
            animatedCircleStyle,
          ]}
        >
          <Text style={styles.countText}>{count}</Text>
        </Animated.View>
        <Text style={[styles.totalText, { color: colors.textSecondary }]}>
          / {total}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: borderRadius.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.pill,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  countCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    color: 'white',
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.xs,
  },
  totalText: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSizes.xs,
    marginLeft: 2,
  },
});

export default ProgressIndicator;