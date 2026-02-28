import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Sensor } from "@/types/sensor";

export function useSensors() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const { data, error } = await supabase
          .from("sensor")
          .select("*")
          .eq("is_active", true)
          .order("name");

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
  }, []);

  return { sensors, loading };
}
