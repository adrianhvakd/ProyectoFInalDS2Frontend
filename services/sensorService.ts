import { apiFetch } from "@/lib/api";
import { Sensor, SensorCreate } from "@/types/sensor";
import { DashboardSummary } from "@/types/DashboardSummary";

export const sensorService = {
  getDashboardSummary: () => 
    apiFetch<DashboardSummary>("/sensors/dashboard-summary"),

  getAllSensors: () => 
    apiFetch<Sensor[]>("/sensors/"),

  createSensor: (data: SensorCreate) => 
    apiFetch<Sensor>("/sensors/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    
  getSensorById: (id: number) => 
    apiFetch<Sensor>(`/sensors/${id}`),
};