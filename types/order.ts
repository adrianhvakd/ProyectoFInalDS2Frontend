export type OrderStatus = 'pending' | 'pending_review' | 'approved' | 'rejected';

export interface Order {
  id: number;
  user_id: string;
  service_id: number;
  company_name: string;
  company_address: string;
  company_phone: string;
  status: OrderStatus;
  payment_proof_filename: string | null;
  created_at: string;
  updated_at: string;
  approved_by: string | null;
}

export interface OrderCreate {
  service_id: number;
  company_name: string;
  company_address: string;
  company_phone: string;
}
