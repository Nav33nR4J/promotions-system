import { ApiError } from "../../utils/ApiError";
import { Warnings } from "../../utils/warnings";
import {
  createPromotionRepo,
  getPromotionByCodeRepo,
  getPromotionByIdRepo,
  updatePromotionRepo,
  togglePromotionStatusRepo,
  deletePromotionRepo,
  incrementUsageAtomicRepo,
  getPromotionsRepo,
} from "./promotions.repository";

import { validateCreatePromotion, validateUpdatePromotion, validateId } from "../../validations/promotions.validation";
import { Promotion, ValidatePromoInput } from "../../types/promotions.types";

export const createPromotionService = async (data: Promotion) => {
  validateCreatePromotion(data);
  return createPromotionRepo(data);
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
  console.log("[SERVICE] updatePromotionService called with id:", id, "data:", data);
  
  if (isNaN(id)) {
    console.error("[SERVICE] Invalid ID - NaN detected");
    throw new ApiError("Invalid ID", 400);
  }
  
  validateId(id);
  validateUpdatePromotion(data);

  console.log("[SERVICE] Validation passed, checking if promotion exists...");
  const existing = await getPromotionByIdRepo(id);
  console.log("[SERVICE] Existing promotion:", existing);
  
  if (!existing) {
    console.error("[SERVICE] Promotion not found with id:", id);
    throw new ApiError(Warnings.notFound("Promotion").message, 404);
  }

  console.log("[SERVICE] Calling updatePromotionRepo...");
  return updatePromotionRepo(id, data);
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

export const validatePromotionService = async (
  data: ValidatePromoInput
) => {
  const { promo_code, order_amount } = data;

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

  let discount = 0;

  if (promo.type === "PERCENTAGE") {
    discount = (order_amount * promo.value) / 100;
  } else {
    discount = promo.value;
  }

  const final_amount = Math.max(order_amount - discount, 0);

  try {
    await incrementUsageAtomicRepo(promo.id);
  } catch (error) {
    if (error instanceof Error && error.message === "Usage limit exceeded") {
      throw new ApiError("Promotion usage limit exceeded", 400);
    }
    throw error;
  }

  return {
    original_amount: order_amount,
    discount,
    final_amount,
  };
};
