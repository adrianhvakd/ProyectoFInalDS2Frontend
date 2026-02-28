export interface DashboardSummary {
  gases_criticos: number | null;
  temperatura_promedio: number | null;
  sensores_activos: number;
  sensores_totales: number;
  alertas_pendientes: number;
}