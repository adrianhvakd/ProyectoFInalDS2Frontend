"use client";

import { useState } from "react";
import { useAlertsRealtime } from "@/hooks/useAlertsRealtime";
import { useSensors } from "@/hooks/useSensors";
import { AlertItem } from "@/components/alerts/AlertItem";
import ModalAlertsHistory from "@/components/alerts/ModalAlertsHistory";
import { TriangleAlert, AlertTriangle, ShieldCheck, History, Trash2 } from "lucide-react";

export default function AlertsPage() {
  const { warnings, criticals, loading, resolveAlert, resolveAllBySensor, refresh } = useAlertsRealtime();
  const { sensors, loading: sensorsLoading } = useSensors();
  const [resolvingId, setResolvingId] = useState<number | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<number | "">("");
  const [resolvingAll, setResolvingAll] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleResolve = async (id: number) => {
    setResolvingId(id);
    await resolveAlert(id);
    setResolvingId(null);
  };

  const handleResolveAll = async () => {
    if (!selectedSensor) return;
    setResolvingAll(true);
    const count = await resolveAllBySensor(selectedSensor as number);
    setResolvingAll(false);
    if (count > 0) {
      alert(`Se resolvieron ${count} alertas`);
    } else {
      alert("No había alertas para resolver");
    }
  };

  if (loading || sensorsLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const totalAlerts = warnings.length + criticals.length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <TriangleAlert className="h-8 w-8" />
          Sistema de Alertas
        </h1>
        <p className="text-base-content/60 mt-2">
          Alertas en tiempo real del sistema de monitoreo
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-2 flex-wrap flex-1">
          <select
            className="select select-bordered select-sm"
            value={selectedSensor}
            onChange={(e) => setSelectedSensor(e.target.value ? Number(e.target.value) : "")}
          >
            <option value="">Seleccionar sensor</option>
            {sensors.map((sensor) => (
              <option key={sensor.id} value={sensor.id}>
                {sensor.name} ({sensor.type})
              </option>
            ))}
          </select>
          <button
            className="btn btn-success btn-sm"
            onClick={handleResolveAll}
            disabled={!selectedSensor || resolvingAll}
          >
            {resolvingAll ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Resolver todas
          </button>
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setShowHistory(true)}
        >
          <History className="h-4 w-4" />
          Ver historial
        </button>
      </div>

      {totalAlerts === 0 ? (
        <div className="card bg-base-200">
          <div className="card-body items-center text-center py-16">
            <ShieldCheck className="h-16 w-16 text-success mb-4" />
            <h2 className="text-xl font-bold">Sin alertas pendientes</h2>
            <p className="text-base-content/60">
              No hay alertas no resueltas en este momento.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {criticals.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-error flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5" />
                Alertas Críticas ({criticals.length})
              </h2>
              <div className="space-y-3">
                {criticals.map((alert) => (
                  <AlertItem
                    key={alert.id}
                    alert={alert}
                    onResolve={handleResolve}
                    resolving={resolvingId === alert.id}
                  />
                ))}
              </div>
            </section>
          )}

          {warnings.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-warning flex items-center gap-2 mb-4">
                <TriangleAlert className="h-5 w-5" />
                Advertencias ({warnings.length})
              </h2>
              <div className="space-y-3">
                {warnings.map((alert) => (
                  <AlertItem
                    key={alert.id}
                    alert={alert}
                    onResolve={handleResolve}
                    resolving={resolvingId === alert.id}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <ModalAlertsHistory 
        isOpen={showHistory} 
        onClose={() => setShowHistory(false)}
        onRefresh={refresh}
      />
    </div>
  );
}
