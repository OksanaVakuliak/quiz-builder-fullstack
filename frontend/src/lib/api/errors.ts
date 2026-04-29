import { ApiErrorResponse } from '@/types/api.types';

export class ApiRequestError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.details = details;
  }
}

export const extractApiErrorMessage = (payload: unknown, fallbackMessage: string): string => {
  if (!payload || typeof payload !== 'object') {
    return fallbackMessage;
  }

  const maybeError = payload as Partial<ApiErrorResponse>;

  if (typeof maybeError.message === 'string' && maybeError.message.trim().length > 0) {
    return maybeError.message;
  }

  if (typeof maybeError.error === 'string' && maybeError.error.trim().length > 0) {
    return maybeError.error;
  }

  return fallbackMessage;
};
