// Enhanced theme colors with gradient support

export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  cardAlt: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  gradientStart: string;
  gradientEnd: string;
  gradientMid: string;
  border: string;
  divider: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  disabled: string;
  overlay: string;
}

export const lightTheme = {
  primary: "#FF3B30",
  secondary: "#FF6B6B",
  background: "#FFFFFF",
  card: "#FFFFFF",
  cardAlt: "#F8F8F8",
  text: "#111111",
  textSecondary: "#666666",
  textMuted: "#999999",
  gradientStart: "#FF6B6B",
  gradientEnd: "#FF3B30",
  gradientMid: "#FF5252",
  border: "#E0E0E0",
  divider: "#EEEEEE",
  success: "#4CAF50",
  warning: "#FFC107",
  error: "#F44336",
  info: "#2196F3",
  disabled: "#BDBDBD",
  overlay: "rgba(0,0,0,0.5)",
};

export const darkTheme = {
  primary: "#FF3B30",
  secondary: "#FF6B6B",
  background: "#121212",
  card: "#1E1E1E",
  cardAlt: "#2C2C2C",
  text: "#FFFFFF",
  textSecondary: "#B0B0B0",
  textMuted: "#808080",
  gradientStart: "#FF6B6B",
  gradientEnd: "#FF3B30",
  gradientMid: "#FF5252",
  border: "#333333",
  divider: "#2C2C2C",
  success: "#4CAF50",
  warning: "#FFC107",
  error: "#F44336",
  info: "#2196F3",
  disabled: "#555555",
  overlay: "rgba(0,0,0,0.7)",
};

// Pre-defined gradient color combinations
export const gradientPresets = {
  // Primary red gradient (default)
  primary: ["#FF6B6B", "#FF3B30"],
  
  // Blue gradient
  blue: ["#4FC3F7", "#2196F3"],
  
  // Green gradient
  green: ["#81C784", "#4CAF50"],
  
  // Purple gradient
  purple: ["#BA68C8", "#9C27B0"],
  
  // Orange gradient
  orange: ["#FFB74D", "#FF9800"],
  
  // Teal gradient
  teal: ["#4DD0E1", "#00BCD4"],
  
  // Pink gradient
  pink: ["#F06292", "#E91E63"],
  
  // Indigo gradient
  indigo: ["#7986CB", "#3F51B5"],
  
  // Status gradients
  active: ["#66BB6A", "#43A047"],
  inactive: ["#90A4AE", "#607D8B"],
  upcoming: ["#42A5F5", "#1E88E5"],
  expired: ["#EF5350", "#E53935"],
};

// Get gradient colors based on promotion status
export const getStatusGradient = (status?: string): string[] => {
  switch (status) {
    case "ACTIVE":
      return gradientPresets.active;
    case "INACTIVE":
      return gradientPresets.inactive;
    default:
      return gradientPresets.primary;
  }
};

