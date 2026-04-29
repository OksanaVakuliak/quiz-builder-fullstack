import { createProxyErrorResponse, proxyToBackend } from '@/services/api/backend.proxy';

export const dynamic = 'force-dynamic';

interface QuizByIdRouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: Request, { params }: QuizByIdRouteContext) {
  try {
    const { id } = await params;

    return await proxyToBackend({
      path: `/quizzes/${id}`,
      method: 'GET',
    });
  } catch (error) {
    console.error(error);
    return createProxyErrorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: QuizByIdRouteContext) {
  try {
    const { id } = await params;

    return await proxyToBackend({
      path: `/quizzes/${id}`,
      method: 'DELETE',
    });
  } catch (error) {
    console.error(error);
    return createProxyErrorResponse(error);
  }
}
