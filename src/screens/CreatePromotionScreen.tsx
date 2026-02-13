import React, { useCallback } from "react";
import { SafeAreaView, ScrollView, View, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { PromotionForm } from "../components/organisms/PromotionForm";
import { Text } from "../components/atoms/Text";
import { Promotion } from "../redux/slices/promotionsSlice";
import { useTheme } from "../theme/ThemeProvider";

interface CreatePromotionScreenProps {
  navigation: any;
  route: {
    params?: {
      promotion?: Promotion;
    };
  };
}

export const CreatePromotionScreen = ({ navigation, route }: CreatePromotionScreenProps) => {
  const { isDark } = useTheme();
  const editingPromotion = route.params?.promotion;
  const isEditing = !!editingPromotion;

  const handleSuccess = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleBack = useCallback(() => {
    navigation.goBack();
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
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? "Edit Promotion" : "Create Promotion"}
          </Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      {/* Form */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PromotionForm 
          promotion={editingPromotion}
          onSuccess={handleSuccess}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
});
