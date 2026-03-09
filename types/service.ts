export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
