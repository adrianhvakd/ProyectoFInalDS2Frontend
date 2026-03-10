import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export function useSensorRealtime(sensorId: number | string | undefined, initialValue: number = 0) {
  const [value, setValue] = useState<number>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!sensorId || sensorId === undefined) {
      setIsLoading(false);
      return;
    }

    const fetchLastValue = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('reading')
          .select('value')
          .eq('sensor_id', sensorId)
          .order('timestamp', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (error) {
          console.error(`Error en sensor ${sensorId}:`, error.message);
          return;
        }

        if (data) {
          setValue(data.value);
        }
      } catch (err) {
        console.error("Error inesperado:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLastValue();

    // Escuchar todas las lecturas y filtrar en el cliente
    const channel = supabase
      .channel(`live-sensor-${sensorId}`)
      .on(
        'postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'reading'
        },
        (payload) => {
          // Filtrar solo las lecturas de este sensor
          if (payload.new.sensor_id === sensorId) {
            console.log(`Sensor ${sensorId} - Nueva lectura:`, payload.new.value);
            setValue(payload.new.value);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sensorId]);

  return { value, isLoading };
}
