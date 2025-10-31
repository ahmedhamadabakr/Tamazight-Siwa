// Simple in-memory cache for auth operations
interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

class AuthCache {
    private cache = new Map<string, CacheEntry<any>>();
    private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

    set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        const now = Date.now();
        if (now - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    // Clean expired entries
    cleanup(): void {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                this.cache.delete(key);
            }
        }
    }
}

export const authCache = new AuthCache();

// Auto cleanup every 10 minutes
if (typeof window === 'undefined') {
    setInterval(() => {
        authCache.cleanup();
    }, 10 * 60 * 1000);
}