"use client";

import { useResolvedAlerts } from "@/hooks/useResolvedAlerts";
import { Alert } from "@/types/alert";
import { X, CheckCircle, History } from "lucide-react";
import { useEffect } from "react";

interface ModalAlertsHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

function ResolvedAlertItem({ alert }: { alert: Alert }) {
  const isCritical = alert.severity === "high";

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("es-ES", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`card bg-base-200 shadow-sm border-l-4 ${
        isCritical ? "border-l-error/50" : "border-l-warning/50"
      } opacity-75`}
    >
      <div className="card-body p-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`badge badge-sm ${
                  isCritical ? "badge-error" : "badge-warning"
                } badge-outline`}
              >
                {isCritical ? "CRÍTICO" : "ADVERTENCIA"}
              </span>
              <span className="text-xs opacity-60">
                {formatDate(alert.timestamp)}
              </span>
            </div>
            <p className="text-sm truncate">{alert.description}</p>
            <p className="text-xs opacity-50">Reading ID: {alert.reading_id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ModalAlertsHistory({ isOpen, onClose, onRefresh }: ModalAlertsHistoryProps) {
  const { alerts, loading, refresh } = useResolvedAlerts();

  useEffect(() => {
    if (isOpen && onRefresh) {
      onRefresh();
    }
  }, [isOpen, onRefresh]);

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-base-300">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-lg">Historial de Alertas Resueltas</h3>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="py-4 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
              <p className="text-base-content/60">No hay alertas resueltas</p>
            </div>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <ResolvedAlertItem key={alert.id} alert={alert} />
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-base-300">
          <p className="text-sm text-base-content/60 text-center">
            Mostrando las últimas 100 alertas resueltas
          </p>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
