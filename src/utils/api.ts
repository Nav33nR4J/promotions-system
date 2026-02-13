import axios from "axios";
import { Platform } from "react-native";

// Use environment variable for API URL, fallback to localhost for web
const getBaseURL = (): string => {
  // For React Native Android, always use 10.0.2.2 to reach host localhost
  if (Platform.OS === "android") {
    return "http://10.0.2.2:5000";
  }
  
  // For React Native iOS simulator, use localhost
  if (Platform.OS === "ios") {
    return "http://localhost:5000";
  }
  
  // For web development, use localhost
  if (Platform.OS === "web") {
    return "http://localhost:5000";
  }
  
  // Try environment variable first (useful for physical devices)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  // Default fallback
  return "http://localhost:5000";
};

export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging in development
api.interceptors.request.use(
  (config) => {
    if (__DEV__) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error) => {
    if (__DEV__) {
      console.log("[API] Request error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log("[API] Response:", response.status);
    }
    return response;
  },
  (error) => {
    if (__DEV__) {
      console.log("[API] Error:", error.response?.status || error.message);
    }
    return Promise.reject(error);
  }
);
