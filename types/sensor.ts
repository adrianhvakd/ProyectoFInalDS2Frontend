export interface Sensor {
  id: number;
  name: string;
  type: string;
  description?: string;
  min_threshold: number;
  max_threshold: number;
  is_active: boolean;
  api_key?: string;
  position_x: number;
  position_y: number;
  company_id: number;
  last_value?: number;
}

export type SensorCreate = Omit<Sensor, 'id' | 'is_active'>;
export type SensorUpdate = Partial<Omit<Sensor, 'id'>>;

export interface SensorGaugeProps {
  sensorId: string | number;
  name: string;
  unit: string;
  max: number;
  initialValue?: number;
}