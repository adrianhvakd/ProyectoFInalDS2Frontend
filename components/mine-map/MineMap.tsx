'use client';

import { Sensor } from '@/types/sensor';
import { Zone } from '@/types/company';
import { useState } from 'react';
import { useSensorRealtime } from '@/hooks/useSensorRealtime';
import { Thermometer, Wind, Activity } from 'lucide-react';

interface MineMapProps {
  sensors: Sensor[];
  zones?: Zone[];
  onSensorClick?: (sensor: Sensor) => void;
  onMapClick?: (x: number, y: number) => void;
  isEditorMode?: boolean;
  showLegend?: boolean;
}

const getSensorIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'gas':
      return Wind;
    case 'temperatura':
      return Thermometer;
    default:
      return Activity;
  }
};

const MAP_WIDTH = 100;
const MAP_HEIGHT = 100;

interface SensorMarkerProps {
  sensor: Sensor;
  onClick: () => void;
  onHover: (show: boolean) => void;
}

function SensorMarker({ sensor, onClick, onHover }: SensorMarkerProps) {
  const { value } = useSensorRealtime(sensor.id, sensor.last_value || 0);
  const maxThreshold = sensor.max_threshold || 100;
  const percentage = maxThreshold > 0 ? (value / maxThreshold) * 100 : 0;
  const Icon = getSensorIcon(sensor.type);
  
  const getColor = () => {
    if (percentage >= 80) return '#EF4444';
    if (percentage >= 60) return '#F59E0B';
    return '#10B981';
  };

  const displayValue = value !== undefined ? value.toFixed(1) : '--';

  return (
    <g
      className="cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <circle
        r="16"
        fill="rgba(30, 30, 30, 0.95)"
        stroke={getColor()}
        strokeWidth="2"
      />
      <foreignObject x="-10" y="-10" width="20" height="20" className="overflow-visible">
        <div className="flex items-center justify-center w-full h-full">
          <Icon size={12} color={getColor()} strokeWidth={2.5} />
        </div>
      </foreignObject>
      <text textAnchor="middle" y="28" fill="white" fontSize="9" fontWeight="bold">
        {displayValue}
      </text>
    </g>
  );
}

function SensorTooltip({ sensor }: { sensor: Sensor }) {
  const { value } = useSensorRealtime(sensor.id, sensor.last_value || 0);
  const maxThreshold = sensor.max_threshold || 100;
  const percentage = maxThreshold > 0 ? (value / maxThreshold) * 100 : 0;
  const unit = sensor.type.toLowerCase() === 'gas' ? 'ppm' : '°C';
  
  return (
    <g transform="translate(0, -35)">
      <rect x="-55" y="-30" width="110" height="35" fill="rgba(0, 0, 0, 0.95)" rx="6" />
      <text x="0" y="-15" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
        {sensor.name}
      </text>
      <text x="0" y="-3" textAnchor="middle" fill={percentage >= 80 ? '#EF4444' : percentage >= 60 ? '#F59E0B' : '#10B981'} fontSize="10" fontWeight="bold">
        {value !== undefined ? value.toFixed(1) : '--'} {unit}
      </text>
    </g>
  );
}

export default function MineMap({
  sensors,
  zones = [],
  onSensorClick,
  onMapClick,
  isEditorMode = false,
  showLegend = true,
}: MineMapProps) {
  const [hoveredSensor, setHoveredSensor] = useState<Sensor | null>(null);

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isEditorMode || !onMapClick) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    onMapClick(x, y);
  };

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-lg bg-base-300 border border-base-300" style={{ height: MAP_HEIGHT * 4 }}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className={`w-full h-full ${isEditorMode ? 'cursor-crosshair' : 'cursor-default'}`}
          onClick={handleMapClick}
        >
          <defs>
            <pattern id="grid-map" width={MAP_WIDTH / 8} height={MAP_HEIGHT / 8} patternUnits="userSpaceOnUse">
              <path d={`M ${MAP_WIDTH / 8} 0 L 0 0 0 ${MAP_HEIGHT / 8}`} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#grid-map)" />
          
          {zones.map((zone) => (
            <rect
              key={zone.id}
              x={(zone.position_x / 100) * MAP_WIDTH}
              y={(zone.position_y / 100) * MAP_HEIGHT}
              width={(zone.width / 100) * MAP_WIDTH}
              height={(zone.height / 100) * MAP_HEIGHT}
              fill={zone.color}
              fillOpacity={0.2}
              stroke={zone.color}
              strokeWidth={1.5}
              rx="3"
            />
          ))}
          
          {zones.map((zone) => (
            <text
              key={`label-${zone.id}`}
              x={(zone.position_x / 100) * MAP_WIDTH + ((zone.width / 100) * MAP_WIDTH) / 2}
              y={(zone.position_y / 100) * MAP_HEIGHT + ((zone.height / 100) * MAP_HEIGHT) / 2}
              textAnchor="middle"
              fill="white"
              fontSize={10}
              fontWeight="bold"
            >
              {zone.name}
            </text>
          ))}
          
          {sensors.map((sensor) => {
            const x = (sensor.position_x / 100) * MAP_WIDTH;
            const y = (sensor.position_y / 100) * MAP_HEIGHT;
            
            return (
              <g key={sensor.id} transform={`translate(${x}, ${y})`}>
                <SensorMarker
                  sensor={sensor}
                  onClick={() => onSensorClick?.(sensor)}
                  onHover={setHoveredSensor}
                />
                {hoveredSensor?.id === sensor.id && (
                  <SensorTooltip sensor={sensor} />
                )}
              </g>
            );
          })}
        </svg>
      </div>
      
      {showLegend && (
        <div className="mt-2 flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
            <span>Advertencia</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>Crítico</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="w-3 h-3 text-green-500" />
            <span>Gas</span>
          </div>
          <div className="flex items-center gap-1">
            <Thermometer className="w-3 h-3 text-blue-500" />
            <span>Temp</span>
          </div>
        </div>
      )}
    </div>
  );
}
