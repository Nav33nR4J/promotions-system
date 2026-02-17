
import React, { useState, useMemo } from "react";
import { View, Alert, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Checkbox } from "../atoms/Checkbox";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";
import { Text } from "../atoms/Text";
import { Promotion, CustomItemDiscount, ComboDiscount } from "../../redux/slices/promotionsSlice";
import { useDispatch } from "react-redux";
import { createPromotion, updatePromotion } from "../../redux/slices/promotionsSlice";
import { getErrorMessage } from "../../utils/errors";
import { useTheme } from "../../theme/ThemeProvider";
import { menuItems, MenuItem, getMenuItemsByCategory } from "../../data/menu";
import { componentStyles, getPromotionFormThemeStyles } from "../../theme/styles";

interface PromotionFormProps {
  promotion?: Promotion;
  onSuccess?: () => void;
}

type PromoType = "PERCENTAGE" | "FIXED" | "CUSTOM";

const getTodayDate = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
};

const getFutureDate = (daysAhead: number = 30): string => {
  const future = new Date();
  future.setDate(future.getDate() + daysAhead);
  return `${future.getFullYear()}-${String(future.getMonth() + 1).padStart(2, "0")}-${String(future.getDate()).padStart(2, "0")}`;
};

// Helper function to safely parse custom_items and combos from API response
// Handles cases where data might be JSON string, undefined, or malformed
const safeParseArray = <T,>(data: any): T[] => {
  if (Array.isArray(data)) {
    return data;
  }
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export const PromotionForm = ({ promotion, onSuccess }: PromotionFormProps) => {
  const dispatch = useDispatch<any>();
  const { theme } = useTheme();
  const formThemeStyles = getPromotionFormThemeStyles(theme);
  const localstyles = componentStyles.promotionForm;
  
  // Initialize form with promotion data if editing
  const [form, setForm] = useState<Promotion>(() => {
    if (promotion) {
      return {
        promo_code: promotion.promo_code || "",
        title: promotion.title || "",
        type: promotion.type || "PERCENTAGE",
        value: typeof promotion.value === 'number' ? promotion.value : Number(promotion.value) || 0,
        start_at: promotion.start_at || getTodayDate(),
        end_at: promotion.end_at || getFutureDate(30),
        status: promotion.status || "ACTIVE",
        custom_items: safeParseArray<CustomItemDiscount>(promotion.custom_items),
        combos: safeParseArray<ComboDiscount>(promotion.combos),
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
      custom_items: [],
      combos: [],
    };
  });
  
  const isEditing = !!promotion?.id;
  const [loading, setLoading] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showComboModal, setShowComboModal] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  
  // For combo creation
  const [comboItems, setComboItems] = useState<string[]>([]);
  const [comboDiscountType, setComboDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [comboDiscountValue, setComboDiscountValue] = useState<string>("");

  const menuByCategory = getMenuItemsByCategory();
  
  // Get selected items
  const selectedItemIds = form.custom_items?.map(item => item.item_id) || [];
  const selectedItems = menuItems.filter(item => selectedItemIds.includes(item.id));

  const handleChange = (key: keyof Promotion, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleTypeChange = (value: PromoType) => {
    handleChange("type", value);
    setShowTypeModal(false);
  };

  // Handle menu item selection for individual discount
  const toggleMenuItem = (itemId: string) => {
    const currentItems = form.custom_items || [];
    const existingIndex = currentItems.findIndex(item => item.item_id === itemId);
    
    if (existingIndex >= 0) {
      // Remove item
      const newItems = currentItems.filter(item => item.item_id !== itemId);
      // Also remove from any combos
      const newCombos = (form.combos || []).map(combo => ({
        ...combo,
        item_ids: combo.item_ids.filter(id => id !== itemId)
      })).filter(combo => combo.item_ids.length >= 2);
      
      setForm(prev => ({ ...prev, custom_items: newItems, combos: newCombos }));
    } else {
      // Add new item with default values
      const newItem: CustomItemDiscount = {
        item_id: itemId,
        discount_type: "PERCENTAGE",
        discount_value: 0,
      };
      setForm(prev => ({ ...prev, custom_items: [...currentItems, newItem] }));
    }
  };

  // Update individual item discount
  const updateItemDiscount = (itemId: string, field: 'discount_type' | 'discount_value', value: string | number) => {
    const currentItems = form.custom_items || [];
    const newItems = currentItems.map(item => {
      if (item.item_id === itemId) {
        return {
          ...item,
          [field]: field === 'discount_value' ? Number(value) : value,
        };
      }
      return item;
    });
    setForm(prev => ({ ...prev, custom_items: newItems }));
  };

  // Add combo
  const addCombo = () => {
    if (comboItems.length < 2) {
      Alert.alert("Error", "Select at least 2 items for a combo");
      return;
    }
    if (!comboDiscountValue || Number(comboDiscountValue) <= 0) {
      Alert.alert("Error", "Enter a valid discount value");
      return;
    }

    const newCombo: ComboDiscount = {
      item_ids: [...comboItems],
      discount_type: comboDiscountType,
      discount_value: Number(comboDiscountValue),
    };

    setForm(prev => ({
      ...prev,
      combos: [...(prev.combos || []), newCombo]
    }));

    // Reset combo form
    setComboItems([]);
    setComboDiscountValue("");
    setComboDiscountType("PERCENTAGE");
    setShowComboModal(false);
  };

  // Remove combo
  const removeCombo = (index: number) => {
    const newCombos = (form.combos || []).filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, combos: newCombos }));
  };

  // Toggle item for combo selection
  const toggleComboItem = (itemId: string) => {
    if (comboItems.includes(itemId)) {
      setComboItems(comboItems.filter(id => id !== itemId));
    } else {
      setComboItems([...comboItems, itemId]);
    }
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
    
    if (form.type === "CUSTOM") {
      // Validate custom items
      if (!form.custom_items || form.custom_items.length === 0) {
        errors.push("Select at least one menu item for CUSTOM promotion");
      } else {
        // Check all selected items have valid discounts
        form.custom_items.forEach((item, index) => {
          const menuItem = menuItems.find(m => m.id === item.item_id);
          if (!item.discount_value || item.discount_value <= 0) {
            errors.push(`Enter valid discount for ${menuItem?.name || 'item ' + (index + 1)}`);
          }
        });
      }
      
      // Validate combos
      if (form.combos && form.combos.length > 0) {
        form.combos.forEach((combo, index) => {
          if (combo.item_ids.length < 2) {
            errors.push(`Combo ${index + 1} must have at least 2 items`);
          }
          if (!combo.discount_value || combo.discount_value <= 0) {
            errors.push(`Enter valid discount for combo ${index + 1}`);
          }
        });
      }
    } else {
      // For PERCENTAGE and FIXED types
      if (!form.value || form.value <= 0) {
        errors.push("Value must be greater than 0");
      }
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
      // Prepare the data based on type
      const submitData: any = {
        promo_code: form.promo_code,
        title: form.title,
        type: form.type,
        start_at: form.start_at,
        end_at: form.end_at,
        status: form.status,
      };

      if (form.type === "CUSTOM") {
        submitData.value = 0;
        submitData.custom_items = form.custom_items;
        submitData.combos = form.combos;
      } else {
        submitData.value = form.value;
      }

      if (isEditing && promotion?.id) {
        const promotionId = typeof promotion.id === 'number' ? promotion.id : Number(promotion.id);
        await dispatch(updatePromotion({ id: promotionId, data: submitData })).unwrap();
        Alert.alert("Success", "Promotion updated successfully!", [
          { text: "OK", onPress: () => {
            onSuccess?.();
          }}
        ]);
      } else {
        await dispatch(createPromotion(submitData)).unwrap();
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
              custom_items: [],
              combos: [],
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

  const getTypeLabel = (type: PromoType): string => {
    switch (type) {
      case "PERCENTAGE": return "Percentage (%)";
      case "FIXED": return "Fixed Amount (₹)";
      case "CUSTOM": return "Custom (Menu Items)";
      default: return "";
    }
  };

  const styles = {
    ...localstyles,
    ...formThemeStyles,
    label: { ...localstyles.label, ...formThemeStyles.label },
    typeButton: { ...localstyles.typeButton, ...formThemeStyles.typeButton },
    typeButtonText: { ...localstyles.typeButtonText, ...formThemeStyles.typeButtonText },
    dateButton: { ...localstyles.dateButton, ...formThemeStyles.dateButton },
    dateButtonText: { ...localstyles.dateButtonText, ...formThemeStyles.dateButtonText },
    modalContainer: { ...localstyles.modalContainer, ...formThemeStyles.modalContainer },
    modalContent: { ...localstyles.modalContent, ...formThemeStyles.modalContent },
    modalTitle: { ...localstyles.modalTitle, ...formThemeStyles.modalTitle },
    modalOption: { ...localstyles.modalOption, ...formThemeStyles.modalOption },
    modalOptionText: { ...localstyles.modalOptionText, ...formThemeStyles.modalOptionText },
    modalCancelText: { ...localstyles.modalCancelText, ...formThemeStyles.modalCancelText },
    menuItemRow: { ...localstyles.menuItemRow, ...formThemeStyles.menuItemRow },
    menuItemName: { ...localstyles.menuItemName, ...formThemeStyles.menuItemName },
    menuItemPrice: { ...localstyles.menuItemPrice, ...formThemeStyles.menuItemPrice },
    categoryTitle: { ...localstyles.categoryTitle, ...formThemeStyles.categoryTitle },
    selectedItemContainer: { ...localstyles.selectedItemContainer, ...formThemeStyles.selectedItemContainer },
    selectedItemName: { ...localstyles.selectedItemName, ...formThemeStyles.selectedItemName },
    discountTypeButton: { ...localstyles.discountTypeButton, ...formThemeStyles.discountTypeButton },
    discountTypeText: { ...localstyles.discountTypeText, ...formThemeStyles.discountTypeText },
    discountInput: { ...localstyles.discountInput, ...formThemeStyles.discountInput },
    comboContainer: { ...localstyles.comboContainer, ...formThemeStyles.comboContainer },
    comboItems: { ...localstyles.comboItems, ...formThemeStyles.comboItems },
    comboDiscount: { ...localstyles.comboDiscount, ...formThemeStyles.comboDiscount },
    addComboButton: { ...localstyles.addComboButton, ...formThemeStyles.addComboButton },
    addComboText: { ...localstyles.addComboText, ...formThemeStyles.addComboText },
    comboItemText: { ...localstyles.comboItemText, ...formThemeStyles.comboItemText },
    sectionTitle: { ...localstyles.sectionTitle, ...formThemeStyles.sectionTitle },
  } as const;

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
            {getTypeLabel(form.type as PromoType)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Show value input for PERCENTAGE and FIXED */}
      {form.type !== "CUSTOM" && (
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
      )}

      {/* CUSTOM Type: Menu Item Selection */}
      {form.type === "CUSTOM" && (
        <>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Select Menu Items *</Text>
            <TouchableOpacity 
              style={[styles.typeButton, { alignItems: 'center' }]} 
              onPress={() => setShowMenuModal(true)}
            >
              <Text style={styles.typeButtonText}>
                {selectedItemIds.length > 0 
                  ? `${selectedItemIds.length} item(s) selected` 
                  : "Tap to select menu items"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Selected Items with Discount Settings */}
          {selectedItems.length > 0 && (
            <View style={styles.fieldContainer}>
              <Text style={styles.sectionTitle}>Item Discounts</Text>
              {form.custom_items?.map((item, index) => {
                const menuItem = menuItems.find(m => m.id === item.item_id);
                return (
                  <View key={item.item_id} style={styles.selectedItemContainer}>
                    <View style={styles.selectedItemHeader}>
                      <Text style={styles.selectedItemName}>{menuItem?.name}</Text>
                      <Text style={styles.menuItemPrice}>₹{menuItem?.price}</Text>
                    </View>
                    <View style={styles.selectedItemDiscount}>
                      <TouchableOpacity
                        style={[
                          styles.discountTypeButton,
                          item.discount_type === "PERCENTAGE" && styles.discountTypeButtonActive
                        ]}
                        onPress={() => updateItemDiscount(item.item_id, "discount_type", "PERCENTAGE")}
                      >
                        <Text style={styles.discountTypeText}>%</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.discountTypeButton,
                          item.discount_type === "FIXED" && styles.discountTypeButtonActive
                        ]}
                        onPress={() => updateItemDiscount(item.item_id, "discount_type", "FIXED")}
                      >
                        <Text style={styles.discountTypeText}>₹</Text>
                      </TouchableOpacity>
                      <Input
                        style={styles.discountInput}
                        placeholder={item.discount_type === "PERCENTAGE" ? "%" : "₹"}
                        value={String(item.discount_value)}
                        keyboardType="numeric"
                        onChangeText={(val) => updateItemDiscount(item.item_id, "discount_value", val)}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Combo Section */}
          <View style={styles.fieldContainer}>
            <Text style={styles.sectionTitle}>Combo Discounts</Text>
            
            {/* Existing Combos */}
            {form.combos?.map((combo, index) => {
              const comboItemsList = menuItems.filter(m => combo.item_ids.includes(m.id));
              return (
                <View key={index} style={styles.comboContainer}>
                  <View style={styles.comboHeader}>
                    <Text style={styles.comboItems}>
                      {comboItemsList.map(i => i.name).join(" + ")}
                    </Text>
                    <TouchableOpacity 
                      style={styles.comboRemoveButton}
                      onPress={() => removeCombo(index)}
                    >
                      <Text style={styles.comboRemoveText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.comboDiscount}>
                    {combo.discount_type === "PERCENTAGE" 
                      ? `${combo.discount_value}% OFF` 
                      : `₹${combo.discount_value} OFF`}
                  </Text>
                </View>
              );
            })}

            {/* Add Combo Button */}
            {selectedItemIds.length >= 2 && (
              <TouchableOpacity 
                style={styles.addComboButton}
                onPress={() => setShowComboModal(true)}
              >
                <Text style={styles.addComboText}>+ Add Combo Discount</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}

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
              style={styles.modalOption}
              onPress={() => handleTypeChange("CUSTOM")}
            >
              <Text style={styles.modalOptionText}>Custom (Menu Items)</Text>
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

      {/* Menu Item Selection Modal */}
      <Modal visible={showMenuModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Menu Items</Text>
            <ScrollView style={styles.modalScroll}>
              {Object.entries(menuByCategory).map(([category, items]) => (
                <View key={category}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  {items.map((item: MenuItem) => {
                    const isSelected = selectedItemIds.includes(item.id);
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.menuItemRow}
                        onPress={() => toggleMenuItem(item.id)}
                      >
                        <Checkbox
                          value={isSelected}
                          onValueChange={() => toggleMenuItem(item.id)}
                          color={theme.primary}
                          style={styles.menuItemCheckbox}
                        />
                        <View style={styles.menuItemInfo}>
                          <Text style={styles.menuItemName}>{item.name}</Text>
                          <Text style={styles.menuItemPrice}>₹{item.price}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowMenuModal(false)}
            >
              <Text style={styles.modalCancelText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Combo Creation Modal */}
      <Modal visible={showComboModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Combo</Text>
            <Text style={[styles.label, { marginBottom: 8 }]}>Select 2+ items for combo:</Text>
            <ScrollView style={styles.modalScroll}>
              {selectedItems.map((item) => {
                const isSelected = comboItems.includes(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.comboItemRow}
                    onPress={() => toggleComboItem(item.id)}
                  >
                    <Checkbox
                      value={isSelected}
                      onValueChange={() => toggleComboItem(item.id)}
                      color={theme.primary}
                    />
                    <Text style={styles.comboItemText}>{item.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            
            {comboItems.length >= 2 && (
              <View style={{ marginTop: 16 }}>
                <Text style={[styles.label, { marginBottom: 8 }]}>Combo Discount:</Text>
                <View style={{ flexDirection: "row", marginBottom: 12 }}>
                  <TouchableOpacity
                    style={[
                      styles.discountTypeButton,
                      { flex: 1, alignItems: 'center' },
                      comboDiscountType === "PERCENTAGE" && styles.discountTypeButtonActive
                    ]}
                    onPress={() => setComboDiscountType("PERCENTAGE")}
                  >
                    <Text style={styles.discountTypeText}>Percentage (%)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.discountTypeButton,
                      { flex: 1, alignItems: 'center', marginLeft: 8 },
                      comboDiscountType === "FIXED" && styles.discountTypeButtonActive
                    ]}
                    onPress={() => setComboDiscountType("FIXED")}
                  >
                    <Text style={styles.discountTypeText}>Fixed (₹)</Text>
                  </TouchableOpacity>
                </View>
                <Input
                  placeholder={comboDiscountType === "PERCENTAGE" ? "e.g., 20" : "e.g., 50"}
                  value={comboDiscountValue}
                  keyboardType="numeric"
                  onChangeText={setComboDiscountValue}
                  style={{ marginBottom: 12 }}
                />
              </View>
            )}

            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <TouchableOpacity
                style={[styles.modalCancel, { flex: 1, marginRight: 8 }]}
                onPress={() => {
                  setComboItems([]);
                  setComboDiscountValue("");
                  setShowComboModal(false);
                }}
              >
                <Text style={[styles.modalCancelText, { textAlign: 'center' }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalCancel, 
                  { flex: 1, backgroundColor: theme.primary, borderRadius: 8 }
                ]}
                onPress={addCombo}
              >
                <Text style={[styles.modalCancelText, { color: '#fff' }]}>Add Combo</Text>
              </TouchableOpacity>
            </View>
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

