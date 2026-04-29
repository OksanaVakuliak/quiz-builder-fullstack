import axios, { AxiosError } from 'axios';
import { ApiRequestError, extractApiErrorMessage } from '@/lib/api/errors';
import { ApiErrorResponse } from '@/types/api.types';

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status ?? 500;
    const fallbackMessage =
      error.message || `Request failed with status ${status}`;
    const message = extractApiErrorMessage(
      error.response?.data,
      fallbackMessage,
    );
    const details = error.response?.data?.details;

    return Promise.reject(new ApiRequestError(message, status, details));
  },
);
