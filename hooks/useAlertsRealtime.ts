import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Alert } from "@/types/alert";

export function useAlertsRealtime(companyId?: number) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchAlerts = useCallback(async () => {
    try {
      let query = supabase
        .from("alert")
        .select("*")
        .eq("is_resolved", false)
        .order("timestamp", { ascending: false });

      if (companyId) {
        query = query.eq("company_id", companyId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching alerts:", error.message);
        return;
      }

      setAlerts(data || []);
    } catch (err) {
      console.error("Error inesperado:", err);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchAlerts();

    const channel = supabase
      .channel("live-alerts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "alert",
          filter: "is_resolved=eq.false",
        },
        (payload) => {
          console.log("Cambio en alertas:", payload);
          fetchAlerts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAlerts]);

  const resolveAlert = async (alertId: number) => {
    try {
      const { error } = await supabase
        .from("alert")
        .update({ is_resolved: true })
        .eq("id", alertId);

      if (error) {
        console.error("Error resolving alert:", error.message);
        return false;
      }

      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
      return true;
    } catch (err) {
      console.error("Error resolving alert:", err);
      return false;
    }
  };

  const resolveAllBySensor = async (sensorId: number) => {
    if (!companyId) {
      console.error("No companyId available");
      return 0;
    }

    try {
      const { data, error } = await supabase.rpc("resolve_alerts_by_sensor_company", {
        p_sensor_id: sensorId,
        p_company_id: companyId,
      });

      if (error) {
        console.error("Error resolving all alerts:", error.message);
        return 0;
      }

      fetchAlerts();
      return data as number;
    } catch (err) {
      console.error("Error resolving all alerts:", err);
      return 0;
    }
  };

  const warnings = alerts.filter((a) => a.severity === "medium");
  const criticals = alerts.filter((a) => a.severity === "high");

  return {
    alerts,
    warnings,
    criticals,
    loading,
    resolveAlert,
    resolveAllBySensor,
    refresh: fetchAlerts,
  };
}
