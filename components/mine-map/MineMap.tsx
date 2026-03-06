'use client';

import { Sensor } from '@/types/sensor';
import { Zone } from '@/types/company';
import { useState } from 'react';

interface MineMapProps {
  sensors: Sensor[];
  zones?: Zone[];
  onSensorClick?: (sensor: Sensor) => void;
  onMapClick?: (x: number, y: number) => void;
  isEditorMode?: boolean;
  width?: number;
  height?: number;
  showLegend?: boolean;
}

const getSensorColor = (type: string, value?: number, maxThreshold?: number): string => {
  if (value !== undefined && maxThreshold !== undefined) {
    const percentage = (value / maxThreshold) * 100;
    if (percentage >= 80) return '#EF4444';
    if (percentage >= 60) return '#F59E0B';
  }
  
  switch (type.toLowerCase()) {
    case 'gas':
      return '#10B981';
    case 'temperatura':
      return '#3B82F6';
    default:
      return '#6B7280';
  }
};

const getSensorIcon = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'gas':
      return '💨';
    case 'temperatura':
      return '🌡️';
    default:
      return '📊';
  }
};

export default function MineMap({
  sensors,
  zones = [],
  onSensorClick,
  onMapClick,
  isEditorMode = false,
  width = 800,
  height = 600,
  showLegend = true,
}: MineMapProps) {
  const [hoveredSensor, setHoveredSensor] = useState<Sensor | null>(null);

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isEditorMode || !onMapClick) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / width) * 100;
    const y = ((e.clientY - rect.top) / height) * 100;
    
    onMapClick(x, y);
  };

  return (
    <div className="relative">
      <div className="bg-base-200 rounded-lg p-4">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className={`w-full h-auto bg-base-300 rounded ${isEditorMode ? 'cursor-crosshair' : 'cursor-default'}`}
          onClick={handleMapClick}
        >
          <defs>
            <pattern id="grid" width={width / 10} height={height / 10} patternUnits="userSpaceOnUse">
              <path d={`M ${width / 10} 0 L 0 0 0 ${height / 10}`} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          
          <rect width={width} height={height} fill="url(#grid)" />
          
          {zones.map((zone) => (
            <rect
              key={zone.id}
              x={(zone.position_x / 100) * width}
              y={(zone.position_y / 100) * height}
              width={(zone.width / 100) * width}
              height={(zone.height / 100) * height}
              fill={zone.color}
              fillOpacity={0.3}
              stroke={zone.color}
              strokeWidth="2"
              rx="4"
            />
          ))}
          
          {zones.map((zone) => (
            <text
              key={`label-${zone.id}`}
              x={(zone.position_x / 100) * width + ((zone.width / 100) * width) / 2}
              y={(zone.position_y / 100) * height + ((zone.height / 100) * height) / 2}
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontWeight="bold"
            >
              {zone.name}
            </text>
          ))}
          
          {sensors.map((sensor) => {
            const x = (sensor.position_x / 100) * width;
            const y = (sensor.position_y / 100) * height;
            const color = getSensorColor(sensor.type);
            
            return (
              <g
                key={sensor.id}
                transform={`translate(${x}, ${y})`}
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  onSensorClick?.(sensor);
                }}
                onMouseEnter={() => setHoveredSensor(sensor)}
                onMouseLeave={() => setHoveredSensor(null)}
              >
                <circle
                  r="20"
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                  className="drop-shadow-lg"
                />
                <text
                  textAnchor="middle"
                  dy="5"
                  fontSize="14"
                >
                  {getSensorIcon(sensor.type)}
                </text>
                
                {hoveredSensor?.id === sensor.id && (
                  <g>
                    <rect
                      x="-60"
                      y="-50"
                      width="120"
                      height="35"
                      fill="black"
                      fillOpacity={0.8}
                      rx="4"
                    />
                    <text
                      textAnchor="middle"
                      y="-32"
                      fill="white"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {sensor.name}
                    </text>
                    <text
                      textAnchor="middle"
                      y="-20"
                      fill="#9CA3AF"
                      fontSize="10"
                    >
                      {sensor.location}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      
      {showLegend && (
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-green-500"></span>
            <span>Gas Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-yellow-500"></span>
            <span>Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-red-500"></span>
            <span>Crítico</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-blue-500"></span>
            <span>Temperatura</span>
          </div>
        </div>
      )}
    </div>
  );
}
