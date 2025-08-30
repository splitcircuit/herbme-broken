import { useCallback } from 'react';

/**
 * Hook to handle async errors and pass them to error boundaries
 */
export const useAsyncError = () => {
  const throwError = useCallback((error: Error) => {
    // Re-throw the error in the next tick to ensure it's caught by error boundaries
    setTimeout(() => {
      throw error;
    }, 0);
  }, []);

  return throwError;
};