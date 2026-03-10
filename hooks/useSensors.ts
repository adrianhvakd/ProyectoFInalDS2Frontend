import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Sensor } from "@/types/sensor";

export function useSensors(companyId?: number) {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        let query = supabase
          .from("sensor")
          .select("*")
          .eq("is_active", true)
          .order("name");

        if (companyId) {
          query = query.eq("company_id", companyId);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching sensors:", error.message);
          return;
        }

        setSensors(data || []);
      } catch (err) {
        console.error("Error fetching sensors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSensors();
  }, [companyId]);

  return { sensors, loading };
}
