import { ApiError } from "../utils/ApiError";
import { Promotion } from "../types/promotions.types";

export const validateCreatePromotion = (data: Promotion) => {
  if (!data.promo_code) throw new ApiError("Promo code required", 400);
  if (!data.title) throw new ApiError("Title required", 400);
  if (!data.type) throw new ApiError("Discount type required", 400);
  if (!["PERCENTAGE", "FIXED"].includes(data.type)) {
    throw new ApiError("Invalid discount type. Must be PERCENTAGE or FIXED", 400);
  }
  if (!data.value || data.value <= 0)
    throw new ApiError("Value must be greater than 0", 400);
  if (!data.start_at) throw new ApiError("Start date required", 400);
  if (!data.end_at) throw new ApiError("End date required", 400);
  if (new Date(data.start_at) >= new Date(data.end_at))
    throw new ApiError("Start date must be before end date", 400);
};

export const validateUpdatePromotion = (data: Partial<Promotion>) => {
  if (data.type && !["PERCENTAGE", "FIXED"].includes(data.type)) {
    throw new ApiError("Invalid discount type. Must be PERCENTAGE or FIXED", 400);
  }
  if (data.value !== undefined && data.value <= 0) {
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
