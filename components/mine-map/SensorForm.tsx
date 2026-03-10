'use client';

import { Sensor, SensorCreate, SensorUpdate } from '@/types/sensor';
import { useState } from 'react';

interface SensorFormProps {
  sensor?: Sensor;
  companyId: number;
  existingSensors?: Sensor[];
  onSubmit: (data: SensorCreate | SensorUpdate) => Promise<void>;
  onCancel: () => void;
}

export default function SensorForm({ sensor, companyId, existingSensors = [], onSubmit, onCancel }: SensorFormProps) {
  const [formData, setFormData] = useState({
    name: sensor?.name || '',
    type: sensor?.type || 'Gas',
    description: sensor?.description || '',
    min_threshold: sensor?.min_threshold ?? 0,
    max_threshold: sensor?.max_threshold ?? 100,
    position_x: sensor?.position_x ?? 50,
    position_y: sensor?.position_y ?? 50,
    company_id: companyId,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePositionClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setFormData(prev => ({
      ...prev,
      position_x: Math.round(x * 10) / 10,
      position_y: Math.round(y * 10) / 10,
    }));
  };

  const otherSensors = existingSensors.filter(s => s.id !== sensor?.id);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text">Nombre del Sensor</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Tipo</span>
          </label>
          <select
            className="select select-bordered"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="Gas">Gas</option>
            <option value="Temperatura">Temperatura</option>
          </select>
        </div>
        
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text">Descripción (opcional)</span>
          </label>
          <textarea
            className="textarea textarea-bordered"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Umbral Mínimo</span>
          </label>
          <input
            type="number"
            className="input input-bordered"
            value={formData.min_threshold}
            onChange={(e) => setFormData({ ...formData, min_threshold: parseFloat(e.target.value) })}
            required
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Umbral Máximo</span>
          </label>
          <input
            type="number"
            className="input input-bordered"
            value={formData.max_threshold}
            onChange={(e) => setFormData({ ...formData, max_threshold: parseFloat(e.target.value) })}
            required
          />
        </div>
        
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text">Posición en el Mapa</span>
          </label>
          <div
            className="relative w-full h-40 bg-base-300 rounded-lg cursor-crosshair border-2 border-dashed border-base-content/30"
            onClick={handlePositionClick}
          >
            {otherSensors.map((s) => (
              <div
                key={s.id}
                className="absolute w-3 h-3 bg-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 border border-white"
                style={{
                  left: `${s.position_x}%`,
                  top: `${s.position_y}%`,
                }}
                title={s.name}
              />
            ))}
            <div
              className="absolute w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all ring-2 ring-white ring-offset-1 ring-offset-base-300"
              style={{
                left: `${formData.position_x}%`,
                top: `${formData.position_y}%`,
              }}
            />
            <p className="absolute bottom-2 left-2 text-xs text-base-content/50">
              Click para posicionar • Los puntos morados son sensores existentes
            </p>
          </div>
          
          <div className="flex gap-4 mt-2">
            <div className="form-control flex-1">
              <label className="label py-1">
                <span className="label-text-alt">X: {formData.position_x.toFixed(1)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="0.5"
                className="range range-primary range-xs"
                value={formData.position_x}
                onChange={(e) => setFormData({ ...formData, position_x: parseFloat(e.target.value) })}
              />
            </div>
            <div className="form-control flex-1">
              <label className="label py-1">
                <span className="label-text-alt">Y: {formData.position_y.toFixed(1)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="0.5"
                className="range range-primary range-xs"
                value={formData.position_y}
                onChange={(e) => setFormData({ ...formData, position_y: parseFloat(e.target.value) })}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="modal-action">
        <button type="button" className="btn" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : sensor ? 'Actualizar' : 'Crear Sensor'}
        </button>
      </div>
    </form>
  );
}
