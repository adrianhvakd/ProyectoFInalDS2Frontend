import { createClient as createBrowserClient } from '@/utils/supabase/client';
import { createServerClient } from '@supabase/ssr';

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PROXY_URL = '/api/proxy';

async function getSupabaseServerClient() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const isServer = typeof window === 'undefined';
  
  let session;
  
  if (isServer) {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } else {
    const supabase = createBrowserClient();
    const { data } = await supabase.auth.getSession();
    session = data.session;
  }

  if (!session) {
    throw new Error("Not authenticated");
  }

  const url = isServer 
    ? `${API_URL}/${endpoint.replace(/^\//, '')}`
    : `${PROXY_URL}${endpoint}`;

  const token = session?.access_token;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
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