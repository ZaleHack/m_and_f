import { handleMockRequest, handleNetworkFailureWithMock, shouldUseMockApi } from './mockApi';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const trimmedBaseUrl = rawBaseUrl.replace(/\/+$/, '');
const API_BASE_URL = trimmedBaseUrl.endsWith('/api/v1')
  ? trimmedBaseUrl
  : `${trimmedBaseUrl}/api/v1`;

interface RequestOptions extends RequestInit {
  skipAuthHeader?: boolean;
}

const getMockResponse = async <T>(path: string, options: RequestOptions): Promise<T> => {
  const mockResponse = await handleMockRequest<T>(path, {
    method: options.method || 'GET',
    body: options.body ?? null,
    headers: options.headers,
  });

  if (mockResponse === undefined) {
    throw new Error(
      'Cette route n\'est pas encore simulée en mode démo (VITE_USE_MOCK_API=true). ' +
        'Désactivez le mode mock ou démarrez le backend pour continuer.'
    );
  }

  return mockResponse;
};

export const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { skipAuthHeader, headers, ...rest } = options;

  if (shouldUseMockApi()) {
    return getMockResponse<T>(path, options);
  }

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

  try {
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
  } catch (error) {
    if (shouldUseMockApi()) {
      const mockDirect = await handleMockRequest<T>(path, { ...rest, method: rest.method || 'GET', body: rest.body, headers });
      if (mockDirect !== undefined) return mockDirect;
      return handleNetworkFailureWithMock<T>(error, path, {
        ...rest,
        method: rest.method || 'GET',
        body: rest.body,
        headers,
      });
    }

    if (error instanceof TypeError) {
      throw new Error(
        `Impossible de contacter l'API (${API_BASE_URL}). ` +
          'Assurez-vous que le backend Node est démarré et connecté à MySQL.'
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Une erreur réseau inattendue est survenue.");
  }
};

export { API_BASE_URL };
