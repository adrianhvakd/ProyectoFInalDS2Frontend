// lib/api-client.ts
import { createClient } from '@/utils/supabase/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiClientFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...Object.fromEntries(new Headers(options.headers).entries()),
  };

  const response = await fetch(`${API_URL}/${endpoint.replace(/^\//, '')}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Error inesperado' }));
    throw new Error(errorData.detail || `Error ${response.status}`);
  }

  return response.json() as Promise<T>;
}