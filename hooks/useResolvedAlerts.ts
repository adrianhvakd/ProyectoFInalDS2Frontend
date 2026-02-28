import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Alert } from "@/types/alert";

export function useResolvedAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchAlerts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("alert")
        .select("*")
        .eq("is_resolved", true)
        .order("timestamp", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Error fetching resolved alerts:", error.message);
        return;
      }

      setAlerts(data || []);
    } catch (err) {
      console.error("Error inesperado:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return {
    alerts,
    loading,
    refresh: fetchAlerts,
  };
}
