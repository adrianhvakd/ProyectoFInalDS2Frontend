"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useSensorTrend } from "@/hooks/useSensorTrend";
import { ChartSkeleton, ChartError } from "./ChartStates";
import { BaseChartProps } from "@/types/dashboard";


export function SensorTrendChart({ sensorType, title, color = "#0087F8", companyId }: BaseChartProps) {
  const { data, isLoading, error } = useSensorTrend(sensorType, companyId);

  if (isLoading) return <ChartSkeleton />;
  if (error) return <ChartError message={error} />;

  return (
    <div className="w-full h-96 bg-base-200 p-6 rounded-2xl shadow-sm border border-neutral-content/10">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-primary">{title}</h3>
        <p className="text-sm text-slate-500">Promedios de las últimas 24 horas</p>
      </div>
      
      <div style={{ width: '100%', height: 300 }}>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`colorGrad-${sensorType}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="hora" tick={{ fill: '#64748b', fontSize: 12 }} dy={10} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              <Area
                type="monotone"
                dataKey="nivel"
                stroke={color}
                fillOpacity={1}
                fill={`url(#colorGrad-${sensorType})`}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            Sin datos disponibles para {sensorType}
          </div>
        )}
      </div>
    </div>
  );
}