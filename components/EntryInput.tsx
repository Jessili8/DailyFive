import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { spacing, fontFamily, fontSizes, borderRadius, shadow } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface EntryInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  number: number;
}

const EntryInput: React.FC<EntryInputProps> = ({
  value,
  onChangeText,
  placeholder,
  number,
}) => {
  const { colors } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  
  const handlePress = () => {
    inputRef.current?.focus();
  };
  
  const handleFocus = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsFocused(true);
  };
  
  const handleBlur = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsFocused(false);
  };
  
  const animatedCircleStyle = useAnimatedStyle(() => {
    const backgroundColor = withTiming(
      value ? colors.primary[500] : isFocused ? colors.primary[400] : colors.surface
    );
    
    const borderColor = withTiming(
      value ? colors.primary[500] : isFocused ? colors.primary[400] : colors.border
    );
    
    return {
      backgroundColor,
      borderColor,
    };
  });
  
  const numberColor = value ? 'white' : isFocused ? 'white' : colors.textSecondary;
  
  return (
    <Pressable onPress={handlePress}>
      <View 
        style={[
          styles.container, 
          { 
            backgroundColor: colors.card,
            borderColor: isFocused ? colors.primary[400] : colors.border,
          },
          shadow.sm
        ]}
      >
        <Animated.View style={[styles.circle, animatedCircleStyle]}>
          <Text style={[styles.number, { color: numberColor }]}>{number}</Text>
        </Animated.View>
        
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.placeholder}
            style={[
              styles.input,
              { 
                color: colors.text,
                height: isFocused || value ? 100 : 56,
              }
            ]}
            multiline
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    margin: spacing.md,
    borderWidth: 1,
  },
  number: {
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.md,
  },
  inputContainer: {
    flex: 1,
    paddingRight: spacing.md,
  },
  input: {
    fontFamily: fontFamily.regular,
    fontSize: fontSizes.md,
    paddingTop: spacing.md,
    paddingRight: spacing.sm,
    textAlignVertical: 'top',
  },
});

export default EntryInput;