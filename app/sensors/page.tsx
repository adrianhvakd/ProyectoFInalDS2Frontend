"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { SensorGauge } from "@/components/sensors/SensorGauge";
import { Sensor } from "@/types/sensor";

export default function SensorsPage() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function getSensors() {
      const { data, error } = await supabase
        .from('sensor')
        .select('*')
        .eq('is_active', true);
      
      if (!error && data) setSensors(data);
      setLoading(false);
    }
    getSensors();
  }, []);

  if (loading) return <div className="p-10 text-center">Conectando con la mina...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-primary uppercase">Monitoreo Directo Supabase</h1>
        <p className="text-slate-500 text-sm">Bypass de API para Latencia Cero</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sensors.map((sensor) => (
          <SensorGauge 
            key={sensor.id}
            sensorId={sensor.id}
            name={sensor.name}
            unit={sensor.type === "Gas" ? "%" : "°C"}
            max={sensor.max_threshold || 100}
          />
        ))}
      </div>
    </div>
  );
}