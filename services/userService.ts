'use client';

import { createClient } from '@/utils/supabase/client';
import { User } from '@/types/user';

const supabase = createClient();

export async function getUserProfile(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const response = await fetch('/api/users/' + user.id, {
    headers: {
      'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function getUserRole(): Promise<string> {
  const profile = await getUserProfile();
  return profile?.role || 'user';
}
