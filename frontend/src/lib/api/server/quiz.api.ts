import { headers } from 'next/headers';
import { extractApiErrorMessage } from '@/lib/api/errors';
import { ApiResponse } from '@/types/api.types';
import { Quiz, QuizSummary } from '@/types/quiz.types';

const fallbackAppBaseUrl =
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const getAppBaseUrl = async (): Promise<string> => {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get('x-forwarded-host') || requestHeaders.get('host');
  const protocol = requestHeaders.get('x-forwarded-proto') || 'http';

  if (!host) {
    return fallbackAppBaseUrl.replace(/\/$/, '');
  }

  return `${protocol}://${host}`;
};

export class ServerApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ServerApiError';
    this.status = status;
  }
}

const extractErrorMessage = async (response: Response): Promise<string> => {
  const fallbackMessage = `Request failed with status ${response.status}`;

  try {
    const payload = await response.json();
    return extractApiErrorMessage(payload, fallbackMessage);
  } catch {
    return fallbackMessage;
  }
};

const fetchServerApi = async <T>(path: string): Promise<T> => {
  const baseUrl = await getAppBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const response = await fetch(`${baseUrl}${normalizedPath}`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const message = await extractErrorMessage(response);
    throw new ServerApiError(message, response.status);
  }

  const payload = (await response.json()) as ApiResponse<T>;
  return payload.data;
};

export const serverQuizApi = {
  getAll(): Promise<QuizSummary[]> {
    return fetchServerApi<QuizSummary[]>('/api/quizzes');
  },

  getById(id: number): Promise<Quiz> {
    return fetchServerApi<Quiz>(`/api/quizzes/${id}`);
  },
};
