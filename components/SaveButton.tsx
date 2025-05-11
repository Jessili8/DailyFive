import React from 'react';
import { StyleSheet, ActivityIndicator, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from '@/context/ThemeContext';
import { spacing, fontFamily, fontSizes, borderRadius, shadow } from '@/constants/theme';
import { Check } from 'lucide-react-native';

interface SaveButtonProps {
  onPress: () => void;
  isLoading: boolean;
  isComplete: boolean;
  disabled?: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  onPress,
  isLoading,
  isComplete,
  disabled = false,
}) => {
  const { colors } = useTheme();
  
  const buttonState = useDerivedValue(() => {
    if (isComplete) return 2;
    if (isLoading) return 1;
    return 0;
  }, [isLoading, isComplete]);
  
  const animatedButtonStyle = useAnimatedStyle(() => {
    const backgroundColor = withTiming(
      disabled
        ? colors.disabled
        : buttonState.value === 2
          ? colors.success[500]
          : colors.primary[500],
      { duration: 200 }
    );
    
    const width = withTiming(
      buttonState.value === 0 ? '100%' : 56,
      { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }
    );
    
    return {
      backgroundColor,
      width,
    };
  });
  
  const textOpacity = useAnimatedStyle(() => {
    return {
      opacity: withTiming(buttonState.value === 0 ? 1 : 0, {
        duration: 150,
      }),
    };
  });
  
  const loaderOpacity = useAnimatedStyle(() => {
    return {
      opacity: withTiming(buttonState.value === 1 ? 1 : 0, {
        duration: 150,
      }),
    };
  });
  
  const checkOpacity = useAnimatedStyle(() => {
    return {
      opacity: withTiming(buttonState.value === 2 ? 1 : 0, {
        duration: 150,
      }),
      transform: [
        {
          scale: buttonState.value === 2
            ? withSequence(
                withTiming(0, { duration: 0 }),
                withDelay(150, withTiming(1.2, { duration: 200 })),
                withTiming(1, { duration: 150 })
              )
            : withTiming(0, { duration: 150 }),
        },
      ],
    };
  });
  
  return (
    <Animated.View 
      style={[
        styles.buttonContainer, 
        { backgroundColor: colors.background }
      ]}
    >
      <TouchableOpacity
        onPress={!disabled && !isLoading && !isComplete ? onPress : undefined}
        activeOpacity={disabled ? 1 : 0.7}
        disabled={disabled || isLoading || isComplete}
      >
        <Animated.View 
          style={[
            styles.button, 
            shadow.sm,
            animatedButtonStyle
          ]}
        >
          <Animated.Text 
            style={[
              styles.buttonText, 
              { color: 'white' },
              textOpacity
            ]}
          >
            Save Entries
          </Animated.Text>
          
          <Animated.View style={[styles.loaderContainer, loaderOpacity]}>
            <ActivityIndicator color="white" size="small" />
          </Animated.View>
          
          <Animated.View style={[styles.checkContainer, checkOpacity]}>
            <Check color="white" size={24} />
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  button: {
    height: 56,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  buttonText: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSizes.md,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SaveButton;