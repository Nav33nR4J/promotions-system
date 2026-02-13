import React, { memo, useCallback, useEffect, useRef } from "react";
import { TouchableOpacity, StyleSheet, Animated } from "react-native";

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
  const translateX = useRef(new Animated.Value(value ? 22 : 0)).current;
  const backgroundColor = useRef(
    new Animated.Value(value ? 1 : 0)
  ).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: value ? 22 : 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(backgroundColor, {
        toValue: value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [value, translateX, backgroundColor]);

  const handlePress = useCallback(() => {
    if (!disabled) {
      // Scale animation on press
      Animated.sequence([
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
      ]).start();

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
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: backgroundColorInterpolation,
            opacity: disabled ? 0.5 : 1,
            transform: [{ scale }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

export const ToggleSwitch = memo(ToggleSwitchComponent);

const styles = StyleSheet.create({
  container: {
    width: 52,
    height: 30,
    borderRadius: 15,
    padding: 2,
    justifyContent: "center",
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 4,
  },
});