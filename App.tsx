import React from "react";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { store } from "./src/redux/store";
import { ThemeProvider, useTheme } from "./src/theme/ThemeProvider";
import { AppNavigator } from "./src/navigation/AppNavigator";

const AppContent = () => {
  const { isDark, theme } = useTheme();
  
  return (
    <>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={theme.background}
        translucent={false}
      />
      <AppNavigator />
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
