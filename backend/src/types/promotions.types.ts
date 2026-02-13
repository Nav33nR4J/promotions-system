export type PromoType = "PERCENTAGE" | "FIXED";
export type PromoStatus = "ACTIVE" | "INACTIVE";

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
}

export interface ValidatePromoInput {
  promo_code: string;
  order_amount: number;
}
