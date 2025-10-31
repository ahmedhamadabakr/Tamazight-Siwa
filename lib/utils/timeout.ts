// Utility for adding timeouts to promises
export function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage?: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(errorMessage || `Operation timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    })
  ]);
}

// Specific timeout for database operations
export function withDbTimeout<T>(promise: Promise<T>, operation: string = 'Database operation'): Promise<T> {
  const timeout = process.env.NODE_ENV === 'production' ? 8000 : 5000; // 8s in prod, 5s in dev
  return withTimeout(promise, timeout, `${operation} timed out after ${timeout}ms`);
}