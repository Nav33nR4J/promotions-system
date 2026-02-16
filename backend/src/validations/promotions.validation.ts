import { ApiError } from "../utils/ApiError";
import { Promotion } from "../types/promotions.types";

export const validateCreatePromotion = (data: Promotion) => {
  if (!data.promo_code) throw new ApiError("Promo code required", 400);
  if (!data.title) throw new ApiError("Title required", 400);
  if (!data.type) throw new ApiError("Discount type required", 400);
  if (!["PERCENTAGE", "FIXED", "CUSTOM"].includes(data.type)) {
    throw new ApiError("Invalid discount type. Must be PERCENTAGE, FIXED, or CUSTOM", 400);
  }
  
  // Validate CUSTOM type specific fields
  if (data.type === "CUSTOM") {
    if (!data.custom_items || !Array.isArray(data.custom_items) || data.custom_items.length === 0) {
      throw new ApiError("Custom items are required for CUSTOM promotion type", 400);
    }
    
    // Validate each custom item
    data.custom_items.forEach((item, index) => {
      if (!item.item_id) {
        throw new ApiError(`Item ID required for custom item ${index + 1}`, 400);
      }
      if (!["PERCENTAGE", "FIXED"].includes(item.discount_type)) {
        throw new ApiError(`Invalid discount type for item ${index + 1}`, 400);
      }
      if (!item.discount_value || item.discount_value <= 0) {
        throw new ApiError(`Discount value must be greater than 0 for item ${index + 1}`, 400);
      }
    });
    
    // Validate combos if present
    if (data.combos && Array.isArray(data.combos)) {
      data.combos.forEach((combo, index) => {
        if (!combo.item_ids || !Array.isArray(combo.item_ids) || combo.item_ids.length < 2) {
          throw new ApiError(`Combo ${index + 1} must have at least 2 items`, 400);
        }
        if (!["PERCENTAGE", "FIXED"].includes(combo.discount_type)) {
          throw new ApiError(`Invalid discount type for combo ${index + 1}`, 400);
        }
        if (!combo.discount_value || combo.discount_value <= 0) {
          throw new ApiError(`Discount value must be greater than 0 for combo ${index + 1}`, 400);
        }
      });
    }
  } else {
    // For PERCENTAGE and FIXED types
    if (!data.value || data.value <= 0)
      throw new ApiError("Value must be greater than 0", 400);
  }
  
  if (!data.start_at) throw new ApiError("Start date required", 400);
  if (!data.end_at) throw new ApiError("End date required", 400);
  if (new Date(data.start_at) >= new Date(data.end_at))
    throw new ApiError("Start date must be before end date", 400);
};

export const validateUpdatePromotion = (data: Partial<Promotion>) => {
  if (data.type && !["PERCENTAGE", "FIXED", "CUSTOM"].includes(data.type)) {
    throw new ApiError("Invalid discount type. Must be PERCENTAGE, FIXED, or CUSTOM", 400);
  }
  
  // Validate CUSTOM type specific fields
  if (data.type === "CUSTOM" || (data.custom_items !== undefined)) {
    const customItems = data.custom_items;
    if (customItems !== undefined) {
      if (!Array.isArray(customItems) || customItems.length === 0) {
        throw new ApiError("Custom items must be a non-empty array", 400);
      }
      
      customItems.forEach((item, index) => {
        if (!item.item_id) {
          throw new ApiError(`Item ID required for custom item ${index + 1}`, 400);
        }
        if (!["PERCENTAGE", "FIXED"].includes(item.discount_type)) {
          throw new ApiError(`Invalid discount type for item ${index + 1}`, 400);
        }
        if (!item.discount_value || item.discount_value <= 0) {
          throw new ApiError(`Discount value must be greater than 0 for item ${index + 1}`, 400);
        }
      });
    }
  }
  
  if (data.combos !== undefined && Array.isArray(data.combos)) {
    data.combos.forEach((combo, index) => {
      if (!combo.item_ids || !Array.isArray(combo.item_ids) || combo.item_ids.length < 2) {
        throw new ApiError(`Combo ${index + 1} must have at least 2 items`, 400);
      }
      if (!["PERCENTAGE", "FIXED"].includes(combo.discount_type)) {
        throw new ApiError(`Invalid discount type for combo ${index + 1}`, 400);
      }
      if (!combo.discount_value || combo.discount_value <= 0) {
        throw new ApiError(`Discount value must be greater than 0 for combo ${index + 1}`, 400);
      }
    });
  }
  
  // Only validate value for non-CUSTOM types
  // For CUSTOM type, value should be 0 since discounts are per-item
  if (data.value !== undefined && data.value <= 0 && data.type !== "CUSTOM") {
    throw new ApiError("Value must be greater than 0", 400);
  }
  if (data.start_at && data.end_at && new Date(data.start_at) >= new Date(data.end_at)) {
    throw new ApiError("Start date must be before end date", 400);
  }
  if (data.promo_code && !data.promo_code.trim()) {
    throw new ApiError("Promo code cannot be empty", 400);
  }
  if (data.title && !data.title.trim()) {
    throw new ApiError("Title cannot be empty", 400);
  }
};

export const validateId = (id: number) => {
  if (!id || isNaN(id) || id <= 0) throw new ApiError("Invalid ID", 400);
};
