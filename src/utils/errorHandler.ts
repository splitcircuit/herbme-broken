import { toast } from "@/hooks/use-toast";

export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  isOperational?: boolean;
}

export class ApiError extends Error implements AppError {
  public code?: string;
  public statusCode?: number;
  public isOperational = true;

  constructor(message: string, statusCode?: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class ValidationError extends Error implements AppError {
  public isOperational = true;

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const handleError = (error: unknown, context?: string): void => {
  console.error(`Error in ${context || 'Unknown context'}:`, error);

  let userMessage = 'An unexpected error occurred. Please try again.';
  let isOperational = false;

  if (error instanceof Error && 'isOperational' in error) {
    userMessage = error.message;
    isOperational = (error as AppError).isOperational || false;
  } else if (error instanceof Error) {
    if (error.message.includes('Failed to fetch')) {
      userMessage = 'Network error. Please check your connection and try again.';
      isOperational = true;
    } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      userMessage = 'Authentication required. Please sign in and try again.';
      isOperational = true;
    } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
      userMessage = 'You do not have permission to perform this action.';
      isOperational = true;
    } else if (error.message.includes('404') || error.message.includes('Not Found')) {
      userMessage = 'The requested resource was not found.';
      isOperational = true;
    } else if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
      userMessage = 'Server error. Please try again later.';
      isOperational = true;
    }
  }

  // Only show toast for operational errors (user-facing errors)
  if (isOperational) {
    toast({
      title: "Error",
      description: userMessage,
      variant: "destructive",
    });
  }

  // In development, also log non-operational errors for debugging
  if (process.env.NODE_ENV === 'development' && !isOperational) {
    toast({
      title: "Development Error",
      description: error instanceof Error ? error.message : String(error),
      variant: "destructive",
    });
  }
};

export const wrapAsync = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: string
): T => {
  return ((...args: Parameters<T>) => {
    return fn(...args).catch((error: unknown) => {
      handleError(error, context);
      throw error; // Re-throw to allow component-level handling if needed
    });
  }) as T;
};