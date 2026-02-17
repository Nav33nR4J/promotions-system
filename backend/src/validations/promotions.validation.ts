import { ApiError } from "../utils/ApiError";
import { Promotion } from "../types/promotions.types";
import { Warnings } from "../utils/warnings";

export const validateCreatePromotion = (data: Promotion) => {
  const promoCodeRequired = Warnings.validation.promoCodeRequired();
  if (!data.promo_code) throw new ApiError(promoCodeRequired.message, 400);
  
  const titleRequired = Warnings.validation.titleRequired();
  if (!data.title) throw new ApiError(titleRequired.message, 400);
  
  const invalidDiscountType = Warnings.validation.invalidDiscountType();
  if (!data.type) throw new ApiError(invalidDiscountType.message, 400);
  if (!["PERCENTAGE", "FIXED", "CUSTOM"].includes(data.type)) {
    throw new ApiError(invalidDiscountType.message, 400);
  }
  
  // Validate CUSTOM type specific fields
  if (data.type === "CUSTOM") {
    const customItemsRequired = Warnings.validation.customItemsRequired();
    if (!data.custom_items || !Array.isArray(data.custom_items) || data.custom_items.length === 0) {
      throw new ApiError(customItemsRequired.message, 400);
    }
    
    // Validate each custom item
    data.custom_items.forEach((item, index) => {
      const itemIdRequired = Warnings.validation.itemIdRequired(index);
      if (!item.item_id) {
        throw new ApiError(itemIdRequired.message, 400);
      }
      const invalidItemDiscountType = Warnings.validation.invalidItemDiscountType(index);
      if (!["PERCENTAGE", "FIXED"].includes(item.discount_type)) {
        throw new ApiError(invalidItemDiscountType.message, 400);
      }
      const itemDiscountValueRequired = Warnings.validation.itemDiscountValueRequired(index);
      if (!item.discount_value || item.discount_value <= 0) {
        throw new ApiError(itemDiscountValueRequired.message, 400);
      }
    });
    
    // Validate combos if present
    if (data.combos && Array.isArray(data.combos)) {
      data.combos.forEach((combo, index) => {
        const comboMinItems = Warnings.validation.comboMinItems(index);
        if (!combo.item_ids || !Array.isArray(combo.item_ids) || combo.item_ids.length < 2) {
          throw new ApiError(comboMinItems.message, 400);
        }
        const invalidComboDiscountType = Warnings.validation.invalidComboDiscountType(index);
        if (!["PERCENTAGE", "FIXED"].includes(combo.discount_type)) {
          throw new ApiError(invalidComboDiscountType.message, 400);
        }
        const comboDiscountValueRequired = Warnings.validation.comboDiscountValueRequired(index);
        if (!combo.discount_value || combo.discount_value <= 0) {
          throw new ApiError(comboDiscountValueRequired.message, 400);
        }
      });
    }
  } else {
    // For PERCENTAGE and FIXED types
    const valueMustBePositive = Warnings.validation.valueMustBePositive();
    if (!data.value || data.value <= 0)
      throw new ApiError(valueMustBePositive.message, 400);
  }
  
  const startDateRequired = Warnings.validation.startDateRequired();
  if (!data.start_at) throw new ApiError(startDateRequired.message, 400);
  
  const endDateRequired = Warnings.validation.endDateRequired();
  if (!data.end_at) throw new ApiError(endDateRequired.message, 400);
  
  const invalidDateRange = Warnings.validation.invalidDateRange();
  if (new Date(data.start_at) >= new Date(data.end_at))
    throw new ApiError(invalidDateRange.message, 400);
};

export const validateUpdatePromotion = (data: Partial<Promotion>) => {
  const invalidDiscountType = Warnings.validation.invalidDiscountType();
  if (data.type && !["PERCENTAGE", "FIXED", "CUSTOM"].includes(data.type)) {
    throw new ApiError(invalidDiscountType.message, 400);
  }
  
  // Validate CUSTOM type specific fields
  if (data.type === "CUSTOM" || (data.custom_items !== undefined)) {
    const customItems = data.custom_items;
    if (customItems !== undefined) {
      const customItemsEmpty = Warnings.validation.customItemsEmpty();
      if (!Array.isArray(customItems) || customItems.length === 0) {
        throw new ApiError(customItemsEmpty.message, 400);
      }
      
      customItems.forEach((item, index) => {
        const itemIdRequired = Warnings.validation.itemIdRequired(index);
        if (!item.item_id) {
          throw new ApiError(itemIdRequired.message, 400);
        }
        const invalidItemDiscountType = Warnings.validation.invalidItemDiscountType(index);
        if (!["PERCENTAGE", "FIXED"].includes(item.discount_type)) {
          throw new ApiError(invalidItemDiscountType.message, 400);
        }
        const itemDiscountValueRequired = Warnings.validation.itemDiscountValueRequired(index);
        if (!item.discount_value || item.discount_value <= 0) {
          throw new ApiError(itemDiscountValueRequired.message, 400);
        }
      });
    }
  }
  
  if (data.combos !== undefined && Array.isArray(data.combos)) {
    data.combos.forEach((combo, index) => {
      const comboMinItems = Warnings.validation.comboMinItems(index);
      if (!combo.item_ids || !Array.isArray(combo.item_ids) || combo.item_ids.length < 2) {
        throw new ApiError(comboMinItems.message, 400);
      }
      const invalidComboDiscountType = Warnings.validation.invalidComboDiscountType(index);
      if (!["PERCENTAGE", "FIXED"].includes(combo.discount_type)) {
        throw new ApiError(invalidComboDiscountType.message, 400);
      }
      const comboDiscountValueRequired = Warnings.validation.comboDiscountValueRequired(index);
      if (!combo.discount_value || combo.discount_value <= 0) {
        throw new ApiError(comboDiscountValueRequired.message, 400);
      }
    });
  }
  
  // Only validate value for non-CUSTOM types
  // For CUSTOM type, value should be 0 since discounts are per-item
  if (data.value !== undefined && data.value <= 0 && data.type !== "CUSTOM") {
    const valueMustBePositive = Warnings.validation.valueMustBePositive();
    throw new ApiError(valueMustBePositive.message, 400);
  }
  
  const invalidDateRange = Warnings.validation.invalidDateRange();
  if (data.start_at && data.end_at && new Date(data.start_at) >= new Date(data.end_at)) {
    throw new ApiError(invalidDateRange.message, 400);
  }
  
  const promoCodeEmpty = Warnings.validation.promoCodeEmpty();
  if (data.promo_code && !data.promo_code.trim()) {
    throw new ApiError(promoCodeEmpty.message, 400);
  }
  
  const titleEmpty = Warnings.validation.titleEmpty();
  if (data.title && !data.title.trim()) {
    throw new ApiError(titleEmpty.message, 400);
  }
};

export const validateId = (id: number) => {
  const invalidId = Warnings.validation.invalidId();
  if (!id || isNaN(id) || id <= 0) throw new ApiError(invalidId.message, 400);
};
