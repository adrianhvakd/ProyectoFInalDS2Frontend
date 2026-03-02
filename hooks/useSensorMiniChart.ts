import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { ChartDataPoint } from "@/types/dashboard";

export function useSensorMiniChart(sensorId: number | string) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: readings } = await supabase
        .from("reading")
        .select("value, timestamp")
        .eq("sensor_id", sensorId)
        .order("timestamp", { ascending: false })
        .limit(20);

      if (readings) {
        const formatted = readings.reverse().map((r) => ({
          hora: new Date(r.timestamp).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
          nivel: r.value,
        }));
        setData(formatted);
      }
    };

    fetchData();

    const channel = supabase
      .channel(`mini-chart-${sensorId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "reading",
          filter: `sensor_id=eq.${sensorId}`,
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sensorId]);

  return data;
}
