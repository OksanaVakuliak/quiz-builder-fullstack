const rawBackendApiBaseUrl = process.env.API_BASE_URL || 'http://localhost:4000/api';

const backendApiBaseUrl = rawBackendApiBaseUrl.replace(/\/$/, '');
const localhostHostPattern = /\/\/localhost(?::|\/)/i;
const noContentStatuses = new Set([204, 205, 304]);

interface ProxyToBackendOptions {
  path: string;
  method: 'GET' | 'POST' | 'DELETE';
  body?: string;
  search?: string;
}

const toBackendUrl = (path: string, search?: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const baseUrl = `${backendApiBaseUrl}${normalizedPath}`;

  if (!search) {
    return baseUrl;
  }

  return `${baseUrl}${search}`;
};

const fetchWithLocalhostFallback = async (url: string, init: RequestInit): Promise<Response> => {
  try {
    return await fetch(url, init);
  } catch (error) {
    if (!localhostHostPattern.test(url)) {
      throw error;
    }

    const fallbackUrl = url.replace('//localhost', '//127.0.0.1');
    return fetch(fallbackUrl, init);
  }
};

export const proxyToBackend = async ({
  path,
  method,
  body,
  search,
}: ProxyToBackendOptions): Promise<Response> => {
  const targetUrl = toBackendUrl(path, search);
  const response = await fetchWithLocalhostFallback(targetUrl, {
    method,
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    body,
  });

  const headers = new Headers();
  const isNoContentResponse = noContentStatuses.has(response.status);
  const contentType = response.headers.get('content-type');
  const location = response.headers.get('location');

  if (contentType && !isNoContentResponse) {
    headers.set('Content-Type', contentType);
  }

  if (location) {
    headers.set('Location', location);
  }

  if (isNoContentResponse) {
    return new Response(null, {
      status: response.status,
      headers,
    });
  }

  const payload = await response.text();

  return new Response(payload, {
    status: response.status,
    headers,
  });
};

export const createProxyErrorResponse = (error?: unknown): Response => {
  const details =
    process.env.NODE_ENV === 'production'
      ? undefined
      : {
          backendApiBaseUrl,
          reason: error instanceof Error ? error.message : 'Unknown proxy error',
        };

  return Response.json(
    {
      error: 'BadGateway',
      message: 'Failed to reach backend API.',
      details,
    },
    { status: 502 }
  );
};
