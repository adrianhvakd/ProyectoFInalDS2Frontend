"use client";

import { useEffect, useState, useRef } from "react";
import { useAlertsRealtime } from "@/hooks/useAlertsRealtime";
import { playCriticalAlert, playBeep } from "@/utils/sound";
import { Alert } from "@/types/alert";

function NotificationToast({
  alert,
  onDismiss,
}: {
  alert: Alert;
  onDismiss: () => void;
}) {
  const isCritical = alert.severity === "high";
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (hasPlayedRef.current) return;
    hasPlayedRef.current = true;

    if (isCritical) {
      playCriticalAlert();
    } else {
      playBeep(600, 100);
    }

    const timer = setTimeout(onDismiss, 8000);
    return () => clearTimeout(timer);
  }, [isCritical, onDismiss]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div
      className={`alert shadow-lg animate-slide-in-right ${
        isCritical ? "alert-error" : "alert-warning"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <div className="flex flex-col">
        <span className="font-bold">
          {isCritical ? "ALERTA CRÍTICA" : "ADVERTENCIA"}
        </span>
        <span className="text-sm">{alert.description}</span>
        <span className="text-xs opacity-70">{formatTime(alert.timestamp)}</span>
      </div>
      <button onClick={onDismiss} className="btn btn-sm btn-ghost">
        ✕
      </button>
    </div>
  );
}

export default function AlertNotifications() {
  const { criticals, loading } = useAlertsRealtime();
  const [dismissed, setDismissed] = useState<number[]>([]);
  const [newAlert, setNewAlert] = useState<Alert | null>(null);
  const prevCriticalIdsRef = useRef<number[]>([]);

  useEffect(() => {
    if (loading || criticals.length === 0) return;

    const currentIds = criticals.map((c) => c.id);
    const prevIds = prevCriticalIdsRef.current;

    const newIds = currentIds.filter((id) => !prevIds.includes(id));
    if (newIds.length > 0) {
      const newest = criticals[0];
      if (!dismissed.includes(newest.id)) {
        setNewAlert(newest);
      }
    }

    prevCriticalIdsRef.current = currentIds;
  }, [criticals, loading, dismissed]);

  const handleDismiss = (id: number) => {
    setDismissed((prev) => [...prev, id]);
    setNewAlert(null);
  };

  if (loading) return null;

  if (!newAlert) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <NotificationToast
        key={newAlert.id}
        alert={newAlert}
        onDismiss={() => handleDismiss(newAlert.id)}
      />
    </div>
  );
}
