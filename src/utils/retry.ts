import { logger } from './logger';

export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  exponentialBackoff?: boolean;
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  config: RetryConfig,
  operation: string = 'Operation'
): Promise<T> {
  const { maxRetries, retryDelay, exponentialBackoff = true } = config;
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        const delay = exponentialBackoff 
          ? retryDelay * Math.pow(2, attempt)
          : retryDelay;
        
        logger.warn(
          `${operation} failed (attempt ${attempt + 1}/${maxRetries + 1}). ` +
          `Retrying in ${delay}ms...`,
          { error: lastError.message }
        );
        
        await sleep(delay);
      }
    }
  }

  logger.error(`${operation} failed after ${maxRetries + 1} attempts`, {
    error: lastError?.message,
  });
  
  throw lastError;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

