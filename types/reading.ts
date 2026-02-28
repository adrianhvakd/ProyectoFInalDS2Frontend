export interface Reading {
  id: number;
  value: number;
  timestamp: string;
  sensor_id: number;
}

export interface TrendPoint {
  hora: string;
  valor: number;
}

export interface ReadingTrendResponse {
  data: TrendPoint[];
  sensor_type: string;
}