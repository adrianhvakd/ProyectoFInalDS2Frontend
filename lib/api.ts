import { createClient as createBrowserClient } from '@/utils/supabase/client';

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const supabase = createBrowserClient();
  
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error("Error obteniendo sesión:", sessionError);
  }

  const token = session?.access_token;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  } else {
    throw new Error("Not authenticated");
  }

  try {
    const response = await fetch(`${API_URL}/${endpoint.replace(/^\//, '')}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Error inesperado' }));
      throw new Error(errorData.detail || `Error ${response.status}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error(`Error en apiFetch [${endpoint}]:`, error);
    throw error;
  }
}