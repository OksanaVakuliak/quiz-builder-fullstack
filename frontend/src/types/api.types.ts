export interface ApiResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}
