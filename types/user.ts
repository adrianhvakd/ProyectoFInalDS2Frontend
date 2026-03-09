export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: 'user' | 'operator' | 'admin';
  is_active: boolean;
  created_at: string;
  company_id?: number;
}
