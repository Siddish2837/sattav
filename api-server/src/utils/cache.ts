import { LRUCache } from 'lru-cache';

/**
 * In-memory LRU cache for career analysis + recommendation results.
 * - max: 500 entries (covers many concurrent users)
 * - ttl: 10 minutes — results stay fresh; careers don't change that fast
 */
const cache = new LRUCache<string, any>({
  max: 500,
  ttl: 1000 * 60 * 10,
});

export function getCached<T>(key: string): T | undefined {
  return cache.get(key) as T | undefined;
}

export function setCached<T>(key: string, value: T): void {
  cache.set(key, value);
}

/**
 * Produces a stable, deterministic cache key from any object.
 * Keys are sorted so { a:1, b:2 } and { b:2, a:1 } produce the same key.
 */
export function makeCacheKey(data: object): string {
  return JSON.stringify(data, Object.keys(data).sort());
}
