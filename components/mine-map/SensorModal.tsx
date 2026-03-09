'use client';

import { Sensor } from '@/types/sensor';
import { useState, useEffect } from 'react';
import { useSensorRealtime } from '@/hooks/useSensorRealtime';
import { Copy, Check, X } from 'lucide-react';

interface SensorModalProps {
  sensor: Sensor;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (sensor: Sensor) => void;
  onDelete?: (sensorId: number) => void;
}

export default function SensorModal({ sensor, isOpen, onClose, onEdit, onDelete }: SensorModalProps) {
  const { latestReading, isLoading } = useSensorRealtime(sensor.id);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const getStatus = () => {
    if (!latestReading) return { label: 'Sin datos', color: 'text-gray-500' };
    const percentage = (latestReading.value / sensor.max_threshold) * 100;
    if (percentage >= 80) return { label: 'CRÍTICO', color: 'text-red-500' };
    if (percentage >= 60) return { label: 'WARNING', color: 'text-yellow-500' };
    return { label: 'NORMAL', color: 'text-green-500' };
  };

  const handleCopyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(sensor.api_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying:', err);
    }
  };

  const status = getStatus();
  const unit = sensor.type.toLowerCase() === 'gas' ? 'ppm' : '°C';

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-md">
        <button 
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </button>
        
        <h3 className="font-bold text-lg mb-4">
          Sensor: {sensor.name}
        </h3>
        
        <div className="flex gap-4 mb-4">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl bg-base-200">
            {sensor.type.toLowerCase() === 'gas' ? '💨' : '🌡️'}
          </div>
          
          <div className="flex-1">
            <p className="font-semibold">Estado: <span className={status.color}>{status.label}</span></p>
            <p className="text-sm text-base-content/70">Ubicación: {sensor.location}</p>
            <p className="text-sm text-base-content/70">Tipo: {sensor.type}</p>
            <p className="text-sm text-base-content/70">Rango: 0 - {sensor.max_threshold} {unit}</p>
          </div>
        </div>
        
        <div className="bg-base-200 p-4 rounded-lg mb-4">
          <p className="text-sm text-base-content/70">Valor actual:</p>
          <p className="text-3xl font-bold">
            {isLoading ? '...' : latestReading?.value ?? '--'} {unit}
          </p>
        </div>

        <div className="bg-base-200 p-4 rounded-lg mb-4">
          <p className="text-sm text-base-content/70 mb-2">API Key (para Arduino/ESP32):</p>
          <div className="flex items-center gap-2">
            <input
              type={showApiKey ? "text" : "password"}
              value={sensor.api_key || ''}
              readOnly
              className="input input-bordered input-sm flex-1 bg-base-100 font-mono text-xs"
            />
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="btn btn-sm btn-ghost"
            >
              {showApiKey ? <X className="w-4 h-4" /> : "👁️"}
            </button>
            <button
              onClick={handleCopyApiKey}
              className="btn btn-sm btn-primary"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          {copied && (
            <p className="text-xs text-success mt-1">¡Copiado al portapapeles!</p>
          )}
        </div>
        
        {sensor.description && (
          <p className="text-sm text-base-content/70 mb-4">
            Descripción: {sensor.description}
          </p>
        )}
        
        <div className="modal-action">
          {onEdit && (
            <button 
              className="btn btn-primary"
              onClick={() => onEdit(sensor)}
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button 
              className="btn btn-error"
              onClick={() => onDelete(sensor.id)}
            >
              Eliminar
            </button>
          )}
          <button className="btn" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
