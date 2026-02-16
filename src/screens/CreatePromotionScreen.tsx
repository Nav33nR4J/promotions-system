import React, { useCallback } from "react";
import { SafeAreaView, ScrollView, View, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { PromotionForm } from "../components/organisms/PromotionForm";
import { Text } from "../components/atoms/Text";
import { Promotion } from "../redux/slices/promotionsSlice";
import { useTheme } from "../theme/ThemeProvider";
import { appStyles } from "../theme/styles";

interface CreatePromotionScreenProps {
  navigation: any;
  route: {
    params?: {
      promotion?: Promotion;
    };
  };
}

export const CreatePromotionScreen = ({ navigation, route }: CreatePromotionScreenProps) => {
  const { isDark, theme } = useTheme();
  const editingPromotion = route.params?.promotion;
  const isEditing = !!editingPromotion;

  const handleSuccess = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={[appStyles.createPromotionScreen.container, { backgroundColor: isDark ? theme.background : "#FFFFFF" }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={appStyles.createPromotionScreen.headerGradient}
      >
        <View style={appStyles.createPromotionScreen.headerContent}>
          <TouchableOpacity onPress={handleBack} style={appStyles.createPromotionScreen.backButton}>
            <Text style={appStyles.createPromotionScreen.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={appStyles.createPromotionScreen.headerTitle}>
            {isEditing ? "Edit Promotion" : "Create Promotion"}
          </Text>
          <View style={appStyles.createPromotionScreen.placeholder} />
        </View>
      </LinearGradient>

      {/* Form */}
      <ScrollView 
        contentContainerStyle={appStyles.createPromotionScreen.scrollContent}
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
