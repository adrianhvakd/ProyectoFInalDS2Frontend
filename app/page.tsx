'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
import { ScrollAnimation } from '@/components/ui/ScrollAnimation';
import { Shield, Activity, AlertTriangle, Map, Users, ArrowRight, Bell, FileText } from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'Monitoreo en Tiempo Real',
    description: 'Visualiza el estado de todos tus sensores en un dashboard interactivo con actualizaciones en vivo.',
    color: 'text-info',
    bg: 'bg-info/10',
  },
  {
    icon: AlertTriangle,
    title: 'Alertas Inteligentes',
    description: 'Sistema de IA que predice fallas inminentes y genera alertas automáticas.',
    color: 'text-error',
    bg: 'bg-error/10',
  },
  {
    icon: Map,
    title: 'Mapa Interactivo',
    description: 'Visualiza la ubicación de cada sensor en un mapa de tu mina con indicadores de estado.',
    color: 'text-info',
    bg: 'bg-info/10',
  },
  {
    icon: Users,
    title: 'Gestión de Operadores',
    description: 'Múltiples operadores con roles diferenciados y permisos específicos.',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    icon: Bell,
    title: 'Notificaciones en Tiempo Real',
    description: 'Recibe alertas instantáneas por email y dentro de la plataforma.',
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    icon: FileText,
    title: 'Reportes y Estadísticas',
    description: 'Estadísticas detalladas y reportes históricos para mejor toma de decisiones.',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
];

interface UserData {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: string;
}

export default function LandingPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  return (
    <div className="min-h-screen bg-base-100">
      <PublicNavbar user={loading ? null : user} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden min-h-screen flex items-center">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        {/* Static Background Orbs */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-error/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-info/5 rounded-full blur-[80px]" />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Sistema de Monitoreo con IA
            </div>
            
            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-base-content leading-[1.1] tracking-tight">
              <span className="block">
                Protege tu mina con
              </span>
              <span className="block text-primary">
                inteligencia artificial
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-xl md:text-xl text-base-content/60 max-w-3xl mx-auto leading-relaxed">
              Detecta riesgos antes de que ocurran. Monitoreo en tiempo real de gases, 
              temperatura y vibraciones con alertas automáticas predictivas.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a 
                href="/services" 
                className="btn btn-primary btn-lg gap-2 cursor-pointer"
              >
                Ver Servicios
                <ArrowRight className="w-5 h-5" />
              </a>
              {user ? (
                <a 
                  href={`/${user.role}`} 
                  className="btn btn-outline btn-lg gap-2 cursor-pointer"
                >
                  Ir al Panel
                </a>
              ) : (
                <a 
                  href="/auth/login" 
                  className="btn btn-outline btn-lg gap-2 cursor-pointer"
                >
                  Iniciar Sesión
                </a>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mt-20 max-w-2xl mx-auto">
            <div className="p-4 md:p-6 rounded-2xl bg-base-200/50 border border-base-300/50 backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-bold text-primary font-mono">24/7</div>
              <div className="text-xs md:text-sm text-base-content/50 mt-1 uppercase tracking-wider">Monitoreo</div>
            </div>
            <div className="p-4 md:p-6 rounded-2xl bg-base-200/50 border border-base-300/50 backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-bold text-primary font-mono">99.9%</div>
              <div className="text-xs md:text-sm text-base-content/50 mt-1 uppercase tracking-wider">Disponibilidad</div>
            </div>
            <div className="p-4 md:p-6 rounded-2xl bg-base-200/50 border border-base-300/50 backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-bold text-primary font-mono">AI</div>
              <div className="text-xs md:text-sm text-base-content/50 mt-1 uppercase tracking-wider">Predicción</div>
            </div>
          </div>
        </div>
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-base-100 to-transparent" />
      </section>

      {/* Features Section */}
      <ScrollAnimation>
        <section className="py-24 px-4 bg-base-200/50 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-info/5 rounded-full blur-3xl" />
          
          <div className="container mx-auto max-w-6xl relative">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
                Todo lo que necesitas
              </h2>
              <p className="text-base-content/60 max-w-xl mx-auto">
                Un sistema completo diseñado específicamente para la industria minera
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index}
                    className="group p-6 rounded-2xl bg-base-200/70 border border-base-300/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 cursor-pointer backdrop-blur-sm"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`w-14 h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                      <Icon className={`w-7 h-7 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-base-content mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-base-content/60 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* CTA Section */}
      <ScrollAnimation>
        <section className="py-24 px-4 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-base-100 to-transparent" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
          
          <div className="container mx-auto max-w-4xl relative">
            <div className="relative p-8 md:p-12 rounded-3xl bg-base-200/50 border border-base-300/50 backdrop-blur-sm overflow-hidden">
              {/* Animated border gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-3xl animate-pulse opacity-30" />
              
              <div className="relative text-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-base-content">
                  ¿Listo para transformar tu mina?
                </h2>
                <p className="text-lg text-base-content/70 max-w-xl mx-auto">
                  Únete a las minas que ya están usando MineMonitor para proteger a sus equipos.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                  <a 
                    href="/services" 
                    className="btn btn-primary btn-lg gap-2 cursor-pointer"
                  >
                    Comenzar Ahora
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      <PublicFooter />
    </div>
  );
}
