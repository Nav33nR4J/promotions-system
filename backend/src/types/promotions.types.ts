export type PromoType = "PERCENTAGE" | "FIXED" | "CUSTOM_ITEMS";
export type PromoStatus = "ACTIVE" | "INACTIVE";

/**
 * Individual item discount for CUSTOM_ITEMS promotions
 */
export interface CustomItemDiscount {
  item_id: string;
  item_name: string;
  discount_type: "PERCENTAGE" | "FIXED";
  discount_value: number;
}

/**
 * Combo discount for CUSTOM_ITEMS promotions
 * Applied when all items in the combo are purchased together
 */
export interface ComboDiscount {
  combo_name: string;
  item_ids: string[];
  item_names: string[];
  discount_type: "PERCENTAGE" | "FIXED";
  discount_value: number;
  min_items_required: number;
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
  min_order_amount: number;
  max_discount_amount?: number | null;
  // Custom promotion fields
  custom_items?: CustomItemDiscount[];
  combos?: ComboDiscount[];
  description?: string;
}

export interface ValidatePromoInput {
  promo_code: string;
  order_amount: number;
  ordered_items?: {
    item_id: string;
    quantity: number;
    price: number;
  }[];
  /** When true, skips usage increment and min_order_amount check (for admin validation checks) */
  check_only?: boolean;
}

