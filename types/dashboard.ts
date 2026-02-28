export interface ChartDataPoint {
  hora: string;
  nivel: number;
}

export interface BaseChartProps {
  title: string;
  color?: string;
  sensorType: string;
}