// Centralized API helper for building requests against the backend
// Reads base URL from Next.js public env vars so it can be used on client

const publicBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
const publicApiPrefix = process.env.NEXT_PUBLIC_API_PREFIX ?? '/api/v1';

function joinPaths(a: string, b: string): string {
  if (!a && !b) return '';
  if (!a) return b.startsWith('/') ? b : `/${b}`;
  if (!b) return a.replace(/\/$/, '');
  return `${a.replace(/\/$/, '')}/${b.replace(/^\//, '')}`;
}

// Keep env-derived value for SSR-safe default
const ENV_BASE_WITH_PREFIX = joinPaths(publicBaseUrl, publicApiPrefix);

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = RequestInit & {
  // When true, the function will JSON.stringify the body and set headers
  json?: boolean;
};

function buildUrl(path: string, query?: Record<string, string | number | boolean | undefined | null>): string {
  // Allow absolute URLs to pass through
  if (/^https?:\/\//i.test(path)) {
    const absolute = new URL(path);
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        absolute.searchParams.set(key, String(value));
      });
    }
    return absolute.toString();
  }

  // Determine base at call time to allow client-side fallback
  let baseCandidate = ENV_BASE_WITH_PREFIX;
  if (!baseCandidate && typeof window !== 'undefined') {
    baseCandidate = joinPaths(window.location.origin, publicApiPrefix);
  }
  if (!baseCandidate) {
    throw new Error('API base URL is not configured. Set NEXT_PUBLIC_API_BASE_URL and NEXT_PUBLIC_API_PREFIX');
  }

  // Ensure base has a trailing slash for URL resolution
  const base = baseCandidate.endsWith('/') ? baseCandidate : `${baseCandidate}/`;
  const relativePath = path.replace(/^\//, '');
  const url = new URL(relativePath, base);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

export async function apiFetch<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { json, headers, body, ...rest } = options;
  const requestHeaders = new Headers(headers);

  // Attach bearer token from cookie if available (client-side only)
  if (typeof window !== 'undefined') {
    const match = document.cookie.match(/(?:^|; )upm_token=([^;]*)/);
    const token = match ? decodeURIComponent(match[1]) : null;
    if (token && !requestHeaders.has('Authorization')) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  if (json) {
    requestHeaders.set('Content-Type', 'application/json');
  }
  if (!requestHeaders.has('Accept')) {
    requestHeaders.set('Accept', 'application/json');
  }

  const response = await fetch(buildUrl(path), {
    ...rest,
    headers: requestHeaders,
    body: json && body && typeof body !== 'string' ? JSON.stringify(body) : body,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`API ${response.status} ${response.statusText}: ${errorText}`);
  }

  // Try to parse JSON, fallback to undefined
  const contentType = response.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }
  // @ts-expect-error allow returning non-JSON responses as any
  return undefined;
}

export function buildApiUrl(path: string, query?: Record<string, string | number | boolean | undefined | null>) {
  return buildUrl(path, query);
}

export async function getJson<T = unknown>(path: string, init?: Omit<RequestOptions, 'method' | 'body' | 'json'>): Promise<T> {
  return apiFetch<T>(path, { ...init, method: 'GET' });
}

export async function postJson<T = unknown, B = unknown>(path: string, body?: B, init?: Omit<RequestOptions, 'method' | 'body' | 'json'>): Promise<T> {
  return apiFetch<T>(path, { ...init, method: 'POST', body: (body as unknown) as BodyInit | null | undefined, json: true });
}

export async function putJson<T = unknown, B = unknown>(path: string, body?: B, init?: Omit<RequestOptions, 'method' | 'body' | 'json'>): Promise<T> {
  return apiFetch<T>(path, { ...init, method: 'PUT', body: (body as unknown) as BodyInit | null | undefined, json: true });
}

export async function patchJson<T = unknown, B = unknown>(path: string, body?: B, init?: Omit<RequestOptions, 'method' | 'body' | 'json'>): Promise<T> {
  return apiFetch<T>(path, { ...init, method: 'PATCH', body: (body as unknown) as BodyInit | null | undefined, json: true });
}

export async function deleteRequest<T = unknown>(path: string, init?: Omit<RequestOptions, 'method' | 'body' | 'json'>): Promise<T> {
  return apiFetch<T>(path, { ...init, method: 'DELETE' });
}


