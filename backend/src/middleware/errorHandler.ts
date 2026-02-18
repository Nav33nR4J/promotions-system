import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log the actual error for debugging
  console.error("[ERROR HANDLER] Error occurred:", err.message);
  console.error("[ERROR HANDLER] Stack:", err.stack);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  const errorMessage = err.message.toLowerCase();

  if (
    errorMessage.includes("database operation timed out") ||
    errorMessage.includes("database unavailable") ||
    errorMessage.includes("connect eperm") ||
    errorMessage.includes("connect econnrefused")
  ) {
    return res.status(503).json({
      success: false,
      message: "Database unavailable. Please try again shortly.",
    });
  }

  // SQLite UNIQUE constraint violation → 409 Conflict
  if (
    errorMessage.includes("unique constraint failed") ||
    errorMessage.includes("unique constraint") ||
    errorMessage.includes("sqlite_constraint_unique")
  ) {
    // Extract the column name for a friendlier message
    const match = err.message.match(/UNIQUE constraint failed: \w+\.(\w+)/i);
    const field = match ? match[1] : "field";
    const friendlyField = field === "promo_code" ? "Promo code" : field;
    return res.status(409).json({
      success: false,
      message: `${friendlyField} already exists. Please use a different value.`,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error: " + err.message,
  });
};
