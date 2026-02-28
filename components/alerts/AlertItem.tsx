"use client";

import { Alert } from "@/types/alert";

interface AlertItemProps {
  alert: Alert;
  onResolve: (id: number) => Promise<void>;
  resolving: boolean;
}

export function AlertItem({ alert, onResolve, resolving }: AlertItemProps) {
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
        isCritical ? "border-l-error" : "border-l-warning"
      }`}
    >
      <div className="card-body p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`badge ${
                  isCritical ? "badge-error" : "badge-warning"
                } badge-sm`}
              >
                {isCritical ? "CRÍTICO" : "ADVERTENCIA"}
              </span>
              <span className="text-xs opacity-60">
                {formatDate(alert.timestamp)}
              </span>
            </div>
            <p className="text-sm">{alert.description}</p>
            <p className="text-xs opacity-50 mt-1">
              Reading ID: {alert.reading_id}
            </p>
          </div>
          <button
            onClick={() => onResolve(alert.id)}
            disabled={resolving}
            className="btn btn-success btn-sm"
          >
            {resolving ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              "Resolver"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
