import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, StatusBar, TouchableOpacity, Animated, Modal, StyleSheet, Alert } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { PromotionList } from "../components/organisms/PromotionList";
import { Button } from "../components/atoms/Button";
import { Text } from "../components/atoms/Text";
import { Input } from "../components/atoms/Input";
import { useTheme } from "../theme/ThemeProvider";
import { appStyles } from "../theme/styles";
import { Promotion } from "../redux/slices/promotionsSlice";
import { api } from "../utils/api";

type ValidationStatus = "IDLE" | "LOADING" | "ENABLED" | "DISABLED" | "INVALID";

export const HomeScreen = ({ navigation }: any) => {
  const { toggleTheme, isDark, theme } = useTheme();
  const themeIconAnim = useRef(new Animated.Value(isDark ? 1 : 0)).current;

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
      const message = error.response?.data?.message || error.message;
      
      console.log("Error status:", status, "message:", message);
      
      if (status === 404) {
        setValidationStatus("INVALID");
      } else if (message && (message.includes("inactive") || message.includes("expired") || message.includes("not started") || message.includes("usage limit"))) {
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
    <View style={[appStyles.homeScreen.container, { backgroundColor: isDark ? theme.background : "#FFFFFF", paddingTop: 0, marginTop: 0 }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[appStyles.homeScreen.headerGradient, { marginTop: 0 }]}
      >
        <View style={appStyles.homeScreen.headerContent}>
          <View>
            <Text style={appStyles.homeScreen.headerTitle}>Promotions</Text>
            <Text style={appStyles.homeScreen.headerSubtitle}>Manage your discount codes</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={toggleTheme}
            style={[
              appStyles.homeScreen.themeButton,
              {
                backgroundColor: isDark ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.24)",
                borderColor: "rgba(255,255,255,0.35)",
              },
            ]}
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
        style={[
          styles.floatingButton,
          { backgroundColor: theme.primary },
        ]}
        onPress={() => setShowValidateModal(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.floatingButtonText}>✓</Text>
      </TouchableOpacity>

      {/* Validation Modal */}
      <Modal
        visible={showValidateModal}
        transparent
        animationType="fade"
        onRequestClose={closeValidateModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? theme.card : "#FFFFFF" }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Validate Promo Code</Text>
            
            <Input
              placeholder="Enter promo code"
              value={validateCode}
              onChangeText={(val) => {
                setValidateCode(val.toUpperCase());
                setValidationStatus("IDLE");
              }}
              autoCapitalize="characters"
              style={{ marginBottom: 16 }}
            />
            
            <TouchableOpacity
              style={[
                styles.validateButton,
                { backgroundColor: theme.primary },
                (validating || !validateCode.trim()) && styles.validateButtonDisabled,
              ]}
              onPress={handleValidate}
              disabled={validating || !validateCode.trim()}
            >
              <Text style={styles.validateButtonText}>
                {validating ? "Validating..." : "Validate"}
              </Text>
            </TouchableOpacity>
            
            {/* Status Display */}
            {validationStatus !== "IDLE" && validationStatus !== "LOADING" && (
              <View
                style={[
                  styles.statusContainer,
                  validationStatus === "ENABLED" && styles.statusEnabled,
                  validationStatus === "DISABLED" && styles.statusDisabled,
                  validationStatus === "INVALID" && styles.statusInvalid,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    validationStatus === "ENABLED" && styles.statusTextEnabled,
                    validationStatus === "DISABLED" && styles.statusTextDisabled,
                    validationStatus === "INVALID" && styles.statusTextInvalid,
                  ]}
                >
                  {validationStatus === "ENABLED" && "✓ ENABLED"}
                  {validationStatus === "DISABLED" && "⚠ DISABLED"}
                  {validationStatus === "INVALID" && "✕ INVALID"}
                </Text>
              </View>
            )}
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeValidateModal}
            >
              <Text style={[styles.closeButtonText, { color: theme.primary }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  floatingButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  validateButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  validateButtonDisabled: {
    opacity: 0.6,
  },
  validateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  statusContainer: {
    width: "100%",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  statusEnabled: {
    backgroundColor: "#E8F5E9",
  },
  statusDisabled: {
    backgroundColor: "#FFF3E0",
  },
  statusInvalid: {
    backgroundColor: "#FFEBEE",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusTextEnabled: {
    color: "#2E7D32",
  },
  statusTextDisabled: {
    color: "#E65100",
  },
  statusTextInvalid: {
    color: "#C62828",
  },
  closeButton: {
    paddingVertical: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
