"use client";

import { useState } from "react";
import { SensorTrendChart } from "@/components/charts/SensorTrendChart";

const sensorTypes = [
  { id: "Gas", label: "Gas", color: "#0087F8" },
  { id: "Temperature", label: "Temperatura", color: "#F87171" },
];

export function DashboardChart() {
  const [selectedType, setSelectedType] = useState("Gas");
  const currentType = sensorTypes.find(t => t.id === selectedType) || sensorTypes[0];

  return (
    <div className="bg-base-200 rounded-xl p-6 border border-neutral-content/10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-base-content">Tendencias de Sensores (24h)</h3>
        <div className="flex gap-2">
          {sensorTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`btn btn-sm rounded-full ${
                selectedType === type.id
                  ? "btn-primary"
                  : "btn-outline border-base-300"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
      <SensorTrendChart
        sensorType={currentType.id}
        title=""
        color={currentType.color}
      />
    </div>
  );
}
