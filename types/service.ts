export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  duration_days: number;
  max_operators: number;
  plan_level: number;
  has_ai: boolean;
  has_advanced_reports: boolean;
  has_priority_notifications: boolean;
}

export interface ServiceFeature {
  name: string;
  included: boolean;
}

export function parseFeatures(featuresJson: string): ServiceFeature[] {
  try {
    return JSON.parse(featuresJson);
  } catch {
    return [];
  }
}
