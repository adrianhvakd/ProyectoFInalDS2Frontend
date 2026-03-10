'use client';

import { useState, useEffect } from 'react';
import { sensorService } from '@/services/sensorService';
import { Sensor, SensorCreate, SensorUpdate } from '@/types/sensor';
import { companyService } from '@/services/companyService';
import { Company } from '@/types/company';
import MineMap from '@/components/mine-map/MineMap';
import SensorModal from '@/components/mine-map/SensorModal';
import SensorForm from '@/components/mine-map/SensorForm';

export default function MineMapPage() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSensor, setEditingSensor] = useState<Sensor | undefined>();
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const companies = await companyService.getAll();
      if (companies.length > 0) {
        setCompany(companies[0]);
        const sensorsData = await sensorService.getAllSensors(companies[0].id);
        setSensors(sensorsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSensorClick = (sensor: Sensor) => {
    setSelectedSensor(sensor);
  };

  const handleCreateSensor = () => {
    setEditingSensor(undefined);
    setIsFormOpen(true);
  };

  const handleEditSensor = (sensor: Sensor) => {
    setEditingSensor(sensor);
    setIsFormOpen(true);
    setSelectedSensor(null);
  };

  const handleSubmit = async (data: SensorCreate | SensorUpdate) => {
    if (!company) return;

    try {
      if (editingSensor) {
        const updated = await sensorService.updateSensor(editingSensor.id, data);
        setSensors(prev => prev.map(s => s.id === updated.id ? updated : s));
      } else {
        const created = await sensorService.createSensor(data as SensorCreate);
        setSensors(prev => [...prev, created]);
      }
      setIsFormOpen(false);
      setEditingSensor(undefined);
    } catch (error) {
      console.error('Error saving sensor:', error);
    }
  };

  const handleDeleteSensor = async (sensorId: number) => {
    if (!confirm('¿Estás seguro de eliminar este sensor?')) return;
    
    try {
      await sensorService.deleteSensor(sensorId);
      setSensors(prev => prev.filter(s => s.id !== sensorId));
      setSelectedSensor(null);
    } catch (error) {
      console.error('Error deleting sensor:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {company ? company.name : 'Mina'} - Mapa de Sensores
          </h1>
          <p className="text-base-content/70">
            {sensors.length} sensores configurados
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            className={`btn ${isEditorMode ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setIsEditorMode(!isEditorMode)}
          >
            {isEditorMode ? '✓ Editor Activo' : 'Modo Editor'}
          </button>
          {isEditorMode && (
            <button className="btn btn-primary" onClick={handleCreateSensor}>
              + Agregar Sensor
            </button>
          )}
        </div>
      </div>

      {sensors.length === 0 ? (
        <div className="text-center py-12 bg-base-200 rounded-lg">
          <p className="text-base-content/70 mb-4">No hay sensores configurados</p>
          <button className="btn btn-primary" onClick={handleCreateSensor}>
            Crear Primer Sensor
          </button>
        </div>
      ) : (
        <MineMap
          sensors={sensors}
          onSensorClick={handleSensorClick}
          isEditorMode={isEditorMode}
        />
      )}

      {selectedSensor && (
        <SensorModal
          sensor={selectedSensor}
          isOpen={!!selectedSensor}
          onClose={() => setSelectedSensor(null)}
          onEdit={handleEditSensor}
          onDelete={handleDeleteSensor}
        />
      )}

      {isFormOpen && company && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-lg">
            <h3 className="font-bold text-lg mb-4">
              {editingSensor ? 'Editar Sensor' : 'Agregar Sensor'}
            </h3>
            <SensorForm
              sensor={editingSensor}
              companyId={company.id}
              existingSensors={sensors}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingSensor(undefined);
              }}
            />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setIsFormOpen(false)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}
