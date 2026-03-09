'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { Order } from '@/types/order';
import { getPaymentProofUrl } from '@/utils/storage/payment';
import { createClient } from '@/utils/supabase/client';
import { Shield, Clock, CheckCircle, XCircle, Eye, Loader2, Search, ShoppingCart, MapPin, Phone, Building2, Check, X, Loader2 as Loading } from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pendiente', color: 'badge-warning', icon: Clock },
  pending_review: { label: 'En Revisión', color: 'badge-info', icon: Clock },
  approved: { label: 'Aprobado', color: 'badge-success', icon: CheckCircle },
  rejected: { label: 'Rechazado', color: 'badge-error', icon: XCircle },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [processing, setProcessing] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await adminService.getOrders();
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    if (!statusFilter) return true;
    return order.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={`badge ${config.color} gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const handleApprove = async () => {
    if (!selectedOrder) return;
    setProcessing(true);
    try {
      await adminService.approveOrder(selectedOrder.id);
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: 'approved' } : o));
      setSelectedOrder(prev => prev ? { ...prev, status: 'approved' } : null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedOrder) return;
    setProcessing(true);
    try {
      await adminService.rejectOrder(selectedOrder.id);
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: 'rejected' } : o));
      setSelectedOrder(prev => prev ? { ...prev, status: 'rejected' } : null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const getPaymentUrl = (filename: string | null) => {
    if (!filename) return null;
    const { data } = supabase.storage.from('payments').getPublicUrl(filename);
    return data.publicUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-6 lg:p-8">
      <main className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <a href="/admin" className="text-primary hover:underline text-sm">
              ← Volver al panel
            </a>
            <h1 className="text-3xl font-bold text-base-content">Gestión de Pedidos</h1>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setStatusFilter('')}
              className={`btn btn-sm ${!statusFilter ? 'btn-primary' : 'btn-ghost'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setStatusFilter('pending')}
              className={`btn btn-sm ${statusFilter === 'pending' ? 'btn-warning' : 'btn-ghost'}`}
            >
              Pendientes
            </button>
            <button 
              onClick={() => setStatusFilter('approved')}
              className={`btn btn-sm ${statusFilter === 'approved' ? 'btn-success' : 'btn-ghost'}`}
            >
              Aprobados
            </button>
            <button 
              onClick={() => setStatusFilter('rejected')}
              className={`btn btn-sm ${statusFilter === 'rejected' ? 'btn-error' : 'btn-ghost'}`}
            >
              Rechazados
            </button>
          </div>
        </header>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <div className="card bg-base-200 border border-base-300">
          <div className="card-body p-0">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingCart className="w-12 h-12 mx-auto text-base-content/30 mb-4" />
                <p className="text-base-content/60">No hay pedidos para mostrar</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-base-content/70">ID</th>
                      <th className="text-base-content/70">Empresa</th>
                      <th className="text-base-content/70">Teléfono</th>
                      <th className="text-base-content/70">Estado</th>
                      <th className="text-base-content/70">Fecha</th>
                      <th className="text-base-content/70">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover">
                        <td className="font-mono text-base-content">#{order.id}</td>
                        <td className="text-base-content">{order.company_name}</td>
                        <td className="text-base-content">{order.company_phone}</td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td className="text-base-content/70 text-sm">
                          {new Date(order.created_at).toLocaleDateString('es-PE')}
                        </td>
                        <td>
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="btn btn-ghost btn-sm"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedOrder && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl bg-base-200">
            <button 
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setSelectedOrder(null)}
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-bold text-xl mb-6">
              Detalles del Pedido #{selectedOrder.id}
            </h3>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-base-300 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span className="text-sm text-base-content/70">Empresa</span>
                  </div>
                  <p className="font-semibold text-base-content">{selectedOrder.company_name}</p>
                </div>

                <div className="bg-base-300 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm text-base-content/70">Dirección</span>
                  </div>
                  <p className="font-semibold text-base-content">{selectedOrder.company_address}</p>
                </div>

                <div className="bg-base-300 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="text-sm text-base-content/70">Teléfono</span>
                  </div>
                  <p className="font-semibold text-base-content">{selectedOrder.company_phone}</p>
                </div>

                <div className="bg-base-300 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm text-base-content/70">Fecha</span>
                  </div>
                  <p className="font-semibold text-base-content">
                    {new Date(selectedOrder.created_at).toLocaleDateString('es-BO')}
                  </p>
                </div>
              </div>

              {selectedOrder.payment_proof_filename && (
                <div className="bg-base-300 p-4 rounded-lg">
                  <p className="text-sm text-base-content/70 mb-2">Comprobante de Pago:</p>
                  <img 
                    src={getPaymentUrl(selectedOrder.payment_proof_filename) || ''} 
                    alt="Comprobante" 
                    className="max-h-64 rounded-lg mx-auto"
                  />
                </div>
              )}

              {selectedOrder.status === 'pending_review' && (
                <div className="flex gap-4 justify-end mt-6">
                  <button 
                    onClick={handleReject}
                    disabled={processing}
                    className="btn btn-error"
                  >
                    {processing ? <Loading className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                    Rechazar
                  </button>
                  <button 
                    onClick={handleApprove}
                    disabled={processing}
                    className="btn btn-success"
                  >
                    {processing ? <Loading className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Aprobar
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}></div>
        </div>
      )}
    </div>
  );
}
