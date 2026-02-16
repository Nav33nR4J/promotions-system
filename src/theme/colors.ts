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
  primary: "#7C3AED",
  secondary: "#A78BFA",
  background: "#F8FAFC",
  card: "#FFFFFF",
  cardAlt: "#EEF2FF",
  text: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  gradientStart: "#A78BFA",
  gradientEnd: "#7C3AED",
  gradientMid: "#8B5CF6",
  border: "#E2E8F0",
  divider: "#E2E8F0",
  success: "#4CAF50",
  warning: "#FFC107",
  error: "#F44336",
  info: "#2196F3",
  disabled: "#BDBDBD",
  overlay: "rgba(0,0,0,0.5)",
};

export const darkTheme = {
  primary: "#8B5CF6",
  secondary: "#C4B5FD",
  background: "#0A061A",
  card: "#1E1B3A",
  cardAlt: "#2D2A5C",
  text: "#FFFFFF",
  textSecondary: "#C4B5FD",
  textMuted: "#8B5CF6",
  gradientStart: "#C4B5FD",
  gradientEnd: "#8B5CF6",
  gradientMid: "#A78BFA",
  border: "#4C1D95",
  divider: "#2D2A5C",
  success: "#4CAF50",
  warning: "#FFC107",
  error: "#F44336",
  info: "#2196F3",
  disabled: "#555555",
  overlay: "rgba(0,0,0,0.7)",
};

// Pre-defined gradient color combinations
export const gradientPresets = {
  // Primary purple gradient (default)
  primary: ["#A78BFA", "#7C3AED"],
  
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
  expired: ["#A78BFA", "#7C3AED"],
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

