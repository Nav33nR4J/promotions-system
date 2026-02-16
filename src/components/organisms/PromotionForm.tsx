import React, { useState, useMemo } from "react";
import { View, StyleSheet, Alert, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";
import { Text } from "../atoms/Text";
import { Promotion } from "../../redux/slices/promotionsSlice";
import { useDispatch } from "react-redux";
import { createPromotion, updatePromotion } from "../../redux/slices/promotionsSlice";
import { getErrorMessage } from "../../utils/errors";
import { useTheme } from "../../theme/ThemeProvider";

interface PromotionFormProps {
  promotion?: Promotion;
  onSuccess?: () => void;
}

type PromoType = "PERCENTAGE" | "FIXED";

const getTodayDate = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
};

const getFutureDate = (daysAhead: number = 30): string => {
  const future = new Date();
  future.setDate(future.getDate() + daysAhead);
  return `${future.getFullYear()}-${String(future.getMonth() + 1).padStart(2, "0")}-${String(future.getDate()).padStart(2, "0")}`;
};

export const PromotionForm = ({ promotion, onSuccess }: PromotionFormProps) => {
  const dispatch = useDispatch<any>();
  const { theme } = useTheme();
  
  // Initialize form with promotion data if editing
  const [form, setForm] = useState<Promotion>(() => {
    if (promotion) {
      return {
        promo_code: promotion.promo_code || "",
        title: promotion.title || "",
        type: promotion.type || "PERCENTAGE",
        // Ensure value is a number, not a string from API
        value: typeof promotion.value === 'number' ? promotion.value : Number(promotion.value) || 0,
        start_at: promotion.start_at || getTodayDate(),
        end_at: promotion.end_at || getFutureDate(30),
        status: promotion.status || "ACTIVE",
      };
    }
    return {
      promo_code: "",
      title: "",
      type: "PERCENTAGE" as const,
      value: 0,
      start_at: getTodayDate(),
      end_at: getFutureDate(30),
      status: "ACTIVE" as const,
    };
  });
  
  const isEditing = !!promotion?.id;
  const [loading, setLoading] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const handleChange = (key: keyof Promotion, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleTypeChange = (value: PromoType) => {
    handleChange("type", value);
    setShowTypeModal(false);
  };

  const confirmStartDate = () => {
    const dateStr = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, "0")}-${String(tempDate.getDate()).padStart(2, "0")}`;
    handleChange("start_at", dateStr);
    setShowStartModal(false);
  };

  const confirmEndDate = () => {
    const dateStr = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, "0")}-${String(tempDate.getDate()).padStart(2, "0")}`;
    handleChange("end_at", dateStr);
    setShowEndModal(false);
  };

  const openStartDatePicker = () => {
    if (form.start_at) {
      setTempDate(new Date(form.start_at));
    } else {
      setTempDate(new Date());
    }
    setShowStartModal(true);
  };

  const openEndDatePicker = () => {
    if (form.end_at) {
      setTempDate(new Date(form.end_at));
    } else {
      setTempDate(new Date());
    }
    setShowEndModal(true);
  };

  const validateForm = useMemo(() => {
    const errors: string[] = [];
    
    if (!form.promo_code.trim()) {
      errors.push("Promo code is required");
    } else if (!/^[A-Za-z0-9_-]+$/.test(form.promo_code)) {
      errors.push("Promo code can only contain letters, numbers, underscores, and hyphens");
    }
    
    if (!form.title.trim()) {
      errors.push("Title is required");
    }
    
    if (!form.value || form.value <= 0) {
      errors.push("Value must be greater than 0");
    }
    
    if (!form.start_at) {
      errors.push("Start date is required");
    }
    
    if (!form.end_at) {
      errors.push("End date is required");
    }
    
    if (form.start_at && form.end_at && new Date(form.start_at) >= new Date(form.end_at)) {
      errors.push("End date must be after start date");
    }
    
    return errors;
  }, [form]);

  const handleSubmit = async () => {
    if (validateForm.length > 0) {
      Alert.alert("Validation Error", validateForm.join("\n"));
      return;
    }

    setLoading(true);
    
    try {
      if (isEditing && promotion?.id) {
        // Create update payload with only the necessary fields
        const updateData = {
          promo_code: form.promo_code,
          title: form.title,
          type: form.type,
          value: form.value,
          start_at: form.start_at,
          end_at: form.end_at,
          status: form.status,
        };
        
        // Ensure ID is a number
        const promotionId = typeof promotion.id === 'number' ? promotion.id : Number(promotion.id);
        await dispatch(updatePromotion({ id: promotionId, data: updateData })).unwrap();
        Alert.alert("Success", "Promotion updated successfully!", [
          { text: "OK", onPress: () => {
            onSuccess?.();
          }}
        ]);
      } else {
        await dispatch(createPromotion(form)).unwrap();
        Alert.alert("Success", "Promotion created successfully!", [
          { text: "OK", onPress: () => {
            onSuccess?.();
            setForm({
              promo_code: "",
              title: "",
              type: "PERCENTAGE",
              value: 0,
              start_at: getTodayDate(),
              end_at: getFutureDate(30),
              status: "ACTIVE",
            });
          }}
        ]);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: { padding: 16 },
    fieldContainer: { marginBottom: 16 },
    label: { 
      fontSize: 14, 
      fontWeight: "600", 
      marginBottom: 8,
      color: theme.text,
    },
    typeButton: {
      height: 50,
      justifyContent: "center",
      paddingHorizontal: 12,
      backgroundColor: theme.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.text + "30",
    },
    typeButtonText: {
      color: theme.text,
      fontSize: 16,
    },
    row: { flexDirection: "row", justifyContent: "space-between" },
    halfField: { flex: 1, marginRight: 8 },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      backgroundColor: theme.background,
      padding: 20,
      borderRadius: 12,
      minWidth: 280,
      maxHeight: "70%",
    },
    modalScroll: {
      maxHeight: 300,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 16,
      color: theme.text,
      textAlign: "center",
    },
    modalOption: {
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.text + "20",
    },
    modalOptionText: {
      fontSize: 16,
      color: theme.text,
      textAlign: "center",
    },
    modalCancel: {
      marginTop: 12,
      paddingVertical: 14,
    },
    modalCancelText: {
      fontSize: 16,
      color: theme.primary,
      textAlign: "center",
      fontWeight: "600",
    },
    dateButton: {
      height: 50,
      justifyContent: "center",
      paddingHorizontal: 12,
      backgroundColor: theme.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.text + "30",
    },
    dateButtonText: {
      color: form.start_at ? theme.text : theme.text + "60",
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Promo Code *</Text>
        <Input
          placeholder="e.g., SAVE10"
          value={form.promo_code}
          onChangeText={(val) => handleChange("promo_code", val.toUpperCase())}
          autoCapitalize="characters"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Title *</Text>
        <Input
          placeholder="e.g., 10% Off on All Orders"
          value={form.title}
          onChangeText={(val) => handleChange("title", val)}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Discount Type *</Text>
        <TouchableOpacity style={styles.typeButton} onPress={() => setShowTypeModal(true)}>
          <Text style={styles.typeButtonText}>
            {form.type === "PERCENTAGE" ? "Percentage (%)" : "Fixed Amount (₹)"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          {form.type === "PERCENTAGE" ? "Percentage (%) *" : "Fixed Amount (₹) *"}
        </Text>
        <Input
          placeholder={form.type === "PERCENTAGE" ? "e.g., 10" : "e.g., 100"}
          value={String(form.value)}
          keyboardType="numeric"
          onChangeText={(val) => handleChange("value", Number(val) || 0)}
        />
      </View>

      <View style={[styles.fieldContainer, styles.row]}>
        <View style={styles.halfField}>
          <Text style={styles.label}>Start Date *</Text>
          <TouchableOpacity style={styles.dateButton} onPress={openStartDatePicker}>
            <Text style={styles.dateButtonText}>{form.start_at || "Select date"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.halfField}>
          <Text style={styles.label}>End Date *</Text>
          <TouchableOpacity style={styles.dateButton} onPress={openEndDatePicker}>
            <Text style={styles.dateButtonText}>{form.end_at || "Select date"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Button
        title={loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Promotion" : "Create Promotion")}
        onPress={handleSubmit}
        disabled={loading || validateForm.length > 0}
        loading={loading}
      />

      {/* Type Selection Modal */}
      <Modal visible={showTypeModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Discount Type</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleTypeChange("PERCENTAGE")}
            >
              <Text style={styles.modalOptionText}>Percentage (%)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleTypeChange("FIXED")}
            >
              <Text style={styles.modalOptionText}>Fixed Amount (₹)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowTypeModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Start Date Modal */}
      <Modal visible={showStartModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Start Date</Text>
            <ScrollView style={styles.modalScroll}>
              {generateDateOptions().slice(0, 30).map((date) => (
                <TouchableOpacity
                  key={date.value}
                  style={styles.modalOption}
                  onPress={() => {
                    setTempDate(new Date(date.value));
                    confirmStartDate();
                  }}
                >
                  <Text style={styles.modalOptionText}>{date.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowStartModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* End Date Modal */}
      <Modal visible={showEndModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select End Date</Text>
            <ScrollView style={styles.modalScroll}>
              {generateDateOptions(new Date(form.start_at || Date.now())).slice(0, 60).map((date) => (
                <TouchableOpacity
                  key={date.value}
                  style={styles.modalOption}
                  onPress={() => {
                    setTempDate(new Date(date.value));
                    confirmEndDate();
                  }}
                >
                  <Text style={styles.modalOptionText}>{date.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowEndModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Helper function to generate date options
const generateDateOptions = (minDate?: Date): { value: string; label: string }[] => {
  const options: { value: string; label: string }[] = [];
  const today = minDate || new Date();
  
  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    options.push({
      value: dateStr,
      label: date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }),
    });
  }
  
  return options;
};

