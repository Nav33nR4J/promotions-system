export type PromoType = "PERCENTAGE" | "FIXED" | "CUSTOM";
export type PromoStatus = "ACTIVE" | "INACTIVE";

/**
 * Individual item discount for CUSTOM promotions
 */
export interface CustomItemDiscount {
  item_id: string;
  discount_type: "PERCENTAGE" | "FIXED";
  discount_value: number;
}

/**
 * Combo discount for CUSTOM promotions
 * Applied when all items in the combo are purchased together
 */
export interface ComboDiscount {
  item_ids: string[];
  discount_type: "PERCENTAGE" | "FIXED";
  discount_value: number;
}

/**
 * Custom promotion data structure
 */
export interface CustomPromotionData {
  items: CustomItemDiscount[];
  combos: ComboDiscount[];
}

export interface Promotion {
  id?: number;
  promo_code: string;
  title: string;
  type: PromoType;
  value: number;
  start_at: string;
  end_at: string;
  status?: PromoStatus;
  usage_limit?: number | null;
  usage_count?: number;
  // Custom promotion fields
  custom_items?: CustomItemDiscount[];
  combos?: ComboDiscount[];
}

export interface ValidatePromoInput {
  promo_code: string;
  order_amount: number;
}
