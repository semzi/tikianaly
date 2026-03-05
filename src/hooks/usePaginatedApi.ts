import { useState, useEffect, useCallback, useRef } from 'react';

interface PaginatedApiOptions<T> {
  /**
   * API function that accepts page and limit parameters
   */
  apiFunction: (page: number, limit: number) => Promise<any>;
  
  /**
   * Number of items per page
   */
  limit?: number;
  
  /**
   * Enable infinite scroll (default: true)
   */
  enableInfiniteScroll?: boolean;
  
  /**
   * Scroll threshold percentage (0-1) to trigger next page load
   * Default: 0.8 (80% scrolled)
   */
  scrollThreshold?: number;
  
  /**
   * Transform function to extract items from API response
   * Default: response.responseObject.items
   */
  transformResponse?: (response: any) => T[];
  
  /**
   * Check if there are more pages available
   * Default: checks if response has items and items.length === limit
   */
  hasMorePages?: (response: any, _currentItems: T[]) => boolean;
  
  /**
   * Initial page number (default: 1)
   */
  initialPage?: number;

  /**
   * Fetch all pages concurrently on initial load (default: false)
   * When true, fetches all pages at once instead of one by one
   */
  fetchAllConcurrently?: boolean;

  /**
   * Extract total pages from response
   * Required when fetchAllConcurrently is true
   */
  getTotalPages?: (response: any) => number | undefined;
}

interface PaginatedApiResult<T> {
  /**
   * All accumulated items from all pages
   */
  items: T[];
  
  /**
   * Current page number
   */
  currentPage: number;
  
  /**
   * Whether data is currently being fetched
   */
  loading: boolean;
  
  /**
   * Whether initial load is happening
   */
  initialLoading: boolean;
  
  /**
   * Whether there are more pages to load
   */
  hasMore: boolean;
  
  /**
   * Error message if any
   */
  error: string | null;
  
  /**
   * Manually load next page
   */
  loadNextPage: () => Promise<void>;
  
  /**
   * Reset pagination and start from page 1
   */
  reset: () => void;
  
  /**
   * Refresh current data
   */
  refresh: () => Promise<void>;
  
  /**
   * Set scroll container element for custom scroll containers
   * If not set, uses window scroll
   */
  setScrollContainer: (element: HTMLElement | null) => void;
}

/**
 * Custom hook for paginated API calls with infinite scroll support
 * 
 * @example
 * const { items, loading, hasMore, loadNextPage } = usePaginatedApi({
 *   apiFunction: getAllTeams,
 *   limit: 20,
 *   transformResponse: (response) => response.responseObject.items
 * });
 */
