import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useTheme } from "../../theme/ThemeProvider";
import { sharedStyles, componentStyles } from "../../theme/styles";

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: any;
}

export const Button = ({ title, onPress, disabled, loading, style }: ButtonProps) => {
  const { theme } = useTheme();

  const containerStyle = [
    componentStyles.button.container,
    disabled && { opacity: 0.6 },
    style,
  ];

  return (
    <LinearGradient
      colors={[theme.gradientStart, theme.gradientEnd]}
      style={containerStyle}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <TouchableOpacity
        onPress={onPress}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};
