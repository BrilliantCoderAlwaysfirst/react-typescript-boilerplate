import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import ErrorUtil, { type ErrorResponse } from "../../utils/error/Error";

export interface BaseApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface PaginationApiResponseType<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiServiceConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  onError?: (error: ErrorResponse) => void;
  onValidationError?: (errors: { key: string; message: string }[]) => void;
  onUnauthorized?: () => void;
  onForbidden?: () => void;
  onNotFound?: () => void;
  onServerError?: () => void;
  onTimeout?: () => void;
  onNetworkError?: () => void;
  onUnknownError?: () => void;
}

export class ApiService {
  private axiosInstance: AxiosInstance;
  private config: ApiServiceConfig;

  constructor(config: ApiServiceConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem(
          import.meta.env.VITE_AUTH_TOKEN_KEY || "token",
        );
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const normalizedError = ErrorUtil.normalizeError(error);

        switch (normalizedError.status) {
          case 401:
            this.config.onUnauthorized?.();
            break;
          case 403:
            this.config.onForbidden?.();
            break;
          case 404:
            this.config.onNotFound?.();
            break;
          case 408:
            this.config.onTimeout?.();
            break;
          case 500:
            this.config.onServerError?.();
            break;
          default:
            if (
              error.code === "ECONNABORTED" ||
              error.code === "ECONNREFUSED"
            ) {
              this.config.onNetworkError?.();
            } else {
              this.config.onUnknownError?.();
            }
        }

        // Handle validation errors
        if (normalizedError.status === 422) {
          const validationErrors = ErrorUtil.parseValidationError(error as any);
          // Convert validation errors to the expected format
          const formattedErrors = validationErrors.map((error) => ({
            key: error.key,
            message:
              typeof error.message === "string"
                ? error.message
                : "Validation error",
          }));
          this.config.onValidationError?.(formattedErrors);
        }

        this.config.onError?.(normalizedError);
        return Promise.reject(normalizedError);
      },
    );
  }

  async get<T>(url: string, params?: any): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, { params });
  }

  async post<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data);
  }

  async put<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data);
  }

  async patch<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data);
  }

  async delete<T>(url: string): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url);
  }

  setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common["Authorization"] =
      `Bearer ${token}`;
  }

  clearAuthToken(): void {
    delete this.axiosInstance.defaults.headers.common["Authorization"];
  }

  setHeader(key: string, value: string): void {
    this.axiosInstance.defaults.headers.common[key] = value;
  }

  removeHeader(key: string): void {
    delete this.axiosInstance.defaults.headers.common[key];
  }
}
