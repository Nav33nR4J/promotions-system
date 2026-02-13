import { Router } from "express";
import {
  createPromotion,
  getPromotions,
  getPromotionById,
  updatePromotion,
  togglePromotionStatus,
  deletePromotion,
  validatePromotion,
} from "../controller/promotions.controller";

const router = Router();

router.get("/", getPromotions);
router.get("/:id", getPromotionById);
router.post("/", createPromotion);
router.put("/:id", updatePromotion);
router.patch("/:id/toggle", togglePromotionStatus);
router.delete("/:id", deletePromotion);
router.post("/validate", validatePromotion);

export default router;

