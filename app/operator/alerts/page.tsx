"use client";

import { useState, useEffect } from "react";
import { useAlertsRealtime } from "@/hooks/useAlertsRealtime";
import { useSensors } from "@/hooks/useSensors";
import ModalAlertsHistory from "@/components/alerts/ModalAlertsHistory";
import { createClient } from "@/utils/supabase/client";
import { getUserData } from "@/components/auth/actions";
import { Alert } from "@/types/alert";
import { TriangleAlert, AlertTriangle, ShieldCheck, History, Trash2, Download, TrendingUp, CheckCircle, XCircle, Clock } from "lucide-react";

type FilterType = "all" | "active" | "resolved";

export default function OperatorAlertsPage() {
  const [companyId, setCompanyId] = useState<number | null>(null);
  const { warnings, criticals, loading, resolveAlert, resolveAllBySensor, refresh } = useAlertsRealtime(companyId ?? undefined);
  const { sensors, loading: sensorsLoading } = useSensors(companyId ?? undefined);
  const [resolvingId, setResolvingId] = useState<number | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<number | "">("");
  const [resolvingAll, setResolvingAll] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [resolvedAlerts, setResolvedAlerts] = useState<Alert[]>([]);
  const [resolvedTotalCount, setResolvedTotalCount] = useState(0);
  const [resolvedLoading, setResolvedLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadCompanyId() {
      const userData = await getUserData();
      if (userData?.company_id) {
        setCompanyId(userData.company_id);
      }
    }
    loadCompanyId();
  }, []);

  useEffect(() => {
    async function fetchResolved() {
      if (!companyId) return;
      setResolvedLoading(true);
      const { count } = await supabase
        .from("alert")
        .select("*", { count: "exact", head: true })
        .eq("is_resolved", true)
        .eq("company_id", companyId);
      setResolvedTotalCount(count || 0);

      const { data } = await supabase
        .from("alert")
        .select("*")
        .eq("is_resolved", true)
        .eq("company_id", companyId)
        .order("timestamp", { ascending: false })
        .limit(10);
      if (data) setResolvedAlerts(data);
      setResolvedLoading(false);
    }
    fetchResolved();
  }, [companyId]);

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

  const isLoading = loading || sensorsLoading || resolvedLoading;

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="skeleton h-8 w-64 mb-2"></div>
              <div className="skeleton h-4 w-48"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-base-200 rounded-xl p-4 border border-neutral-content/10">
              <div className="flex items-center gap-3">
                <div className="skeleton w-10 h-10 rounded-full"></div>
                <div>
                  <div className="skeleton h-3 w-20 mb-1"></div>
                  <div className="skeleton h-6 w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="bg-base-200 rounded-xl p-5 border-l-4 skeleton border-l-base-300">
              <div className="flex items-start gap-4">
                <div className="skeleton w-10 h-10 rounded-full"></div>
                <div className="flex-1">
                  <div className="skeleton h-4 w-3/4 mb-2"></div>
                  <div className="skeleton h-3 w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const activeAlerts = [...criticals, ...warnings];
  const highCount = criticals.length;
  const mediumCount = warnings.length;

  const formatCount = (count: number) => count > 999 ? "999+" : count;

  const getFilteredAlerts = () => {
    if (filter === "active") return activeAlerts;
    if (filter === "resolved") return resolvedAlerts;
    return [...activeAlerts, ...resolvedAlerts];
  };

  const filteredAlerts = getFilteredAlerts();

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-base-content">Gestión de Alertas</h1>
            <p className="text-base-content/60 mt-1">{activeAlerts.length} alertas activas • {highCount} críticas</p>
          </div>
          <button className="btn btn-outline border-base-300 gap-2">
            <Download className="w-4 h-4" />
            Exportar Reporte
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-base-200 rounded-xl p-4 border border-neutral-content/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-error" />
            </div>
            <div>
              <p className="text-xs text-base-content/60">Alertas Activas</p>
              <p className="text-2xl font-bold text-base-content">{activeAlerts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-base-200 rounded-xl p-4 border border-neutral-content/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-base-content/60">Resueltas</p>
              <p className="text-2xl font-bold text-base-content">{formatCount(resolvedTotalCount)}</p>
            </div>
          </div>
        </div>
        <div className="bg-base-200 rounded-xl p-4 border border-neutral-content/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-error/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-error"/>
            </div>
            <div>
              <p className="text-xs text-base-content/60">Alta Severidad</p>
              <p className="text-2xl font-bold text-base-content">{highCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-base-200 rounded-xl p-4 border border-neutral-content/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
              <TriangleAlert className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-base-content/60">Media Severidad</p>
              <p className="text-2xl font-bold text-base-content">{mediumCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-2">
          {(["all", "active", "resolved"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-sm rounded-full ${
                filter === f 
                  ? "btn-primary" 
                  : "btn-outline border-base-300"
              }`}
            >
              {f === "all" ? "Todas" : f === "active" ? "Activas" : "Resueltas"}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-1 justify-end">
          <select
            className="select select-bordered select-sm rounded-lg"
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
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setShowHistory(true)}
          >
            <History className="h-4 w-4" />
            Ver historial
          </button>
        </div>
      </div>

      {filteredAlerts.length === 0 ? (
        <div className="card bg-base-200">
          <div className="card-body items-center text-center py-16">
            <ShieldCheck className="h-16 w-16 text-success mb-4" />
            <h2 className="text-xl font-bold">Sin alertas</h2>
            <p className="text-base-content/60">
              No hay alertas para mostrar.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-base-200 rounded-xl p-5 border-l-4 shadow-sm ${
                alert.is_resolved 
                  ? "border-l-success" 
                  : alert.severity === "high" 
                    ? "border-l-error" 
                    : "border-l-warning"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  alert.is_resolved 
                    ? "bg-success/20" 
                    : alert.severity === "high" 
                      ? "bg-error/20" 
                      : "bg-warning/20"
                }`}>
                  {alert.is_resolved ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : alert.severity === "high" ? (
                    <XCircle className="w-5 h-5 text-error" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-base-content">{alert.description}</span>
                    <span className={`badge badge-sm ${
                      alert.is_resolved 
                        ? "badge-success" 
                        : alert.severity === "high" 
                          ? "badge-error" 
                          : "badge-warning"
                    }`}>
                      {alert.is_resolved ? "Resuelta" : alert.severity === "high" ? "Alta" : "Media"}
                    </span>
                  </div>
                  <p className="text-xs text-base-content/50 flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3" /> {new Date(alert.timestamp).toLocaleString("es-ES")}
                  </p>
                  <p className="text-xs text-base-content/50">Reading ID: {alert.reading_id}</p>
                </div>
                <div className="flex gap-2">
                  {!alert.is_resolved && (
                    <>
                      <button className="btn btn-sm btn-outline border-base-300">
                        Ver Detalles
                      </button>
                      <button
                        onClick={() => handleResolve(alert.id)}
                        disabled={resolvingId === alert.id}
                        className="btn btn-success btn-sm"
                      >
                        {resolvingId === alert.id ? (
                          <span className="loading loading-spinner loading-xs" />
                        ) : (
                          "Resolver"
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
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
