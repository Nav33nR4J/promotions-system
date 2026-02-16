import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { componentStyles } from "../../theme/styles";

interface InputProps extends TextInputProps {
  placeholder: string;
  style?: any;
}

export const Input = ({ style, ...props }: InputProps) => {
  const { theme } = useTheme();
  return (
    <TextInput
      {...props}
      style={[componentStyles.input.container, { backgroundColor: theme.card, color: theme.text }, style]}
      placeholderTextColor={theme.text + "99" as any}
    />
  );
};
