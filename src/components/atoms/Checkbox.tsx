import React, { memo, useCallback } from "react";
import { TouchableOpacity, View, StyleSheet, Text, ViewStyle, StyleProp } from "react-native";

interface CheckboxProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const CheckboxComponent: React.FC<CheckboxProps> = ({
  value,
  onValueChange,
  disabled = false,
  color = "#4CAF50",
  size = 24,
  style,
}: CheckboxProps) => {
  const handlePress = useCallback(() => {
    if (!disabled) {
      onValueChange(!value);
    }
  }, [disabled, onValueChange, value]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.container,
        style,
        {
          width: size,
          height: size,
          borderColor: disabled ? "#ccc" : value ? color : "#666",
          backgroundColor: value ? color : "transparent",
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      {value && (
        <View style={styles.checkmark}>
          <Text style={[styles.checkmarkText, { fontSize: size * 0.7 }]}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export const Checkbox = memo(CheckboxComponent);

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

