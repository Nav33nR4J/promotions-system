import React, { createContext, useState, useContext, ReactNode, useCallback, useMemo } from "react";
import { lightTheme, darkTheme, gradientPresets, getStatusGradient, Theme } from "./colors";

interface ThemeContextProps {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  gradientPresets: typeof gradientPresets;
  getStatusGradient: (status?: string) => string[];
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
  gradientPresets,
  getStatusGradient,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      theme: isDark ? darkTheme : lightTheme,
      isDark,
      toggleTheme,
      gradientPresets,
      getStatusGradient,
    }),
    [isDark, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Re-export for convenience
export { gradientPresets, getStatusGradient };
export type { Theme };

