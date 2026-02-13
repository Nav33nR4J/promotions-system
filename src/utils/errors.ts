// Error message utility for consistent error handling across the app

export interface AppError {
  message: string;
  code?: string;
  status?: number;
}

// Map backend error messages to user-friendly messages
const errorMessageMap: Record<string, string> = {
  "Database unavailable. Please try again shortly.": "Server is temporarily unavailable. Please try again later.",
  "Database unavailable": "Server is temporarily unavailable. Please try again later.",
  "connect econnrefused": "Cannot connect to server. Please check your internet connection.",
  "connect eperm": "Permission denied. Please check your network settings.",
  "Request timed out": "The request took too long. Please try again.",
  "Network Error": "Unable to connect to server. Please check your internet connection.",
};

// Get user-friendly error message
export const getErrorMessage = (error: unknown): string => {
  if (!error) return "An unknown error occurred";

  // Handle axios errors
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
    
    // Backend error response
    if (axiosError.response?.data?.message) {
      const backendMsg = axiosError.response.data.message;
      return errorMessageMap[backendMsg] || backendMsg;
    }
    
    // Network error
    if (axiosError.message === "Network Error") {
      return errorMessageMap["Network Error"];
    }
  }

  // Handle standard errors
  if (error instanceof Error) {
    const msg = error.message;
    
    // Check mapped messages
    for (const [key, value] of Object.entries(errorMessageMap)) {
      if (msg.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }
    
    return msg;
  }

  // Handle string errors
  if (typeof error === "string") {
    return errorMessageMap[error] || error;
  }

  return "An unknown error occurred";
};

// Check if error is a network error
export const isNetworkError = (error: unknown): boolean => {
  if (!error) return false;
  
  const axiosError = error as { response?: { status?: number }; message?: string };
  
  // No response means network error
  if (!axiosError.response && axiosError.message === "Network Error") {
    return true;
  }
  
  // 503 indicates server unavailable
  if (axiosError.response?.status === 503) {
    return true;
  }
  
  return false;
};

// Error severity levels for UI handling
export type ErrorSeverity = "info" | "warning" | "error" | "critical";

export const getErrorSeverity = (error: unknown): ErrorSeverity => {
  if (isNetworkError(error)) return "warning";
  
  const axiosError = error as { response?: { status?: number } };
  const status = axiosError.response?.status;
  
  if (status === 500 || status === 503) return "critical";
  if (status === 400 || status === 404) return "error";
  
  return "error";
};
