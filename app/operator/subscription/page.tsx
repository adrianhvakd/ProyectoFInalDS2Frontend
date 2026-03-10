'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { subscriptionService } from '@/services/subscriptionService';
import { Service, parseFeatures } from '@/types/service';
import { SubscriptionInfo, SubscriptionPayment, SubscriptionAction } from '@/types/subscription';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import { 
  Calendar, Clock, AlertTriangle,  CreditCard, CheckCircle, 
  XCircle, Loader2, ArrowRight, FileText, Shield, Zap, 
  Brain, BarChart3, Bell, ChevronRight
} from 'lucide-react';

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [history, setHistory] = useState<SubscriptionPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<SubscriptionAction>('renew');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [subData, servicesData, historyData] = await Promise.all([
        subscriptionService.getMySubscription().catch(() => null),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`).then(r => r.json()),
        subscriptionService.getHistory().catch(() => []),
      ]);
      
      setSubscription(subData);
      setServices(servicesData || []);
      setHistory(historyData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenPayment = (action: SubscriptionAction = 'renew') => {
    const currentService = getCurrentService();
    if (currentService) {
      setSelectedAction(action);
      setSelectedService(currentService);
      setShowCheckoutModal(true);
    }
  };

  const handleOpenChangePlan = (action: 'upgrade' | 'downgrade') => {
    setSelectedAction(action);
  };

  const handleSelectService = (service: Service) => {
    const isUpgrade = service.plan_level > (currentService?.plan_level || 0);
    setSelectedAction(isUpgrade ? 'upgrade' : 'downgrade');
    setSelectedService(service);
    setShowCheckoutModal(true);
  };

  const getStatusBadge = () => {
    if (!subscription) return null;
    
    const { company } = subscription;
    
    if (!company.is_subscription_active) {
      return (
        <div className="flex items-center gap-2 px-4 py-2 bg-error/20 text-error rounded-lg">
          <XCircle className="w-5 h-5" />
          <span className="font-semibold">Suscripción Inactiva</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-success/20 text-success rounded-lg">
        <CheckCircle className="w-5 h-5" />
        <span className="font-semibold">Suscripción Activa</span>
      </div>
    );
  };

  const getCurrentService = () => {
    if (!subscription?.company?.service_id) return null;
    return services.find(s => s.id === subscription?.company?.service_id);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentService = getCurrentService();
  const features = currentService ? parseFeatures(currentService.features) : [];

  return (
    <div className="min-h-screen bg-base-100 font-sans text-base-content p-6 lg:p-8">
      <main className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-base-content">Mi Suscripción</h1>
          <p className="text-base-content/60 mt-1">Gestiona tu plan y pagos</p>
        </header>

        {error && (
          <div className="alert alert-error">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Estado de suscripción */}
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  {currentService?.name || 'Sin plan'}
                </h2>
                <p className="text-base-content/60">
                  {currentService?.description || 'No tienes un plan contratado'}
                </p>
              </div>
              {getStatusBadge()}
            </div>

            {subscription && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-3 p-4 bg-base-100 rounded-lg">
                  <Calendar className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-base-content/60">Inicio</p>
                    <p className="font-semibold">{formatDate(subscription.company.subscription_start)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-base-100 rounded-lg">
                  <Clock className="w-8 h-8 text-warning" />
                  <div>
                    <p className="text-sm text-base-content/60">Días restantes</p>
                    <p className="font-semibold">{subscription.company.days_remaining} días</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-base-100 rounded-lg">
                  <CreditCard className="w-8 h-8 text-success" />
                  <div>
                    <p className="text-sm text-base-content/60">Próximo vencimiento</p>
                    <p className="font-semibold">{formatDate(subscription.company.subscription_end)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Características del plan */}
            {currentService && (
              <div className="mt-6 p-4 bg-base-100 rounded-lg">
                <h3 className="font-semibold mb-3">Tu plan incluye:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {features.slice(0).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span>{feature.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button 
                onClick={handleOpenPayment}
                className="btn btn-primary gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Pagar Mensualidad
              </button>
              
              {services.length > 0 && (
                <div className="dropdown dropdown-end">
                  <button tabIndex={0} className="btn btn-outline gap-2">
                    Cambiar Plan
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-200 rounded-box w-64 mt-2">
                    {services.filter(s => s.id !== subscription?.company?.service_id).map(service => {
                      const isUpgrade = service.plan_level > (currentService?.plan_level || 0);
                      return (
                        <li key={service.id}>
                          <button 
                            onClick={() => handleSelectService(service)}
                            className="justify-between"
                          >
                            <span>{service.name}</span>
                            <span className="badge badge-sm">{isUpgrade ? 'Upgrade' : 'Downgrade'}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Planes disponibles */}
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-lg">Planes Disponibles</h3>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              {services.map(service => {
                const isCurrent = service.id === subscription?.company?.service_id;
                const isUpgrade = service.plan_level > (currentService?.plan_level || 0);
                
                return (
                  <div 
                    key={service.id}
                    className={`p-4 rounded-lg border ${
                      isCurrent 
                        ? 'border-primary bg-primary/10' 
                        : 'border-base-300 bg-base-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold">{service.name}</h4>
                      {isCurrent && <span className="badge badge-primary">Actual</span>}
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      ${service.price}
                      <span className="text-sm font-normal text-base-content/60">/mes</span>
                    </p>
                    <ul className="mt-3 space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-warning" />
                        {service.max_operators} operador(es)
                      </li>
                      {service.has_ai && (
                        <li className="flex items-center gap-2">
                          <Brain className="w-4 h-4 text-info" />
                          IA Predictiva
                        </li>
                      )}
                      {service.has_advanced_reports && (
                        <li className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-success" />
                          Reportes Avanzados
                        </li>
                      )}
                      {service.has_priority_notifications && (
                        <li className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-error" />
                          Notif. Prioritarias
                        </li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Historial de pagos */}
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Historial de Pagos
            </h3>
            
            {history.length === 0 ? (
              <p className="text-base-content/60 py-4">No hay pagos registrados</p>
            ) : (
              <div className="overflow-x-auto mt-4">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th>Período</th>
                      <th>Monto</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(payment => (
                      <tr key={payment.id}>
                        <td>{formatDate(payment.created_at)}</td>
                        <td>
                          <span className={`badge ${
                            payment.payment_type === 'initial' ? 'badge-primary' :
                            payment.payment_type === 'upgrade' ? 'badge-info' :
                            payment.payment_type === 'downgrade' ? 'badge-warning' :
                            'badge-ghost'
                          }`}>
                            {payment.payment_type}
                          </span>
                        </td>
                        <td className="text-sm">
                          {formatDate(payment.period_start)} - {formatDate(payment.period_end)}
                        </td>
                        <td className="font-semibold">${payment.amount}</td>
                        <td>
                          <span className={`badge ${
                            payment.status === 'approved' ? 'badge-success' :
                            payment.status === 'pending_review' ? 'badge-warning' :
                            payment.status === 'rejected' ? 'badge-error' :
                            'badge-ghost'
                          }`}>
                            {payment.status === 'pending_review' ? 'Pendiente' : 
                             payment.status === 'approved' ? 'Aprobado' :
                             payment.status === 'rejected' ? 'Rechazado' : payment.status}
                          </span>
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

      {selectedService && showCheckoutModal && (
        <CheckoutModal
          service={selectedService}
          action={selectedAction}
          isOpen={showCheckoutModal}
          onClose={() => {
            setShowCheckoutModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}
