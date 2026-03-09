import { sensorService } from "@/services/sensorService";
import { StatCard } from "@/components/dashboard/StatCard";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { Gauge, AlertTriangle, CheckCircle2, Activity } from "lucide-react";

export default async function OperatorDashboard() {
  const stats = await sensorService.getDashboardSummary();

  const systemHealth = stats.sensores_totales > 0 
    ? Math.round((stats.sensores_activos / stats.sensores_totales) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-base-100 font-sans text-base-content p-6 lg:p-8">
      <main className="max-w-7xl mx-auto space-y-8">
        
        <header>
          <h1 className="text-3xl font-bold text-base-content">Dashboard</h1>
          <p className="text-base-content/60 mt-1">Monitoreo en tiempo real del sistema minero</p>
        </header>

        <AlertBanner count={stats.alertas_pendientes} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Sensores Activos" 
            value={stats.sensores_activos}
            desc={`de ${stats.sensores_totales} totales`}
            icon={<Gauge className="w-5 h-5" />}
            colorClass="text-info"
            bgClass="bg-info/10"
          />
          <StatCard 
            title="Alertas Activas" 
            value={stats.alertas_pendientes}
            desc="Requieren atención"
            icon={<AlertTriangle className="w-5 h-5" />}
            colorClass="text-error"
            bgClass="bg-error/10"
          />
          <StatCard 
            title="Temperatura Promedio" 
            value={stats.temperatura_promedio ? `${stats.temperatura_promedio.toFixed(1)}°C` : "--"}
            desc="Interior Mina"
            icon={<Activity className="w-5 h-5" />}
            colorClass="text-warning"
            bgClass="bg-warning/10"
          />
          <StatCard 
            title="Salud del Sistema" 
            value={`${systemHealth}%`}
            desc="Sensores activos"
            icon={<CheckCircle2 className="w-5 h-5" />}
            colorClass="text-success"
            bgClass="bg-success/10"
          />
        </div>

        <DashboardChart />

      </main>
    </div>
  );
}
