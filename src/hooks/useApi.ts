import { useState, useCallback, useEffect, useRef } from "react";
import { apiService } from "../services/api";
import type { AxiosResponse } from "axios";
import type { ErrorResponse } from "../utils/error/Error";

interface UseApiOptions<T> {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  params?: Record<string, any>;
  data?: any;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: ErrorResponse) => void;
  cacheTime?: number;
  staleTime?: number;
  // Pagination options
  pagination?: {
    enabled: boolean;
    initialPage?: number;
    pageSize?: number;
    infiniteScroll?: boolean;
  };
  // Optimistic update options
  optimisticUpdate?: {
    enabled: boolean;
    updateData: (oldData: T | null, newData: any) => T;
    rollbackOnError?: boolean;
  };
  // Request deduplication
  dedupeTime?: number;
  // Retry options
  retry?: {
    enabled: boolean;
    maxAttempts?: number;
    retryDelay?: number;
  };
  // Transform response
  transform?: (data: any) => T;
}

interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: ErrorResponse | null;
  refetch: () => Promise<void>;
  mutate: (data?: any) => Promise<void>;
  page: number;
  setPage: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: () => void;
  previousPage: () => void;
  loadMore: () => Promise<void>;
  isFetchingMore: boolean;
  hasMore: boolean;
  optimisticData: T | null;
  retryCount: number;
  resetRetryCount: () => void;
}

// Simple cache implementation
const cache = new Map<string, { data: any; timestamp: number }>();
// Request deduplication cache
const pendingRequests = new Map<string, Promise<any>>();

export function useApi<T>({
  url,
  method = "GET",
  params,
  data: initialData,
  enabled = true,
  onSuccess,
  onError,
  cacheTime = 5 * 60 * 1000, // 5 minutes
  staleTime = 0, // 0 means always consider data stale
  pagination,
  optimisticUpdate,
  dedupeTime = 1000, // 1 second
  retry,
  transform,
}: UseApiOptions<T>): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [page, setPage] = useState(pagination?.initialPage || 1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [optimisticData, setOptimisticData] = useState<T | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const previousDataRef = useRef<T | null>(null);

  const resetRetryCount = useCallback(() => {
    setRetryCount(0);
  }, []);

  const executeRequest = useCallback(
    async (requestData?: any, isLoadMore = false): Promise<T> => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      if (!isLoadMore) {
        setIsLoading(true);
      }
      setIsError(false);
      setError(null);

      // Handle request deduplication
      const requestKey = `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(requestData)}`;
      const pendingRequest = pendingRequests.get(requestKey);
      if (pendingRequest) {
        return pendingRequest as Promise<T>;
      }

      const requestPromise = (async (): Promise<T> => {
        try {
          let response: AxiosResponse<T>;
          const requestParams = {
            ...params,
            ...(pagination?.enabled && !pagination.infiniteScroll
              ? { page, pageSize: pagination.pageSize }
              : {}),
          };

          switch (method) {
            case "POST":
              response = await apiService.post<T>(
                url,
                requestData || initialData,
              );
              break;
            case "PUT":
              response = await apiService.put<T>(
                url,
                requestData || initialData,
              );
              break;
            case "DELETE":
              response = await apiService.delete<T>(url);
              break;
            case "PATCH":
              response = await apiService.patch<T>(
                url,
                requestData || initialData,
              );
              break;
            default:
              response = await apiService.get<T>(url, requestParams);
          }

          const responseData = transform
            ? transform(response.data)
            : response.data;

          if (pagination?.infiniteScroll && isLoadMore) {
            setData((prev) => {
              if (!prev) return responseData;
              return {
                ...responseData,
                data: [...(prev as any).data, ...(responseData as any).data],
              };
            });
            setHasMore(
              (responseData as any).data.length === pagination.pageSize,
            );
          } else {
            setData(responseData);
          }

          onSuccess?.(responseData);

          // Cache the response
          if (method === "GET") {
            const cacheKey = `${url}${JSON.stringify(requestParams)}`;
            cache.set(cacheKey, {
              data: responseData,
              timestamp: Date.now(),
            });
          }

          return responseData;
        } catch (err) {
          const normalizedError = err as ErrorResponse;
          setError(normalizedError);
          setIsError(true);
          onError?.(normalizedError);

          // Handle retry logic
          if (retry?.enabled && retryCount < (retry.maxAttempts || 3)) {
            setRetryCount((prev) => prev + 1);
            await new Promise((resolve) =>
              setTimeout(resolve, retry.retryDelay || 1000),
            );
            return executeRequest(requestData, isLoadMore);
          }

          // Rollback optimistic update on error
          if (optimisticUpdate?.rollbackOnError) {
            setData(previousDataRef.current);
          }

          throw normalizedError;
        } finally {
          setIsLoading(false);
          setIsFetchingMore(false);
          // Remove from pending requests after dedupeTime
          setTimeout(() => {
            pendingRequests.delete(requestKey);
          }, dedupeTime);
        }
      })();

      pendingRequests.set(requestKey, requestPromise);
      return requestPromise;
    },
    [
      url,
      method,
      params,
      initialData,
      onSuccess,
      onError,
      page,
      pagination,
      retry,
      retryCount,
      transform,
      optimisticUpdate?.rollbackOnError,
    ],
  );

  const refetch = useCallback(async () => {
    await executeRequest();
  }, [executeRequest]);

  const mutate = useCallback(
    async (requestData?: any) => {
      if (optimisticUpdate?.enabled) {
        previousDataRef.current = data;
        const optimisticData = optimisticUpdate.updateData(data, requestData);
        setOptimisticData(optimisticData);
        setData(optimisticData);
      }
      await executeRequest(requestData);
    },
    [executeRequest, data, optimisticUpdate],
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || isFetchingMore) return;
    setIsFetchingMore(true);
    setPage((prev) => prev + 1);
    await executeRequest(undefined, true);
  }, [hasMore, isFetchingMore, executeRequest]);

  const hasNextPage = pagination?.enabled
    ? (data as any)?.totalPages > page
    : false;
  const hasPreviousPage = pagination?.enabled ? page > 1 : false;

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPage((prev) => prev + 1);
    }
  }, [hasNextPage]);

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setPage((prev) => prev - 1);
    }
  }, [hasPreviousPage]);

  useEffect(() => {
    if (!enabled) return;

    // Check cache for GET requests
    if (method === "GET") {
      const cacheKey = `${url}${JSON.stringify(params)}`;
      const cachedData = cache.get(cacheKey);

      if (cachedData) {
        const isStale = Date.now() - cachedData.timestamp > staleTime;
        if (!isStale) {
          setData(cachedData.data);
          return;
        }
      }
    }

    executeRequest();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [url, method, params, enabled, executeRequest, staleTime, page]);

  // Clean up old cache entries
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      for (const [key, value] of cache.entries()) {
        if (now - value.timestamp > cacheTime) {
          cache.delete(key);
        }
      }
    };

    const interval = setInterval(cleanup, cacheTime);
    return () => clearInterval(interval);
  }, [cacheTime]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    mutate,
    page,
    setPage,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    loadMore,
    isFetchingMore,
    hasMore,
    optimisticData,
    retryCount,
    resetRetryCount,
  };
}
