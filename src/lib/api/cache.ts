/**
 * Simple in-memory cache utility for API responses
 * Prevents redundant API calls by caching responses with TTL
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class ApiCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes default

  /**
   * Generate a cache key from endpoint and parameters
   */
  private getCacheKey(endpoint: string, params?: Record<string, any>): string {
    const paramString = params
      ? Object.entries(params)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, value]) => `${key}=${value}`)
          .join('&')
      : '';
    return `${endpoint}${paramString ? `?${paramString}` : ''}`;
  }

  /**
   * Check if cache entry exists and is still valid
   */
  get<T>(endpoint: string, params?: Record<string, any>): T | null {
    const key = this.getCacheKey(endpoint, params);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if cache has expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Store data in cache
   */
  set<T>(
    endpoint: string,
    data: T,
    params?: Record<string, any>,
    ttl?: number
  ): void {
    const key = this.getCacheKey(endpoint, params);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  /**
   * Clear specific cache entry
   */
  clear(endpoint: string, params?: Record<string, any>): void {
    const key = this.getCacheKey(endpoint, params);
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clearAll(): void {
    this.cache.clear();
  }

  /**
   * Check if cache entry exists (without checking expiry)
   */
  has(endpoint: string, params?: Record<string, any>): boolean {
    const key = this.getCacheKey(endpoint, params);
    return this.cache.has(key);
  }

  /**
   * Set custom TTL for specific endpoint
   */
  setTTL(ttl: number): void {
    this.defaultTTL = ttl;
  }
}

// Export singleton instance
export const apiCache = new ApiCache();

/**
 * Cache wrapper for API functions
 * Usage: const cachedFunction = withCache(originalFunction, ttl?)
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  ttl?: number
): T {
  return (async (...args: Parameters<T>) => {
    // Create cache key from function name and arguments
    const endpoint = fn.name || 'unknown';
    const params = args.length > 0 ? { args } : undefined;

    // Check cache first
    const cached = apiCache.get(endpoint, params);
    if (cached !== null) {
      return cached;
    }

    // Call original function
    const result = await fn(...args);

    // Store in cache
    apiCache.set(endpoint, result, params, ttl);

    return result;
  }) as T;
}

