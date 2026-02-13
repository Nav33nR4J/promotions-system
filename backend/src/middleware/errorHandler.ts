import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
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

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
