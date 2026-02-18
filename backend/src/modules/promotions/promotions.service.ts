import { ApiError } from "../../utils/ApiError";
import { Warnings } from "../../utils/warnings";
import {
  createPromotionRepo,
  deletePromotionRepo,
  getPromotionByCodeRepo,
  getPromotionByIdRepo,
  getPromotionsRepo,
  incrementUsageAtomicRepo,
  togglePromotionStatusRepo,
  updatePromotionRepo,
} from "./promotions.repository";

import { ComboDiscount, CustomItemDiscount, Promotion, ValidatePromoInput } from "../../types/promotions.types";
import { validateCreatePromotion, validateId, validateUpdatePromotion } from "../../validations/promotions.validation";

/**
 * Convert ISO 8601 datetime string to MySQL-compatible format (YYYY-MM-DD HH:MM:SS)
 */
const convertToMySQLDateTime = (dateStr: string | undefined): string | undefined => {
  if (!dateStr) return dateStr;
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.warn("[SERVICE] Invalid date string:", dateStr);
      return dateStr;
    }
    
    // Format to datetime: YYYY-MM-DD HH:MM:SS
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error("[SERVICE] Error converting date:", error);
    return dateStr;
  }
};

/**
 * Prepare promotion data for database by converting datetime fields
 */
const preparePromotionDataForDB = (data: Partial<Promotion>): Promotion => {
  const convertedData = { ...data } as Promotion;
  
  if (convertedData.start_at) {
    convertedData.start_at = convertToMySQLDateTime(convertedData.start_at) as string;
  }
  
  if (convertedData.end_at) {
    convertedData.end_at = convertToMySQLDateTime(convertedData.end_at) as string;
  }
  
  return convertedData;
};

export const createPromotionService = async (data: Promotion) => {
  validateCreatePromotion(data);

  // Check for duplicate promo_code before inserting
  const existing = await getPromotionByCodeRepo(data.promo_code);
  if (existing) {
    throw new ApiError(`Promo code '${data.promo_code}' already exists. Please use a different code.`, 409);
  }

  const preparedData = preparePromotionDataForDB(data);
  return createPromotionRepo(preparedData);
};

export const getPromotionsService = async (filter?: string) => {
  return getPromotionsRepo(filter);
};

export const getPromotionByIdService = async (id: number) => {
  validateId(id);
  const promo = await getPromotionByIdRepo(id);
  if (!promo) throw new ApiError(Warnings.notFound("Promotion").message, 404);
  return promo;
};

export const updatePromotionService = async (id: number, data: Partial<Promotion>) => {
  if (isNaN(id)) {
    throw new ApiError("Invalid ID", 400);
  }
  
  validateId(id);
  validateUpdatePromotion(data);

  const existing = await getPromotionByIdRepo(id);
  if (!existing) {
    throw new ApiError(Warnings.notFound("Promotion").message, 404);
  }

  // If promo_code is being changed, ensure the new code isn't taken by another promotion
  if (data.promo_code && data.promo_code !== existing.promo_code) {
    const codeConflict = await getPromotionByCodeRepo(data.promo_code);
    if (codeConflict) {
      throw new ApiError(`Promo code '${data.promo_code}' already exists. Please use a different code.`, 409);
    }
  }

  const preparedData = preparePromotionDataForDB(data);
  return updatePromotionRepo(id, preparedData);
};

export const togglePromotionStatusService = async (id: number) => {
  validateId(id);
  
  const promo = await togglePromotionStatusRepo(id);
  if (!promo) throw new ApiError(Warnings.notFound("Promotion").message, 404);
  
  return promo;
};

export const deletePromotionService = async (id: number) => {
  validateId(id);
  
  const deleted = await deletePromotionRepo(id);
  if (!deleted) throw new ApiError(Warnings.notFound("Promotion").message, 404);
  
  return { success: true, message: "Promotion deleted successfully" };
};

/**
 * Calculate discount for CUSTOM_ITEMS type promotion
 */
export const calculateCustomItemsDiscount = (
  orderedItems: { item_id: string; quantity: number; price: number }[],
  customItems: CustomItemDiscount[]
): { item_id: string; discount: number }[] => {
  const discounts: { item_id: string; discount: number }[] = [];
  
  orderedItems.forEach((orderedItem) => {
    const customItem = customItems.find(ci => ci.item_id === orderedItem.item_id);
    if (customItem) {
      if (customItem.discount_type === "FIXED") {
        // Fixed discount per unit * quantity
        discounts.push({ 
          item_id: orderedItem.item_id, 
          discount: customItem.discount_value * orderedItem.quantity 
        });
      } else {
        // Percentage discount
        const itemTotal = orderedItem.price * orderedItem.quantity;
        discounts.push({ 
          item_id: orderedItem.item_id, 
          discount: (itemTotal * customItem.discount_value) / 100 
        });
      }
    }
  });
  
  return discounts;
};

