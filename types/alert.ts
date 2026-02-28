export interface Alert {
  id: number;
  description: string;
  severity: 'medium' | 'high';
  timestamp: string;
  is_resolved: boolean;
  reading_id: number;
}

export interface AlertWithReading extends Alert {
  sensor_name?: string;
  sensor_type?: string;
  reading_value?: number;
}
