import { useState, useEffect } from "react";
import { getReadingTrendClient } from "@/services/readingClientService";
import { TrendPoint } from "@/types/reading";
import { ChartDataPoint } from "@/types/dashboard";

export function useSensorTrend(sensorType: string, companyId?: number) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sensorType || sensorType === "undefined") return;
    if (!companyId) return;

    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log("Cargando datos para:", sensorType, "companyId:", companyId);
        const response = await getReadingTrendClient(sensorType, 24, companyId);
        console.log("Datos recibidos:", response);
        
        const formatted: ChartDataPoint[] = response.map((item: TrendPoint) => ({
          hora: item.hora,
          nivel: item.valor, 
        }));
        
        console.log("Datos formateados:", formatted);
        setData(formatted);
      } catch (err: unknown) {
        console.error(`Error en useSensorTrend [${sensorType}]:`, err);
        const errorMessage = err instanceof Error ? err.message : "Error al cargar datos";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [sensorType, companyId]);

  return { data, isLoading, error };
}