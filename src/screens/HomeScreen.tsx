import React, { useCallback } from "react";
import { SafeAreaView, View, StyleSheet, StatusBar } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { PromotionList } from "../components/organisms/PromotionList";
import { Button } from "../components/atoms/Button";
import { Text } from "../components/atoms/Text";
import { useTheme } from "../theme/ThemeProvider";
import { Promotion } from "../redux/slices/promotionsSlice";

export const HomeScreen = ({ navigation }: any) => {
  const { toggleTheme, isDark } = useTheme();

  const handleEditPromotion = useCallback((promotion: Promotion) => {
    navigation.navigate("CreatePromotion", { promotion });
  }, [navigation]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#121212" : "#FFFFFF" }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <LinearGradient
        colors={["#FF6B6B", "#FF3B30"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Promotions</Text>
            <Text style={styles.headerSubtitle}>Manage your discount codes</Text>
          </View>
          <Button
            title={isDark ? "☀️" : "🌙"}
            onPress={toggleTheme}
            style={styles.themeButton}
          />
        </View>
      </LinearGradient>

      {/* Promotion List */}
      <PromotionList onEditPromotion={handleEditPromotion} />

      {/* Create Button */}
      <View style={styles.createButtonContainer}>
        <Button
          title="+ Create New Promotion"
          onPress={() => navigation.navigate("CreatePromotion")}
          style={styles.createButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
  },
  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  createButtonContainer: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
  },
  createButton: {
    backgroundColor: "#FF3B30",
    height: 56,
    borderRadius: 16,
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
});

