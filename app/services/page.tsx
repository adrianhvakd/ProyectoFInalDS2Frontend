'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import { Service, parseFeatures } from '@/types/service';
import { SubscriptionInfo, SubscriptionAction } from '@/types/subscription';
import { ScrollAnimation } from '@/components/ui/ScrollAnimation';
import { Shield, Check, ArrowRight, Lock, AlertCircle, CreditCard, Zap, Brain, BarChart3, Bell } from 'lucide-react';
import Link from 'next/link';

interface UserData {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: string;
  company_id?: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedAction, setSelectedAction] = useState<SubscriptionAction>('contract');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        const servicesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`);
        if (!servicesRes.ok) throw new Error('Error al cargar servicios');
        const servicesData = await servicesRes.json();
        setServices(servicesData);

        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        
        if (supabaseUser) {
          const { data: profile } = await supabase
            .from('user')
            .select('id, email, username, full_name, role, company_id')
            .eq('id', supabaseUser.id)
            .single();
          
          if (profile) {
            setUser({
              ...profile,
              email: supabaseUser.email || profile.email || '',
            });

            if (profile.company_id) {
              try {
                const { data: { session } } = await supabase.auth.getSession();
                const subRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/me`, {
                  credentials: 'include',
                  headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                    'Content-Type': 'application/json',
                  },
                });
                if (subRes.ok) {
                  const subData = await subRes.json();
                  setSubscription(subData);
                }
              } catch (e) {
                console.error('Error loading subscription:', e);
              }
            }
          }
        }
      } catch (err) {
        console.error(err);
        setError('Error al cargar los servicios');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const getButtonConfig = (service: Service): { label: string; action: SubscriptionAction; className: string } => {
    if (!user?.company_id || !subscription?.company) {
      return { label: 'Contratar', action: 'contract', className: 'btn-primary' };
    }

    const currentServiceId = subscription.company.service_id;
    const isCurrent = service.id == currentServiceId;

    if (isCurrent) {
      return { 
        label: 'Pagar Mensualidad', 
        action: 'renew', 
        className: 'btn-primary' 
      };
    }

    const currentService = services.find(s => s.id === currentServiceId);
    const currentLevel = currentService?.plan_level || 0;
    const isUpgrade = service.plan_level > currentLevel;

    if (isUpgrade) {
      return { 
        label: 'Mejorar Plan', 
        action: 'upgrade', 
        className: 'btn-primary' 
      };
    }

    return { 
      label: 'Cambiar a Plan Inferior', 
      action: 'downgrade', 
      className: 'btn-outline' 
    };
  };

  const handleServiceClick = (service: Service) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const config = getButtonConfig(service);
    setSelectedAction(config.action);
    setSelectedService(service);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="skeleton h-10 w-64 mx-auto mb-4"></div>
            <div className="skeleton h-5 w-96 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card bg-base-200/80 border border-base-300">
                <div className="card-body">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="skeleton h-8 w-8 rounded-lg"></div>
                    <div className="skeleton h-4 w-24"></div>
                  </div>
                  
                  <div className="skeleton h-6 w-40 mb-2"></div>
                  <div className="skeleton h-4 w-full mb-1"></div>
                  <div className="skeleton h-4 w-3/4 mb-4"></div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="skeleton h-5 w-20 rounded"></div>
                    <div className="skeleton h-5 w-16 rounded"></div>
                    <div className="skeleton h-5 w-20 rounded"></div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-start gap-2">
                      <div className="skeleton h-4 w-4 mt-1 rounded-full"></div>
                      <div className="skeleton h-4 w-full"></div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="skeleton h-4 w-4 mt-1 rounded-full"></div>
                      <div className="skeleton h-4 w-4/5"></div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="skeleton h-4 w-4 mt-1 rounded-full"></div>
                      <div className="skeleton h-4 w-3/5"></div>
                    </div>
                  </div>

                  <div className="border-t border-base-300 pt-4 mt-auto">
                    <div className="flex items-baseline justify-center gap-1 mb-4">
                      <div className="skeleton h-8 w-16"></div>
                      <div className="skeleton h-4 w-10"></div>
                    </div>
                    <div className="skeleton h-10 w-full rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-error mb-4">{error}</p>
          <Link href="/" className="btn btn-primary">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const currentService = subscription?.company?.service_id 
    ? services.find(s => s.id === subscription?.company?.service_id) 
    : null;

  return (
    <div className="min-h-screen bg-base-100">
      <PublicNavbar user={user} />

      <section className="pt-25 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <ScrollAnimation>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
                Nuestros Servicios
              </h1>
              <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                Elige el plan perfecto para las necesidades de tu mina. 
                Contamos con tecnología de vanguardia para proteger a tu equipo.
              </p>
            </div>
          </ScrollAnimation>

          {subscription && subscription.company && (
            <div className="mb-8 p-4 bg-base-200 rounded-xl border border-base-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-base-content/60">Tu plan actual</p>
                  <h3 className="text-xl font-bold text-primary">{currentService?.name || 'Sin plan'}</h3>
                  <p className="text-sm text-base-content/70">
                    Vence: {formatDate(subscription.company.subscription_end)} 
                    ({subscription.company.days_remaining} días restantes)
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href="/operator/subscription" className="btn btn-outline btn-sm gap-2">
                    <CreditCard className="w-4 h-4" />
                    Gestionar
                  </Link>
                  <button 
                    onClick={() => {
                      if (currentService) {
                        setSelectedAction('renew');
                        setSelectedService(currentService);
                      }
                    }}
                    className="btn btn-primary btn-sm gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pagar Mensualidad
                  </button>
                </div>
              </div>
            </div>
          )}

          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-base-content/60 mb-4">No hay servicios disponibles actualmente.</p>
              <Link href="/" className="btn btn-primary">
                Volver al inicio
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => {
                const features = parseFeatures(service.features);
                const buttonConfig = getButtonConfig(service);
                const isCurrent = subscription?.company?.service_id === service.id;
                
                return (
                  <ScrollAnimation key={service.id} delay={index * 100} animation="zoom-in">
                    <div className={`card bg-base-200/80 backdrop-blur-sm border hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full flex flex-col group ${
                      isCurrent ? 'border-primary' : 'border-base-300 hover:border-primary/50'
                    }`}>
                      <div className="card-body flex flex-col grow p-6">
                        
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Shield className="w-5 h-5" />
                          </div>
                          <div className="flex justify-between items-center gap-16">
                            <span className="text-xs font-semibold uppercase tracking-wider text-primary/80">
                              {service.name.split(' ')[1]}
                            </span>
                            {isCurrent && (
                              <div className="badge badge-primary">Tu Plan Actual</div>  
                            )}
                          </div>
                        </div>
                        
                        <h2 className="card-title text-xl md:text-2xl text-base-content mb-2 group-hover:text-primary transition-colors">
                          {service.name}
                        </h2>
                        <p className="text-base-content/60 text-sm mb-4 flex-grow">
                          {service.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <div className="flex items-center gap-1 text-xs bg-base-100 px-2 py-1 rounded">
                            <Zap className="w-3 h-3 text-primary" />
                            Acceso a la plataforma
                          </div>
                          {service.has_ai && (
                            <div className="flex items-center gap-1 text-xs bg-base-100 px-2 py-1 rounded">
                              <Brain className="w-3 h-3 text-info" />
                              IA
                            </div>
                          )}
                          {service.has_advanced_reports && (
                            <div className="flex items-center gap-1 text-xs bg-base-100 px-2 py-1 rounded">
                              <BarChart3 className="w-3 h-3 text-success" />
                              Reportes
                            </div>
                          )}
                          {service.has_priority_notifications && (
                            <div className="flex items-center gap-1 text-xs bg-base-100 px-2 py-1 rounded">
                              <Bell className="w-3 h-3 text-error" />
                              Notif. Prior.
                            </div>
                          )}
                        </div>

                        <div className="space-y-2 mb-6">
                          {features.slice(0, 4).map((feature, idx) => (
                            <div 
                              key={idx} 
                              className="flex items-start gap-2 text-sm text-base-content/70"
                            >
                              <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                              <span>{feature.name}</span>
                            </div>
                          ))}
                          {features.length > 4 && (
                            <p className="text-xs text-primary/70 pl-6">
                              +{features.length - 4} características más
                            </p>
                          )}
                        </div>

                        <div className="border-t border-base-300 pt-4 mt-auto">
                          <div className="flex items-baseline justify-center gap-1 mb-4">
                            {service.price === 0 ? (
                              <span className="text-3xl font-bold text-primary">Gratis</span>
                            ) : (
                              <>
                                <span className="text-4xl font-bold text-primary">${service.price}</span>
                                <span className="text-base-content/50">/mes</span>
                              </>
                            )}
                          </div>
                          
                          {user ? (
                            <button 
                              onClick={() => handleServiceClick(service)}
                              className={`btn btn-block gap-2 cursor-pointer hover:scale-[1.02] transition-transform ${buttonConfig.className}`}
                            >
                              {buttonConfig.label}
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          ) : (
                            <button 
                              onClick={() => setShowAuthModal(true)}
                              className="btn btn-outline btn-primary btn-block gap-2 cursor-pointer hover:scale-[1.02] transition-transform"
                            >
                              <Lock className="w-4 h-4" />
                              Iniciar sesión
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </ScrollAnimation>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <PublicFooter />

      {showAuthModal && (
        <div className="modal modal-open">
          <div className="modal-box bg-base-200 max-w-sm text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-warning/20">
                <AlertCircle className="w-12 h-12 text-warning" />
              </div>
            </div>
            <h3 className="font-bold text-xl mb-2">Inicia sesión para continuar</h3>
            <p className="text-base-content/60 mb-6">
              Necesitas una cuenta para contratar nuestros servicios. ¿Ya tienes una cuenta o prefieres crear una nueva?
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/auth/login" className="btn btn-primary">
                Iniciar sesión
              </Link>
              <Link href="/auth/register" className="btn btn-outline btn-primary">
                Crear cuenta
              </Link>
            </div>
            <div className="modal-action justify-center">
              <button 
                onClick={() => setShowAuthModal(false)}
                className="btn btn-ghost btn-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedService && (
        <CheckoutModal 
          service={selectedService}
          action={selectedAction}
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
}
