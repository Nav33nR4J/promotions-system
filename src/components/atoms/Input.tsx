import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";

interface InputProps extends TextInputProps {
  placeholder: string;
  style?: any;
}

export const Input = ({ style, ...props }: InputProps) => {
  const { theme } = useTheme();
  return (
    <TextInput
      {...props}
      style={[styles.input, { backgroundColor: theme.card, color: theme.text }, style]}
      placeholderTextColor={theme.text + "99" as any}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
});
