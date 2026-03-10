export interface Company {
  id: number;
  name: string;
  industry: string;
  public_token: string;
  is_public_enabled: boolean;
  created_at: string;
  created_by?: string;
  service_id?: number;
  subscription_start?: string;
  subscription_end?: string;
  is_subscription_active: boolean;
}

export interface CompanyCreate {
  name: string;
  industry?: string;
}

export interface CompanyUpdate {
  name?: string;
  industry?: string;
  is_public_enabled?: boolean;
}

export interface Zone {
  id: number;
  company_id: number;
  name: string;
  color: string;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  description?: string;
}

export interface ZoneCreate {
  company_id: number;
  name: string;
  color?: string;
  position_x: number;
  position_y: number;
  width?: number;
  height?: number;
  description?: string;
}
