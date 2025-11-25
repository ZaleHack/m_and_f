const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const trimmedBaseUrl = rawBaseUrl.replace(/\/+$/, '');
const API_BASE_URL = trimmedBaseUrl.endsWith('/api/v1')
  ? trimmedBaseUrl
  : `${trimmedBaseUrl}/api/v1`;

interface RequestOptions extends RequestInit {
  skipAuthHeader?: boolean;
}

export const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { skipAuthHeader, headers, ...rest } = options;

  const mergedHeaders = new Headers();
  mergedHeaders.set('Content-Type', 'application/json');

  if (!skipAuthHeader) {
    const storedToken = localStorage.getItem('mf-eats-token');
    if (storedToken) {
      mergedHeaders.set('Authorization', `Bearer ${storedToken}`);
    }
  }

  if (headers instanceof Headers) {
    headers.forEach((value, key) => mergedHeaders.set(key, value));
  } else if (Array.isArray(headers)) {
    headers.forEach(([key, value]) => mergedHeaders.set(key, String(value)));
  } else if (headers) {
    Object.entries(headers).forEach(([key, value]) => mergedHeaders.set(key, String(value)));
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...rest,
    headers: mergedHeaders,
  });

  const responseText = await response.text();
  const data = responseText ? JSON.parse(responseText) : null;

  if (!response.ok) {
    const message = data?.message || 'Une erreur est survenue lors de la requête.';
    throw new Error(message);
  }

  return data as T;
};

export { API_BASE_URL };
