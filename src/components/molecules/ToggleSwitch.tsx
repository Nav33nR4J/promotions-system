import React, { memo, useCallback, useEffect, useRef } from "react";
import { TouchableOpacity, Animated } from "react-native";
import { componentStyles, getToggleSwitchThemeStyles } from "../../theme/styles";
import { useTheme } from "../../theme/ThemeProvider";

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitchComponent: React.FC<ToggleSwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const themeStyles = getToggleSwitchThemeStyles(theme);
  
  // Ensure disabled is always a boolean
  const isDisabled = Boolean(disabled);
  
  const translateX = useRef(new Animated.Value(value ? 22 : 0)).current;
  const backgroundColor = useRef(
    new Animated.Value(value ? 1 : 0)
  ).current;
  const scale = useRef(new Animated.Value(1)).current;
  
  // Refs to track ongoing animations for cleanup
  const toggleAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  const scaleAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

  // Cleanup function to stop any running animations
  const stopAllAnimations = useCallback(() => {
    if (toggleAnimationRef.current) {
      toggleAnimationRef.current.stop();
      toggleAnimationRef.current = null;
    }
    if (scaleAnimationRef.current) {
      scaleAnimationRef.current.stop();
      scaleAnimationRef.current = null;
    }
    translateX.stopAnimation();
    backgroundColor.stopAnimation();
    scale.stopAnimation();
  }, [translateX, backgroundColor, scale]);

  useEffect(() => {
    // Stop any running animations before starting new ones
    stopAllAnimations();

    // Use useNativeDriver: true for both animations to avoid conflicts
    const translateXAnimation = Animated.spring(translateX, {
      toValue: value ? 22 : 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    });

    const backgroundColorAnimation = Animated.timing(backgroundColor, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: true, // Changed to true for consistency
    });

    toggleAnimationRef.current = Animated.parallel([
      translateXAnimation,
      backgroundColorAnimation,
    ]);

    toggleAnimationRef.current.start();

    return () => {
      // Cleanup on unmount or before next animation
      stopAllAnimations();
    };
  }, [value, translateX, backgroundColor, stopAllAnimations]);

  const handlePress = useCallback(() => {
    if (!isDisabled) {
      // Stop any existing scale animation before starting a new one
      if (scaleAnimationRef.current) {
        scaleAnimationRef.current.stop();
      }

      scaleAnimationRef.current = Animated.sequence([
        Animated.spring(scale, {
          toValue: 0.92,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
      ]);

      scaleAnimationRef.current.start();
      onValueChange(!value);
    }
  }, [disabled, onValueChange, value, scale]);

  const backgroundColorInterpolation = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(158, 158, 158, 0.6)", "rgba(76, 175, 80, 0.95)"],
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
      disabled={isDisabled}
    >
      <Animated.View
        style={[
          componentStyles.toggleSwitch.container,
          {
            backgroundColor: backgroundColorInterpolation,
            opacity: isDisabled ? 0.5 : 1,
            transform: [{ scale }],
          },
        ]}
      >
        <Animated.View
          style={[
            componentStyles.toggleSwitch.thumb,
            {
              transform: [{ translateX }],
              backgroundColor: themeStyles.thumb.backgroundColor,
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

export const ToggleSwitch = memo(ToggleSwitchComponent);
