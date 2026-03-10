"use client";

import { useState, useEffect } from "react";
import { SensorTrendChart } from "@/components/charts/SensorTrendChart";
import { getUserData } from "@/components/auth/actions";

const sensorTypes = [
  { id: "Gas", label: "Gas", color: "#0087F8" },
  { id: "Temperature", label: "Temperatura", color: "#F87171" },
];

export function DashboardChart() {
  const [selectedType, setSelectedType] = useState("Gas");
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);
  const currentType = sensorTypes.find(t => t.id === selectedType) || sensorTypes[0];

  useEffect(() => {
    async function loadCompanyId() {
      const userData = await getUserData();
      if (userData?.company_id) {
        setCompanyId(userData.company_id);
      }
      setIsReady(true);
    }
    loadCompanyId();
  }, []);

  if (!isReady || !companyId) {
    return (
      <div className="bg-base-200 rounded-xl p-6 border border-neutral-content/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-base-content">Tendencias de Sensores (24h)</h3>
        </div>
        <div className="h-96 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

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
        companyId={companyId}
      />
    </div>
  );
}
