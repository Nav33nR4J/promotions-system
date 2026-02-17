import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, StatusBar, TouchableOpacity, Animated, Modal, Alert } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { PromotionList } from "../components/organisms/PromotionList";
import { Button } from "../components/atoms/Button";
import { Text } from "../components/atoms/Text";
import { Input } from "../components/atoms/Input";
import { useTheme } from "../theme/ThemeProvider";
import { appStyles, getHomeScreenModalThemeStyles } from "../theme/styles";
import { Promotion } from "../redux/slices/promotionsSlice";
import { api } from "../utils/api";

type ValidationStatus = "IDLE" | "LOADING" | "ENABLED" | "DISABLED" | "INVALID";

export const HomeScreen = ({ navigation }: any) => {
  const { toggleTheme, isDark, theme } = useTheme();
  const themeIconAnim = useRef(new Animated.Value(isDark ? 1 : 0)).current;
  const modalThemeStyles = getHomeScreenModalThemeStyles(theme, isDark);

  // Validation modal state
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [validateCode, setValidateCode] = useState("");
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>("IDLE");
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    Animated.timing(themeIconAnim, {
      toValue: isDark ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [isDark, themeIconAnim]);

  const handleEditPromotion = useCallback((promotion: Promotion) => {
    navigation.navigate("CreatePromotion", { promotion });
  }, [navigation]);

  const handleValidate = async () => {
    if (!validateCode.trim()) {
      Alert.alert("Error", "Please enter a promo code to validate");
      return;
    }

    setValidating(true);
    setValidationStatus("LOADING");

    try {
      await api.post("/promotions/validate", {
        promo_code: validateCode.trim().toUpperCase(),
        order_amount: 100,
      });
      
      // If no error was thrown, validation was successful
      setValidationStatus("ENABLED");
    } catch (error: any) {
      console.log("Validation error caught:", error);
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message || "";
      
      console.log("Error status:", status, "message:", message);
      
      if (status === 404) {
        setValidationStatus("INVALID");
      } else if (
        message &&
        typeof message === "string" &&
        (message.toLowerCase().includes("inactive") || 
         message.toLowerCase().includes("expired") || 
         message.toLowerCase().includes("not started") || 
         message.toLowerCase().includes("usage limit"))
      ) {
        setValidationStatus("DISABLED");
      } else {
        setValidationStatus("INVALID");
      }
    } finally {
      setValidating(false);
    }
  };

  const closeValidateModal = () => {
    setShowValidateModal(false);
    setValidateCode("");
    setValidationStatus("IDLE");
  };

  return (
    <View style={[appStyles.homeScreen.container, modalThemeStyles.container]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={appStyles.homeScreen.headerGradient}
      >
        <View style={appStyles.homeScreen.headerContent}>
          <View>
            <Text style={appStyles.homeScreen.headerTitle}>Promotions</Text>
            <Text style={appStyles.homeScreen.headerSubtitle}>Manage your discount codes</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={toggleTheme}
            style={[appStyles.homeScreen.themeButton, modalThemeStyles.themeButton]}
            accessibilityRole="button"
            accessibilityLabel="Toggle theme"
          >
            <View style={appStyles.homeScreen.themeButtonIconStack}>
              <Animated.Text
                style={[
                  appStyles.homeScreen.themeButtonIcon,
                  appStyles.homeScreen.themeIconLayer,
                  {
                    opacity: themeIconAnim,
                    transform: [
                      {
                        scale: themeIconAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.9, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                ☀︎
              </Animated.Text>
              <Animated.Text
                style={[
                  appStyles.homeScreen.themeButtonIcon,
                  appStyles.homeScreen.themeIconLayer,
                  {
                    opacity: themeIconAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0],
                    }),
                    transform: [
                      {
                        scale: themeIconAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 0.9],
                        }),
                      },
                    ],
                  },
                ]}
              >
                ☾
              </Animated.Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Promotion List */}
      <PromotionList onEditPromotion={handleEditPromotion} />

      {/* Create Button */}
      <View style={appStyles.homeScreen.createButtonContainer}>
        <Button
          title="+ Create New Promotion"
          onPress={() => navigation.navigate("CreatePromotion")}
          style={appStyles.homeScreen.createButton}
        />
      </View>

      {/* Floating Validate Button */}
      <TouchableOpacity
        style={[appStyles.homeScreen.floatingButton, modalThemeStyles.floatingButton]}
        onPress={() => setShowValidateModal(true)}
        activeOpacity={0.8}
      >
        <Text style={appStyles.homeScreen.floatingButtonText}>✓</Text>
      </TouchableOpacity>

      {/* Validation Modal */}
      <Modal
        visible={showValidateModal}
        transparent
        animationType="fade"
        onRequestClose={closeValidateModal}
      >
        <View style={appStyles.homeScreen.modalOverlay}>
          <View style={[appStyles.homeScreen.modalContent, modalThemeStyles.modalContent]}>
            <Text style={[appStyles.homeScreen.modalTitle, { color: modalThemeStyles.modalTitle.color }]}>Validate Promo Code</Text>
            
            <Input
              placeholder="Enter promo code"
              value={validateCode}
              onChangeText={(val) => {
                setValidateCode(val.toUpperCase());
                setValidationStatus("IDLE");
              }}
              autoCapitalize="characters"
              style={modalThemeStyles.input}
            />
            
            <TouchableOpacity
              style={[
                appStyles.homeScreen.validateButton,
                modalThemeStyles.validateButton,
                (validating || !validateCode.trim()) && appStyles.homeScreen.validateButtonDisabled,
              ]}
              onPress={handleValidate}
              disabled={validating || !validateCode.trim()}
            >
              <Text style={appStyles.homeScreen.validateButtonText}>
                {validating ? "Validating..." : "Validate"}
              </Text>
            </TouchableOpacity>
            
            {/* Status Display */}
            {validationStatus !== "IDLE" && validationStatus !== "LOADING" && (
              <View
                style={[
                  appStyles.homeScreen.statusContainer,
                  validationStatus === "ENABLED" && appStyles.homeScreen.statusEnabled,
                  validationStatus === "DISABLED" && appStyles.homeScreen.statusDisabled,
                  validationStatus === "INVALID" && appStyles.homeScreen.statusInvalid,
                ]}
              >
                <Text
                  style={[
                    appStyles.homeScreen.statusText,
                    validationStatus === "ENABLED" && appStyles.homeScreen.statusTextEnabled,
                    validationStatus === "DISABLED" && appStyles.homeScreen.statusTextDisabled,
                    validationStatus === "INVALID" && appStyles.homeScreen.statusTextInvalid,
                  ]}
                >
                  {validationStatus === "ENABLED" && "✓ ENABLED"}
                  {validationStatus === "DISABLED" && "⚠ DISABLED"}
                  {validationStatus === "INVALID" && "✕ INVALID"}
                </Text>
              </View>
            )}
            
            <TouchableOpacity
              style={appStyles.homeScreen.closeButton}
              onPress={closeValidateModal}
            >
              <Text style={[appStyles.homeScreen.closeButtonText, { color: modalThemeStyles.closeButtonText.color }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
