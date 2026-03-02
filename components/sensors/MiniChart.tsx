"use client";

import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { useSensorMiniChart } from "@/hooks/useSensorMiniChart";

interface MiniChartProps {
  sensorId: number | string;
  color?: string;
}

export function MiniChart({ sensorId, color = "#0087F8" }: MiniChartProps) {
  const data = useSensorMiniChart(sensorId);

  if (data.length === 0) {
    return (
      <div className="h-16 flex items-center justify-center text-xs text-base-content/40">
        Sin datos
      </div>
    );
  }

  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <YAxis hide domain={["auto", "auto"]} />
          <Line
            type="monotone"
            dataKey="nivel"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
