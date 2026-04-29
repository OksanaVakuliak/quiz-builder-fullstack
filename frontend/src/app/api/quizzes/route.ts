import { createProxyErrorResponse, proxyToBackend } from '@/services/api/backend.proxy';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const search = new URL(request.url).search;

    return await proxyToBackend({
      path: '/quizzes',
      method: 'GET',
      search,
    });
  } catch (error) {
    console.error(error);
    return createProxyErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.text();

    return await proxyToBackend({
      path: '/quizzes',
      method: 'POST',
      body,
    });
  } catch (error) {
    console.error(error);
    return createProxyErrorResponse(error);
  }
}