export function usePaginatedApi<T = any>(
  options: PaginatedApiOptions<T>
): PaginatedApiResult<T> {
  const {
    apiFunction,
    limit = 20,
    enableInfiniteScroll = true,
    scrollThreshold = 0.8,
    transformResponse = (response: any) => response?.responseObject?.items || [],
    hasMorePages = (response: any, _currentItems?: T[]) => {
      const items = transformResponse(response);
      return items && items.length === limit;
    },
    initialPage = 1,
    fetchAllConcurrently = false,
    getTotalPages = (response: any) => response?.responseObject?.totalPages,
  } = options;

  const [items, setItems] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const hasFetchedRef = useRef(false);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  /**
   * Fetch data for a specific page
   */
  const fetchPage = useCallback(
    async (page: number, append: boolean = true) => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFunction(page, limit);
        const newItems = transformResponse(response);

        if (!newItems || newItems.length === 0) {
          setHasMore(false);
          setLoading(false);
          return;
        }

        // Append or replace items based on append flag
        if (append) {
          setItems((prev) => [...prev, ...newItems]);
        } else {
          setItems(newItems);
        }

        // Check if there are more pages
        const morePages = hasMorePages(response, append ? [...items, ...newItems] : newItems);
        setHasMore(morePages);

        // Update current page if successful
        if (append && morePages) {
          setCurrentPage(page);
        }
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load data';
        setError(errorMessage);
        console.error('Error fetching page:', err);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [apiFunction, limit, transformResponse, hasMorePages, items]
  );

  /**
   * Load next page
   */
  const loadNextPage = useCallback(async () => {
    if (loading || !hasMore || isResetting) return;

    const nextPage = currentPage + 1;
    await fetchPage(nextPage, true);
  }, [currentPage, loading, hasMore, isResetting, fetchPage]);

  /**
   * Reset pagination
   */
  const reset = useCallback(() => {
    setIsResetting(true);
    setItems([]);
    setCurrentPage(initialPage);
    setHasMore(true);
    setError(null);
    setInitialLoading(true);
    hasFetchedRef.current = false;
    setIsResetting(false);
  }, [initialPage]);

  /**
   * Refresh current data
   */
  const refresh = useCallback(async () => {
    setIsResetting(true);
    setItems([]);
    setCurrentPage(initialPage);
    setHasMore(true);
    setError(null);
    setInitialLoading(true);
    hasFetchedRef.current = false;
    await fetchPage(initialPage, false);
    setIsResetting(false);
  }, [initialPage, fetchPage]);

  /**
   * Fetch all pages concurrently
   */
  const fetchAllPagesConcurrently = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // First request to get total pages
      const firstResponse = await apiFunction(initialPage, limit);
      const firstItems = transformResponse(firstResponse);
      const totalPages = getTotalPages(firstResponse);

      if (!firstItems || firstItems.length === 0) {
        setHasMore(false);
        setLoading(false);
        setInitialLoading(false);
        return;
      }

      // If only one page or no total pages info, just use first page
      if (!totalPages || totalPages <= 1) {
        setItems(firstItems);
        setHasMore(false);
        setLoading(false);
        setInitialLoading(false);
        return;
      }

      // Fetch all remaining pages concurrently
      const remainingPages = Array.from(
        { length: totalPages - 1 },
        (_, i) => i + initialPage + 1
      );
      const pagePromises = remainingPages.map(page => apiFunction(page, limit));
      
      const responses = await Promise.all(pagePromises);

      // Combine all results
      const allItems = [...firstItems];
      const seen = new Set(firstItems.map((item: any) => item.id || JSON.stringify(item)));

      for (const response of responses) {
        const newItems = transformResponse(response);
        if (newItems && newItems.length > 0) {
          for (const item of newItems) {
            const key = item.id || JSON.stringify(item);
            if (!seen.has(key)) {
              seen.add(key);
              allItems.push(item);
            }
          }
        }
      }

      setItems(allItems);
      setCurrentPage(totalPages);
      setHasMore(false);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load data';
      setError(errorMessage);
      console.error('Error fetching all pages:', err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [apiFunction, limit, transformResponse, getTotalPages, initialPage]);

  /**
   * Initial load
   */
  useEffect(() => {
    if (hasFetchedRef.current || isResetting) return;

    hasFetchedRef.current = true;
    
    if (fetchAllConcurrently) {
      fetchAllPagesConcurrently();
    } else {
      fetchPage(initialPage, false);
    }
  }, [initialPage, fetchPage, isResetting, fetchAllConcurrently, fetchAllPagesConcurrently]);

  /**
   * Infinite scroll handler
   */
  useEffect(() => {
    if (!enableInfiniteScroll || loading || !hasMore) return;

    const handleScroll = () => {
      // Find scrollable container
      const container = scrollContainerRef.current || window;
      
      let scrollTop: number;
      let scrollHeight: number;
      let clientHeight: number;

      if (container === window) {
        scrollTop = window.scrollY || document.documentElement.scrollTop;
        scrollHeight = document.documentElement.scrollHeight;
        clientHeight = window.innerHeight;
      } else {
        const element = container as HTMLElement;
        scrollTop = element.scrollTop;
        scrollHeight = element.scrollHeight;
        clientHeight = element.clientHeight;
      }

      const scrollPercentage = scrollTop / (scrollHeight - clientHeight);

      if (scrollPercentage >= scrollThreshold) {
        loadNextPage();
      }
    };

    const container = scrollContainerRef.current || window;
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [enableInfiniteScroll, loading, hasMore, scrollThreshold, loadNextPage]);

  /**
   * Set scroll container ref
   * This allows the hook to work with custom scroll containers
   */
  const setScrollContainer = useCallback((element: HTMLElement | null) => {
    scrollContainerRef.current = element;
  }, []);

  return {
    items,
    currentPage,
    loading,
    initialLoading,
    hasMore,
    error,
    loadNextPage,
    reset,
    refresh,
    setScrollContainer,
  };
}

