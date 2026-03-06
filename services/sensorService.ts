import { apiFetch } from "@/lib/api";
import { Sensor, SensorCreate, SensorUpdate } from "@/types/sensor";
import { DashboardSummary } from "@/types/DashboardSummary";

export const sensorService = {
  getDashboardSummary: (companyId?: number) => {
    const url = companyId 
      ? `/sensors/dashboard-summary?company_id=${companyId}`
      : "/sensors/dashboard-summary";
    return apiFetch<DashboardSummary>(url);
  },

  getAllSensors: (companyId?: number) => {
    const url = companyId 
      ? `/sensors/?company_id=${companyId}`
      : "/sensors/";
    return apiFetch<Sensor[]>(url);
  },

  createSensor: (data: SensorCreate) => 
    apiFetch<Sensor>("/sensors/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    
  getSensorById: (id: number) => 
    apiFetch<Sensor>(`/sensors/${id}`),

  updateSensor: (id: number, data: SensorUpdate) =>
    apiFetch<Sensor>(`/sensors/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteSensor: (id: number) =>
    apiFetch<void>(`/sensors/${id}`, {
      method: "DELETE",
    }),
};