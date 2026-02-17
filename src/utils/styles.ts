/**
 * Style Utility Functions
 * 
 * Provides utilities for flattening and merging styles using StyleSheet.flatten
 */

import { StyleSheet, StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';

/**
 * Flattens a style prop into a single style object using StyleSheet.flatten
 * This resolves nested styles, arrays, and conditional styles into one object
 * 
 * @param style - A single style, array of styles, or undefined
 * @returns Flattened style object or empty object
 */
export const flattenStyle = <T extends ViewStyle | TextStyle | ImageStyle>(
  style: StyleProp<T> | undefined
): ViewStyle | TextStyle | ImageStyle => {
  if (!style) {
    return {} as ViewStyle | TextStyle | ImageStyle;
  }

  // Use StyleSheet.flatten to resolve all style compositions
  const flattened = StyleSheet.flatten(style);
  
  return flattened as ViewStyle | TextStyle | ImageStyle;
};

/**
 * Merges multiple style objects/arrays into a single flattened style
 * Later styles override earlier ones in case of conflicts
 * 
 * @param styles - Array of styles to merge
 * @returns Merged and flattened style object
 */
export const mergeStyles = <T extends ViewStyle | TextStyle | ImageStyle>(
  ...styles: (StyleProp<T> | undefined)[]
): ViewStyle | TextStyle | ImageStyle => {
  // Filter out undefined styles
  const validStyles = styles.filter((style): style is StyleProp<T> => style !== undefined);
  
  if (validStyles.length === 0) {
    return {} as ViewStyle | TextStyle | ImageStyle;
  }

  // If single style, just flatten it
  if (validStyles.length === 1) {
    return flattenStyle(validStyles[0]);
  }

  // Use StyleSheet.flatten to merge all styles
  // StyleSheet.flatten handles array of styles and resolves them
  const merged = StyleSheet.flatten(validStyles);
  
  return merged as ViewStyle | TextStyle | ImageStyle;
};

/**
 * Conditionally applies styles based on condition
 * 
 * @param condition - Boolean condition to apply styles
 * @param trueStyle - Style to apply if condition is true
 * @param falseStyle - Optional style to apply if condition is false
 * @returns The appropriate style based on condition
 */
export const conditionalStyle = <T extends ViewStyle | TextStyle | ImageStyle>(
  condition: boolean,
  trueStyle: StyleProp<T>,
  falseStyle?: StyleProp<T>
): StyleProp<T> => {
  return condition ? trueStyle : (falseStyle || undefined);
};

/**
 * Creates a style object that can be used with StyleSheet.flatten
 * Useful for creating reusable style compositions
 * 
 * @param baseStyle - Base style object
 * @param overrides - Partial style to override base with
 * @returns Merged style object
 */
export const createMergedStyle = <T extends ViewStyle | TextStyle | ImageStyle>(
  baseStyle: T,
  overrides: Partial<T>
): T => {
  return { ...baseStyle, ...overrides };
};

export default {
  flattenStyle,
  mergeStyles,
  conditionalStyle,
  createMergedStyle,
};

