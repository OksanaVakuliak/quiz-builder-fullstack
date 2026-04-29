import {
  proxyToBackend,
  withProxyErrorHandling,
} from '@/services/api/backend.proxy';

export const dynamic = 'force-dynamic';

export const GET = withProxyErrorHandling(async (request: Request) => {
  const search = new URL(request.url).search;

  return proxyToBackend({
    path: '/quizzes',
    method: 'GET',
    search,
  });
});

export const POST = withProxyErrorHandling(async (request: Request) => {
  const body = await request.text();

  return proxyToBackend({
    path: '/quizzes',
    method: 'POST',
    body,
  });
});
