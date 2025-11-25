const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface RequestOptions extends RequestInit {
  skipAuthHeader?: boolean;
}

export const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { skipAuthHeader, headers, ...rest } = options;

  const mergedHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(skipAuthHeader ? {} : headers),
  };

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
