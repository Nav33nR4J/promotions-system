// Centralized warning messages for consistent error handling across the app

export const Warnings = {
  // Not Found warnings
  notFound: (entity: string) => ({
    code: "NOT_FOUND",
    message: `${entity} not found`
  }),

  // Invalid Request warnings
  invalidRequest: (msg: string) => ({
    code: "INVALID_REQUEST",
    message: msg
  }),

  // Internal Error warnings
  internalError: () => ({
    code: "INTERNAL_ERROR",
    message: "Something went wrong"
  }),

  // Validation warnings
  validation: {
    promoCodeRequired: () => ({
      code: "VALIDATION_ERROR",
      message: "Promo code is required"
    }),
    titleRequired: () => ({
      code: "VALIDATION_ERROR",
      message: "Title is required"
    }),
    invalidDiscountType: () => ({
      code: "VALIDATION_ERROR",
      message: "Invalid discount type. Must be PERCENTAGE or FIXED"
    }),
    valueMustBePositive: () => ({
      code: "VALIDATION_ERROR",
      message: "Value must be greater than 0"
    }),
    startDateRequired: () => ({
      code: "VALIDATION_ERROR",
      message: "Start date is required"
    }),
    endDateRequired: () => ({
      code: "VALIDATION_ERROR",
      message: "End date is required"
    }),
    invalidDateRange: () => ({
      code: "VALIDATION_ERROR",
      message: "Start date must be before end date"
    }),
    invalidId: () => ({
      code: "VALIDATION_ERROR",
      message: "Invalid ID"
    })
  },

  // Promotion specific warnings
  promotion: {
    notFound: () => ({
      code: "PROMOTION_NOT_FOUND",
      message: "Promotion not found"
    }),
    inactive: () => ({
      code: "PROMOTION_INACTIVE",
      message: "Promotion is inactive"
    }),
    expired: () => ({
      code: "PROMOTION_EXPIRED",
      message: "Promotion has expired"
    }),
    notStarted: () => ({
      code: "PROMOTION_NOT_STARTED",
      message: "Promotion has not started yet"
    }),
    usageLimitExceeded: () => ({
      code: "USAGE_LIMIT_EXCEEDED",
      message: "Promotion usage limit has been exceeded"
    }),
    invalidCode: () => ({
      code: "INVALID_PROMO_CODE",
      message: "Invalid promo code"
    }),
    createSuccess: () => ({
      code: "PROMOTION_CREATED",
      message: "Promotion created successfully"
    }),
    updateSuccess: () => ({
      code: "PROMOTION_UPDATED",
      message: "Promotion updated successfully"
    }),
    deleteSuccess: () => ({
      code: "PROMOTION_DELETED",
      message: "Promotion deleted successfully"
    }),
    toggleSuccess: (newStatus: string) => ({
      code: "PROMOTION_STATUS_TOGGLED",
      message: `Promotion ${newStatus === "ACTIVE" ? "enabled" : "disabled"} successfully`
    })
  },

  // Network/Server warnings
  network: {
    timeout: () => ({
      code: "REQUEST_TIMEOUT",
      message: "Request timed out"
    }),
    serverError: () => ({
      code: "SERVER_ERROR",
      message: "Server error. Please try again later"
    }),
    databaseUnavailable: () => ({
      code: "DATABASE_UNAVAILABLE",
      message: "Database unavailable. Please try again later"
    })
  }
};

// Helper function to get warning message by key
export const getWarningMessage = (warning: { code: string; message: string }): string => {
  return warning.message;
};

