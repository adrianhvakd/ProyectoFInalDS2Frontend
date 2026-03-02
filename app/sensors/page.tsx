"use client";

import { useState } from "react";
import { useSensors } from "@/hooks/useSensors";
import { useSensorRealtime } from "@/hooks/useSensorRealtime";
import { Plus } from "lucide-react";

type FilterType = "all" | "active" | "inactive";

function SensorCard({ sensor, isActive }: { sensor: any; isActive: boolean }) {
  const value = useSensorRealtime(String(sensor.id), 0);
  const percentage = Math.min((value / sensor.max_threshold) * 100, 100);
  
  let status: "normal" | "warning" | "critical" = "normal";
  if (percentage >= 100) status = "critical";
  else if (percentage >= 70) status = "warning";
  
  const unit = sensor.type === "Gas" ? "ppm" : "°C";
  
  const getBorderClass = (s: string) => {
    if (s === "critical") return "border-error";
    if (s === "warning") return "border-warning";
    return "border-success";
  };

  const getBadgeClass = (s: string) => {
    if (s === "critical") return "badge-error";
    if (s === "warning") return "badge-warning";
    return "badge-success";
  };

  return (
    <div className={`bg-base-200 rounded-xl p-5 shadow-sm border-t-[3px] ${getBorderClass(status)}`}>
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-bold text-base-content">{sensor.name}</h3>
        <span className={`badge ${getBadgeClass(status)}`}>
          {status === "critical" ? "CRITICAL" : status === "warning" ? "WARNING" : "NORMAL"}
        </span>
      </div>
      <p className="text-xs text-base-content/50 mb-4 flex items-center gap-1">
        Ubicacion: {sensor.location || "Sin ubicación"}
      </p>

      <div className="flex items-center gap-5 mb-3">
        <div className="relative w-[120px] h-[120px] flex-shrink-0">
          <div 
            className={`radial-progress ${
              status === "critical" ? "text-error" : status === "warning" ? "text-warning" : "text-success"
            }`}
            style={{ 
              "--value": percentage, 
              "--size": "120px", 
              "--thickness": "11px"
            } as React.CSSProperties}
            role="progressbar"
          >
            <div className="flex flex-col items-center text-base-content">
              <span className="text-2xl font-bold">{value.toFixed(0)}</span>
              <span className="text-xs opacity-60">{unit}</span>
            </div>
          </div>
        </div>
        <div className="flex-1 flex gap-2">
          <div className="flex-1 bg-base-300/50 rounded-lg p-3 flex flex-col justify-center">
            <div className="text-[11px] text-base-content/60 mb-1 font-medium uppercase tracking-wide">Valor Actual</div>
            <div className="text-[26px] font-extrabold leading-none text-base-content">
              {value.toFixed(0)}<span className="text-[13px] font-medium text-base-content/60 ml-0.5">{unit}</span>
            </div>
          </div>
          <div className="flex-1 bg-base-300/50 rounded-lg p-3 flex flex-col justify-center">
            <div className="text-[11px] text-base-content/60 mb-1 font-medium uppercase tracking-wide">Umbral Máximo</div>
            <div className="text-[26px] font-extrabold leading-none text-base-content">
              {sensor.max_threshold}<span className="text-[13px] font-medium text-base-content/60 ml-0.5">{unit}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-base-content/40 mb-4">
        Rango: 0 – {sensor.max_threshold} {unit}
      </p>

      <div className="flex justify-between items-center pt-3 border-t border-base-300/50">
        <span className={`text-sm flex items-center gap-1 ${isActive ? "text-success" : "text-base-content/50"}`}>
          {isActive ? "〜 Activo" : "Inactivo"}
        </span>
        <div className="flex gap-2">
          <button className="btn btn-xs btn-outline border-base-300">
            ↗ Ver Tendencia
          </button>
          <button className="btn btn-xs btn-square btn-outline border-base-300">
            ⚙
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SensorsPage() {
  const { sensors, loading } = useSensors();
  const [filter, setFilter] = useState<FilterType>("all");

  if (loading) return <div className="p-10 text-center">Conectando con la mina...</div>;

  const activeSensors = sensors;
  const filteredSensors = filter === "inactive" ? [] : activeSensors;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <header className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-base-content">Gestión de Sensores</h1>
            <p className="text-base-content/60 mt-1">{activeSensors.length} sensores activos</p>
          </div>
          <button className="btn btn-primary gap-2">
            <Plus className="w-4 h-4" />
            Agregar Sensor
          </button>
        </div>
      </header>

      <div className="flex items-center gap-2 mb-6">
        <span className="text-base-content/50">▽</span>
        {(["all", "active", "inactive"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn btn-sm rounded-full ${
              filter === f ? "btn-primary" : "btn-outline border-base-300"
            }`}
          >
            {f === "all" ? "Todos" : f === "active" ? "Activos" : "Inactivos"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSensors.map((sensor) => (
          <SensorCard key={sensor.id} sensor={sensor} isActive={sensor.is_active} />
        ))}
      </div>

      {filteredSensors.length === 0 && (
        <div className="text-center py-12 text-base-content/50">
          No hay sensores para mostrar
        </div>
      )}
    </div>
  );
}