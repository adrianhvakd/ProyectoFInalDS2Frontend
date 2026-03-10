export interface SubscriptionPayment {
  id: number;
  company_id: number;
  service_id: number;
  period_start: string;
  period_end: string;
  amount: number;
  status: 'pending' | 'pending_review' | 'approved' | 'rejected';
  payment_type: 'initial' | 'renewal' | 'upgrade' | 'downgrade';
  payment_proof_filename?: string;
  paid_at?: string;
  created_at: string;
  approved_by?: string;
}

export interface SubscriptionCompany {
  id: number;
  name: string;
  service_id?: number;
  is_subscription_active: boolean;
  subscription_start?: string;
  subscription_end?: string;
  days_remaining: number;
}

export interface SubscriptionInfo {
  company: SubscriptionCompany;
  subscription?: SubscriptionPayment;
}

export interface RenewalCalculation {
  service_id: number;
  service_name: string;
  price: number;
  days_remaining: number;
  total_to_pay: number;
}

export interface UpgradeCalculation {
  current_service: {
    id: number;
    name: string;
    price: number;
    days_remaining: number;
    credit: number;
  };
  new_service: {
    id: number;
    name: string;
    price: number;
  };
  amount_to_pay: number;
  new_period_days: number;
}

export interface DowngradeCalculation {
  current_service: {
    id: number;
    name: string;
    price: number;
  };
  new_service: {
    id: number;
    name: string;
    price: number;
  };
  days_remaining: number;
  effective_date: string;
  message: string;
}

export type SubscriptionAction = 'contract' | 'renew' | 'upgrade' | 'downgrade';

export interface ServiceButtonConfig {
  label: string;
  action: SubscriptionAction;
  disabled: boolean;
  currentPlan: boolean;
}
