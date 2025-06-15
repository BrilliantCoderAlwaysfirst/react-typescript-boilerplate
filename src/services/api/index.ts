import { ApiService } from "./ApiService";
import env from "../../config/env";

const API_BASE_URL = `${env.apiBaseUrl}/api`;

export const apiService = new ApiService({
  baseURL: API_BASE_URL,
  timeout: env.apiTimeout,
  onError: (error) => {
    console.error("API Error:", error);
  },
  onValidationError: (errors) => {
    console.error("Validation Errors:", errors);
  },
  onUnauthorized: () => {
    // Handle unauthorized access
    localStorage.removeItem("token");
    window.location.href = "/login";
  },
  onForbidden: () => {
    console.error("Access forbidden");
  },
  onNotFound: () => {
    console.error("Resource not found");
  },
  onServerError: () => {
    console.error("Server error occurred");
  },
  onTimeout: () => {
    console.error("Request timeout");
  },
  onNetworkError: () => {
    console.error("Network error occurred");
  },
  onUnknownError: () => {
    console.error("Unknown error occurred");
  },
});
