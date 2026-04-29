import { proxyToBackend, withProxyErrorHandling } from '@/services/api/backend.proxy';

export const dynamic = 'force-dynamic';

interface QuizByIdRouteContext {
  params: Promise<{
    id: string;
  }>;
}

const createQuizByIdHandler = (method: 'GET' | 'DELETE') => {
  return withProxyErrorHandling(async (_request: Request, { params }: QuizByIdRouteContext) => {
    const { id } = await params;

    return proxyToBackend({
      path: `/quizzes/${id}`,
      method,
    });
  });
};

export const GET = createQuizByIdHandler('GET');

export const DELETE = createQuizByIdHandler('DELETE');
