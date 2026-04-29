import { cache } from 'react';
import type { Metadata } from 'next';
import { ServerApiError, serverQuizApi } from '@/lib/api/server/quiz.api';
import { createPageMetadata } from '@/lib/metadata';
import { Quiz } from '@/types/quiz.types';

const fetchQuizByIdCached = cache(async (quizId: number): Promise<Quiz> => {
  return serverQuizApi.getById(quizId);
});

export const parseQuizId = (rawId: string): number => {
  const directId = Number(rawId);

  if (Number.isInteger(directId) && directId > 0) {
    return directId;
  }

  const tailNumber = rawId.match(/\d+/g)?.at(-1);
  const normalizedId = Number(tailNumber);

  if (Number.isInteger(normalizedId) && normalizedId > 0) {
    return normalizedId;
  }

  return Number.NaN;
};

export const createInvalidQuizDetailMetadata = (): Metadata => {
  return createPageMetadata({
    title: 'Quiz details',
    description: 'Open a quiz to review questions and solve it.',
    path: '/quizzes',
  });
};

export const createQuizDetailMetadata = async (
  quizId: number,
): Promise<Metadata> => {
  try {
    const quiz = await fetchQuizByIdCached(quizId);

    return createPageMetadata({
      title: quiz.title,
      description:
        quiz.description?.trim() || 'Open this quiz and check your answers.',
      path: `/quizzes/${quizId}`,
      type: 'article',
    });
  } catch (_error) {
    return createPageMetadata({
      title: `Quiz #${quizId}`,
      description: 'Open this quiz and check your answers.',
      path: `/quizzes/${quizId}`,
      type: 'article',
    });
  }
};

export const getQuizDetail = async (quizId: number): Promise<Quiz> => {
  return fetchQuizByIdCached(quizId);
};

export { ServerApiError };
