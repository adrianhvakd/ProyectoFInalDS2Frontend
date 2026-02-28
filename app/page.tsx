import Image from "next/image";
import { sensorService } from "@/services/sensorService";
import { StatCard } from "@/components/dashboard/StatCard";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { SensorTrendChart } from "@/components/charts/SensorTrendChart";

export default async function Home() {
  const stats = await sensorService.getDashboardSummary();

  return (
    <div className="min-h-screen bg-base-100 font-sans text-base-content p-8">
      <main className="max-w-5xl mx-auto space-y-10">
        
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-neutral pb-6">
          <div className="flex items-center gap-4">
            <Image className="dark:invert grayscale opacity-80" src="/next.svg" alt="Logo" width={100} height={20} priority />
            <div className="divider divider-horizontal"></div>
            <h1 className="text-xl font-bold tracking-widest uppercase text-primary">Mining Control</h1>
          </div>
          <div className="badge badge-success badge-soft gap-2 py-3 px-4">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
             </span>
             ONLINE
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Gases Críticos" 
            value={`${stats.gases_criticos?.toFixed(2) ?? "0.00"}%`}
            desc="Nivel de Metano"
            colorClass="text-primary"
          />
          <StatCard 
            title="Temperatura Media" 
            value={`${stats.temperatura_promedio?.toFixed(1) ?? "--"}°C`}
            desc="Interior Mina"
            colorClass="text-secondary"
          />
          <StatCard 
            title="Estado de Red" 
            value={`${stats.sensores_activos} / ${stats.sensores_totales}`}
            desc="Sensores activos"
            colorClass="text-accent"
          />
        </section>

        <AlertBanner count={stats.alertas_pendientes} />

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SensorTrendChart 
            sensorType="Gas" 
            title="Tendencia de Gases (Metano/CO2)" 
            color="#0087F8" 
          />

          <SensorTrendChart 
            sensorType="Temperature" 
            title="Historial de Temperatura" 
            color="#F87171" 
          />
        </section>

      </main>
    </div>
  );
}