/**
 * Calculate combo discounts
 */
export const calculateComboDiscount = (
  orderedItems: { item_id: string; quantity: number; price: number }[],
  combos: ComboDiscount[]
): { combo_name: string; discount: number }[] => {
  const comboDiscounts: { combo_name: string; discount: number }[] = [];
  const orderedItemIds = orderedItems.map(i => i.item_id);
  
  combos.forEach((combo) => {
    // Check if all required items are in the order
    const hasAllItems = combo.item_ids.every(id => orderedItemIds.includes(id));
    
    if (hasAllItems) {
      // Calculate total price of combo items
      let comboTotal = 0;
      combo.item_ids.forEach(itemId => {
        const orderedItem = orderedItems.find(i => i.item_id === itemId);
        if (orderedItem) {
          comboTotal += orderedItem.price * orderedItem.quantity;
        }
      });
      
      let discount = 0;
      if (combo.discount_type === "FIXED") {
        discount = combo.discount_value;
      } else {
        discount = (comboTotal * combo.discount_value) / 100;
      }
      
      comboDiscounts.push({ combo_name: combo.combo_name, discount });
    }
  });
  
  return comboDiscounts;
};

export const validatePromotionService = async (
  data: ValidatePromoInput & { check_only?: boolean }
) => {
  const { promo_code, order_amount, ordered_items, check_only } = data;

  if (!promo_code || order_amount == null || Number.isNaN(order_amount))
    throw new ApiError("Promo code & order amount required", 400);
  if (order_amount < 0) throw new ApiError("Order amount must be non-negative", 400);

  const promo = await getPromotionByCodeRepo(promo_code);
  if (!promo) throw new ApiError("Invalid promo code", 404);
  if (promo.status !== "ACTIVE")
    throw new ApiError("Promotion inactive", 400);

  const now = new Date();
  if (now < new Date(promo.start_at) || now > new Date(promo.end_at))
    throw new ApiError("Promotion expired or not started", 400);

  // Check minimum order amount (skip for check_only mode since order_amount is a dummy value)
  if (!check_only && promo.min_order_amount && order_amount < promo.min_order_amount) {
    throw new ApiError(`Minimum order amount is ₹${promo.min_order_amount}`, 400);
  }

  let discount = 0;
  let discountBreakdown: any = null;

  if (promo.type === "CUSTOM_ITEMS") {
    // For CUSTOM_ITEMS type, we need ordered items to calculate discount
    if (!ordered_items || ordered_items.length === 0) {
      throw new ApiError("CUSTOM_ITEMS promotions require ordered items. Please provide cart items.", 400);
    }

    const customItems = promo.custom_items || [];
    const combos = promo.combos || [];

    // Calculate item-specific discounts
    const itemDiscounts = calculateCustomItemsDiscount(ordered_items, customItems);
    
    // Calculate combo discounts
    const comboDiscounts = calculateComboDiscount(ordered_items, combos);

    // Sum up all discounts
    discount = itemDiscounts.reduce((sum, d) => sum + d.discount, 0) +
               comboDiscounts.reduce((sum, d) => sum + d.discount, 0);

    discountBreakdown = {
      item_discounts: itemDiscounts,
      combo_discounts: comboDiscounts,
    };
  } else if (promo.type === "PERCENTAGE") {
    discount = (order_amount * promo.value) / 100;
  } else {
    // FIXED
    discount = promo.value;
  }

  // Apply max discount cap if set
  if (promo.max_discount_amount && discount > promo.max_discount_amount) {
    discount = promo.max_discount_amount;
  }

  const final_amount = Math.max(order_amount - discount, 0);

  // Only increment usage when actually applying the promotion (not for check_only validation)
  if (!check_only) {
    try {
      await incrementUsageAtomicRepo(promo.id);
    } catch (error) {
      if (error instanceof Error && error.message === "Usage limit exceeded") {
        throw new ApiError("Promotion usage limit exceeded", 400);
      }
      throw error;
    }
  }

  return {
    original_amount: order_amount,
    discount,
    final_amount,
    discount_breakdown: discountBreakdown,
  };
};

