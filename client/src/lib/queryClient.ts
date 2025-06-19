import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: false,
    },
  },
});

export async function apiRequest(url: string, options: RequestInit = {}) {
  const { method = 'GET', body, ...otherOptions } = options;
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...otherOptions.headers,
    },
    ...otherOptions,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} ${errorText}`);
  }

  return response.json();
}