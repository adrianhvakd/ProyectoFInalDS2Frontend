'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import { Service, parseFeatures } from '@/types/service';
import { ScrollAnimation } from '@/components/ui/ScrollAnimation';
import { Shield, Check, ArrowRight, Loader2, Lock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface UserData {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`);
        if (!response.ok) throw new Error('Error al cargar servicios');
        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError('Error al cargar los servicios');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    async function checkUser() {
      try {
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        if (supabaseUser) {
          const { data: profile } = await supabase
            .from('user')
            .select('id, email, username, full_name, role')
            .eq('id', supabaseUser.id)
            .single();
          
          if (profile) {
            setUser({
              ...profile,
              email: supabaseUser.email || profile.email || '',
            });
          }
        }
      } catch (error) {
        console.error('Error checking user:', error);
      }
    }

    loadServices();
    checkUser();
  }, []);

  const handleContract = (service: Service) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedService(service);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
                return (
                  <ScrollAnimation key={service.id} delay={index * 100} animation="zoom-in">
                    <div className="card bg-base-200/80 backdrop-blur-sm border border-base-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full flex flex-col group">
                      <div className="card-body flex flex-col flex-grow p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Shield className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-primary/80">
                            Plan {service.name.split(' ')[0]}
                          </span>
                        </div>
                        
                        <h2 className="card-title text-xl md:text-2xl text-base-content mb-2 group-hover:text-primary transition-colors">
                          {service.name}
                        </h2>
                        <p className="text-base-content/60 text-sm mb-4 flex-grow">
                          {service.description}
                        </p>
                        
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
                              onClick={() => handleContract(service)}
                              className="btn btn-primary btn-block gap-2 cursor-pointer hover:scale-[1.02] transition-transform"
                            >
                              Contratar
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
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
}
