export interface Sensor {
  id: number;
  name: string;
  type: string;
  location: string;
  description?: string;
  min_threshold: number;
  max_threshold: number;
  is_active: boolean;
}

export type SensorCreate = Omit<Sensor, 'id' | 'is_active'>;

export interface SensorGaugeProps {
  sensorId: string | number;
  name: string;
  unit: string;
  max: number;
  initialValue?: number;
}