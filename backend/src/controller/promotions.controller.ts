import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import {
  createPromotionService,
  getPromotionsService,
  getPromotionByIdService,
  updatePromotionService,
  togglePromotionStatusService,
  deletePromotionService,
  validatePromotionService,
} from "../modules/promotions/promotions.service";

const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS || 15000);

// Helper function to safely parse ID
const parseId = (param: string | string[]): number => {
  const idStr = Array.isArray(param) ? param[0] : param;
  return parseInt(idStr, 10);
};

const withRequestTimeout = async <T>(promise: Promise<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new ApiError("Request timed out", 504));
    }, REQUEST_TIMEOUT_MS);

    promise
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
};

export const createPromotion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await withRequestTimeout(createPromotionService(req.body));
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error("Error in createPromotion:", err);
    next(err);
  }
};

export const getPromotions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await withRequestTimeout(
      getPromotionsService(req.query.filter as string)
    );
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Error in getPromotions:", err);
    next(err);
  }
};

export const getPromotionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseId(req.params.id);
    const result = await withRequestTimeout(getPromotionByIdService(id));
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Error in getPromotionById:", err);
    next(err);
  }
};

export const updatePromotion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseId(req.params.id);
    console.log("[UPDATE] Request received - ID:", id, "Body:", JSON.stringify(req.body));
    const result = await withRequestTimeout(updatePromotionService(id, req.body));
    console.log("[UPDATE] Success - Result:", JSON.stringify(result));
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("[UPDATE] Error:", err);
    next(err);
  }
};

export const togglePromotionStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseId(req.params.id);
    const result = await withRequestTimeout(togglePromotionStatusService(id));
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Error in togglePromotionStatus:", err);
    next(err);
  }
};

export const deletePromotion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseId(req.params.id);
    const result = await withRequestTimeout(deletePromotionService(id));
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Error in deletePromotion:", err);
    next(err);
  }
};

export const validatePromotion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await withRequestTimeout(validatePromotionService(req.body));
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Error in validatePromotion:", err);
    next(err);
  }
};

