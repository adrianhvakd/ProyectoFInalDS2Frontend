"use client";

import { useSensorRealtime } from "@/hooks/useSensorRealtime";
import { SensorGaugeProps } from "@/types/sensor";

export function SensorGauge({ sensorId, name, unit, max, initialValue = 0 }: SensorGaugeProps) {
  const currentValue = useSensorRealtime(String(sensorId), initialValue);
  
  const percentage = Math.min((currentValue / max) * 100, 100);
  
  const getColor = () => {
    if (percentage > 80) return "text-error";
    if (percentage > 50) return "text-warning";
    return "text-success";
  };

  return (
    <div className="bg-base-200 p-6 rounded-3xl border border-slate-100 flex flex-col items-center shadow-sm">
      <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">{name}</span>
      
      <div className="relative flex items-center justify-center">
        {/* Círculo de progreso (DaisyUI o SVG) */}
        <div 
          className={`radial-progress ${getColor()} transition-all duration-500`} 
          style={{ 
            "--value": percentage, 
            "--size": "12rem", 
            "--thickness": "1rem" 
          } as React.CSSProperties}
          role="progressbar"
        >
          <div className="flex flex-col items-center text-base-content">
            <span className="text-4xl font-black">{currentValue.toFixed(1)}</span>
            <span className="text-xs font-medium opacity-60">{unit}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2 items-center">
         <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
         </span>
         <span className="text-[10px] font-bold text-slate-400">LIVE SENSOR ID: {sensorId}</span>
      </div>
    </div>
  );
}