'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
import { ScrollAnimation } from '@/components/ui/ScrollAnimation';
import { 
  BookOpen, 
  Cpu, 
  Shield, 
  Activity, 
  AlertTriangle, 
  MapPin, 
  Users, 
  Bell, 
  FileText,
  ChevronRight,
  Server,
  Key,
  Wifi,
  Database,
  Brain,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  Code,
  Terminal,
  FlaskConical
} from 'lucide-react';
import Link from 'next/link';

interface UserData {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: string;
}

export default function DocsPage() {
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

      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <ScrollAnimation>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <BookOpen className="w-4 h-4" />
                Documentacion Oficial
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
                Guia Completa de MineMonitor
              </h1>
              <p className="text-lg text-base-content/70 max-w-3xl mx-auto">
                Aprende a integrar sensores, utilizar la API y aprovechar todas las funcionalidades 
                del sistema de monitoreo con inteligencia artificial.
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Cpu, title: 'Arquitectura', desc: 'Estructura del sistema', href: '#arquitectura' },
              { icon: Key, title: 'API Keys', desc: 'Conectar sensores', href: '#api-keys' },
              { icon: Brain, title: 'Inteligencia Artificial', desc: 'Como funciona la IA', href: '#ia' },
              { icon: Terminal, title: 'Endpoints', desc: 'Referencia de API', href: '#endpoints' },
            ].map((item, idx) => (
              <ScrollAnimation key={idx} delay={idx * 100} animation="fade-up">
                <a href={item.href} className="block p-6 rounded-2xl bg-base-200/70 border border-base-300 hover:border-primary/50 transition-all hover:-translate-y-1 cursor-pointer">
                  <item.icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-base-content mb-1">{item.title}</h3>
                  <p className="text-sm text-base-content/60">{item.desc}</p>
                </a>
              </ScrollAnimation>
            ))}
          </div>

          <div className="space-y-16">
            <section id="arquitectura">
              <ScrollAnimation>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Server className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-base-content">Arquitectura del Sistema</h2>
                    <p className="text-base-content/60">Entiende como funciona MineMonitor</p>
                  </div>
                </div>
              </ScrollAnimation>

              <div className="card bg-base-200/70 border border-base-300">
                <div className="card-body">
                  <p className="text-base-content/80 leading-relaxed mb-6">
                    MineMonitor es una plataforma de monitoreo en tiempo real para la industria minera, 
                    diseñada para detectar riesgos antes de que ocurran mediante el uso de inteligencia artificial.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-base-content flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-success" />
                        Componentes Principales
                      </h3>
                      <ul className="space-y-2 text-base-content/70">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <span><strong>Backend (FastAPI):</strong> API REST que procesa lecturas, analiza datos con IA y gestiona alertas</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <span><strong>Frontend (Next.js):</strong> Interfaz web para visualizar datos, mapas y gestionar alertas</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <span><strong>Base de Datos (PostgreSQL):</strong> Almacena sensores, lecturas, alertas y datos de usuarios</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <span><strong>Sensores Hardware:</strong> Dispositivos Arduino/ESP32 que envian datos via HTTP</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-base-content flex items-center gap-2">
                        <Activity className="w-5 h-5 text-info" />
                        Flujo de Datos
                      </h3>
                      <div className="p-4 bg-base-100 rounded-xl border border-base-300">
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-center">
                            <div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center mx-auto mb-1">
                              <Cpu className="w-5 h-5 text-error" />
                            </div>
                            <span className="text-xs text-base-content/60">Sensor</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-base-content/40" />
                          <div className="text-center">
                            <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-1">
                              <Server className="w-5 h-5 text-warning" />
                            </div>
                            <span className="text-xs text-base-content/60">API</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-base-content/40" />
                          <div className="text-center">
                            <div className="w-10 h-10 rounded-full bg-info/20 flex items-center justify-center mx-auto mb-1">
                              <Brain className="w-5 h-5 text-info" />
                            </div>
                            <span className="text-xs text-base-content/60">IA</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-base-content/40" />
                          <div className="text-center">
                            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-1">
                              <Database className="w-5 h-5 text-success" />
                            </div>
                            <span className="text-xs text-base-content/60">DB</span>
                          </div>
                        </div>
                      </div>
                      <ul className="space-y-2 text-base-content/70 text-sm">
                        <li>1. Sensor envia lectura con API Key</li>
                        <li>2. API valida y proces</li>
                        <li>3. Motor de IA analizaa la lectura patrones</li>
                        <li>4. Se genera alerta si es necesario</li>
                        <li>5. Frontend actualiza en tiempo real</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="api-keys">
              <ScrollAnimation>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Key className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-base-content">Conectar Sensores (API Keys)</h2>
                    <p className="text-base-content/60">Como integrar dispositivos de hardware</p>
                  </div>
                </div>
              </ScrollAnimation>

              <div className="card bg-base-200/70 border border-base-300 mb-6">
                <div className="card-body">
                  <h3 className="font-semibold text-base-content mb-4 flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-info" />
                    Obtener tu API Key
                  </h3>
                  <ol className="space-y-3 text-base-content/70">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center flex-shrink-0 font-bold">1</span>
                      <span>Registrate en <Link href="/auth/register" className="text-primary hover:underline">MineMonitor</Link> y crea una empresa</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center flex-shrink-0 font-bold">2</span>
                      <span>Accede al panel de operador y navega a la seccion de sensores</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center flex-shrink-0 font-bold">3</span>
                      <span>Crea un nuevo sensor. Se generara automaticamente una <code className="bg-base-100 px-2 py-0.5 rounded text-sm">api_key</code> unica</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center flex-shrink-0 font-bold">4</span>
                      <span>Copia la API Key y usala en tu Arduino/ESP32</span>
                    </li>
                  </ol>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="card bg-base-200/70 border border-base-300">
                  <div className="card-body">
                    <h3 className="font-semibold text-base-content mb-4 flex items-center gap-2">
                      <Code className="w-5 h-5 text-warning" />
                      Enviar Lectura (Arduino/ESP32)
                    </h3>
                    <div className="bg-base-100 p-4 rounded-lg overflow-x-auto">
                      <pre className="text-sm text-base-content/80 font-mono">
{`// Ejemplo para ESP32/Arduino con WiFi
#include <HTTPClient.h>

const char* SERVER_URL = "https://api.minemonitor.cl/readings";
const char* API_KEY = "tu_api_key_aqui";

void sendReading(float value) {
  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-Arduino-Key", API_KEY);
  
  String payload = "{\\"value\\":" + String(value) + "}";
  int httpCode = http.POST(payload);
  
  http.end();
}`}</pre>
                    </div>
                  </div>
                </div>

                <div className="card bg-base-200/70 border border-base-300">
                  <div className="card-body">
                    <h3 className="font-semibold text-base-content mb-4 flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-success" />
                      Enviar Lectura (cURL)
                    </h3>
                    <div className="bg-base-100 p-4 rounded-lg overflow-x-auto">
                      <pre className="text-sm text-base-content/80 font-mono">
{`# Linux/Mac
curl -X POST "https://api.minemonitor.cl/readings" \\
  -H "Content-Type: application/json" \\
  -H "X-Arduino-Key: tu_api_key_aqui" \\
  -d '{"value": 25.6}'`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-base-200/70 border border-base-300 mt-6">
                <div className="card-body">
                  <h3 className="font-semibold text-base-content mb-4 flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-info" />
                    Simular Sensores
                  </h3>
                  <p className="text-base-content/70 mb-4">
                    El proyecto incluye un script para simular sensores sin hardware real:
                  </p>
                  <div className="bg-base-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm text-base-content/80 font-mono">
{`# En el directorio backend/
python simulate_arduino.py --api-key TU_API_KEY \\
  --type gas --min 0 --max 100 \\
  --trend increasing --interval 5`}</pre>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-base-content/60">
                    <li><code>--trend</code>: Tipos de tendencia (stable, increasing, decreasing, noisy)</li>
                    <li><code>--interval</code>: Intervalo entre lecturas en segundos</li>
                    <li><code>--type</code>: Tipo de sensor (gas, temperature)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="ia">
              <ScrollAnimation>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-base-content">Inteligencia Artificial</h2>
                    <p className="text-base-content/60">Como el sistema predice fallos</p>
                  </div>
                </div>
              </ScrollAnimation>

              <div className="card bg-base-200/70 border border-base-300 mb-6">
                <div className="card-body">
                  <h3 className="font-semibold text-base-content mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-info" />
                    Algoritmos de Prediccion
                  </h3>
                  <p className="text-base-content/70 mb-4">
                    El sistema utiliza dos algoritmos de machine learning para analisis predictivo:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 bg-base-100 rounded-xl border border-base-300">
                      <h4 className="font-medium text-base-content mb-2">Linear Regression</h4>
                      <p className="text-sm text-base-content/60">
                        Calcula la pendiente de los datos para identificar tendencias generales. 
                        Rapido y eficiente para datos con patrones lineales.
                      </p>
                    </div>
                    <div className="p-4 bg-base-100 rounded-xl border border-base-300">
                      <h4 className="font-medium text-base-content mb-2">Theil-Sen Regressor</h4>
                      <p className="text-sm text-base-content/60">
                        Metodo statistico robusto que calcula la pendiente mediana. 
                        Resistente a valores atipicos y outliers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-base-200/70 border border-base-300 mb-6">
                <div className="card-body">
                  <h3 className="font-semibold text-base-content mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-warning" />
                    Metricas Calculadas
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      <thead>
                        <tr>
                          <th>Metrica</th>
                          <th>Descripcion</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><code>Slope</code></td>
                          <td>Pendiente de la tendencia (positiva = aumentando, negativa = disminuyendo)</td>
                        </tr>
                        <tr>
                          <td><code>Volatility (CV)</code></td>
                          <td>Coeficiente de variacion - mide la variabilidad de los datos</td>
                        </tr>
                        <tr>
                          <td><code>Drift Index</code></td>
                          <td>Indice de deriva - diferencia entre la primera y segunda mitad de los datos</td>
                        </tr>
                        <tr>
                          <td><code>Noise Level</code></td>
                          <td>Nivel de ruido en las mediciones</td>
                        </tr>
                        <tr>
                          <td><code>Max Z-Score</code></td>
                          <td>Maxima puntuacion Z - identifica valores atipicos extremos</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="card bg-base-200/70 border border-base-300">
                <div className="card-body">
                  <h3 className="font-semibold text-base-content mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-error" />
                    Estados del Sensor
                  </h3>
                  <div className="space-y-3">
                    {[
                      { state: 'Estable', color: 'text-success', desc: 'Operacion normal - sin problemas detectados' },
                      { state: 'Advertencia', color: 'text-warning', desc: 'Prediccion de superacion de umbral en los proximos 60 minutos' },
                      { state: 'Alerta', color: 'text-warning', desc: 'Deriva o ruido excesivo detectado en los datos' },
                      { state: 'Critico', color: 'text-error', desc: 'Umbral superado o sensor fallando' },
                      { state: 'Iniciando', color: 'text-info', desc: 'Datos insuficientes para analisis (menos de 20 lecturas)' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-base-100 rounded-lg">
                        <div className={`font-semibold ${item.color}`}>{item.state}</div>
                        <div className="text-base-content/70 text-sm">{item.desc}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-xl">
                    <h4 className="font-semibold text-error mb-2">Deteccion de Problemas</h4>
                    <ul className="text-sm text-base-content/70 space-y-1">
                      <li>- <strong>Sensor Atascado:</strong> Valores demasiado similares (unique_ratio {'<'} 0.1)</li>
                      <li>- <strong>Sensor Desconectado:</strong> Valores cerca de cero ({'<'} 5% del umbral minimo)</li>
                      <li>- <strong>Ruido Excesivo:</strong> Coeficiente de variacion {'>'} 30%</li>
                      <li>- <strong>Deriva Positiva:</strong> Drift {'>'} 15% (valores aumentando)</li>
                      <li>- <strong>Deriva Negativa:</strong> Drift {'<'} -15% (valores disminuyendo)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section id="endpoints">
              <ScrollAnimation>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Server className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-base-content">Referencia de API</h2>
                    <p className="text-base-content/60">Todos los endpoints disponibles</p>
                  </div>
                </div>
              </ScrollAnimation>

              <div className="card bg-base-200/70 border border-base-300 mb-6">
                <div className="card-body">
                  <h3 className="font-semibold text-base-content mb-4">Base URL</h3>
                  <div className="bg-base-100 p-3 rounded-lg">
                    <code className="text-primary">https://api.minemonitor.cl</code>
                  </div>

                  <h3 className="font-semibold text-base-content mb-4 mt-6">Autenticacion</h3>
                  <div className="space-y-3 text-base-content/70">
                    <p>El sistema usa dos tipos de autenticacion:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-1" />
                        <span><strong>Hardware (Arduino/ESP32):</strong> Header <code className="bg-base-100 px-1 rounded">X-Arduino-Key</code> con la API Key del sensor</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-1" />
                        <span><strong>Frontend:</strong> Token JWT de Supabase en el header <code className="bg-base-100 px-1 rounded">Authorization: Bearer</code></span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    method: 'POST',
                    path: '/readings',
                    desc: 'Enviar una lectura desde un sensor',
                    auth: 'API Key (X-Arduino-Key)',
                    body: '{"value": 25.6}',
                    response: '{"message": "Reading created", "id": 123}'
                  },
                  {
                    method: 'GET',
                    path: '/sensors',
                    desc: 'Listar todos los sensores de tu empresa',
                    auth: 'JWT Token',
                    response: '[{"id": 1, "name": "Sensor Gas 1", "type": "gas", ...}]'
                  },
                  {
                    method: 'GET',
                    path: '/alerts/unresolved',
                    desc: 'Obtener alertas sin resolver',
                    auth: 'JWT Token',
                    response: '[{"id": 1, "description": "Umbral superado", ...}]'
                  },
                  {
                    method: 'GET',
                    path: '/subscriptions/me',
                    desc: 'Obtener suscripcion actual',
                    auth: 'JWT Token',
                    response: '{"company": {...}, "service": {...}}'
                  },
                ].map((endpoint, idx) => (
                  <div key={idx} className="card bg-base-200/70 border border-base-300">
                    <div className="card-body p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          endpoint.method === 'GET' ? 'bg-success/20 text-success' :
                          endpoint.method === 'POST' ? 'bg-warning/20 text-warning' :
                          endpoint.method === 'PATCH' ? 'bg-info/20 text-info' :
                          'bg-error/20 text-error'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="text-base-content">{endpoint.path}</code>
                      </div>
                      <p className="text-sm text-base-content/70 mb-2">{endpoint.desc}</p>
                      <div className="text-xs text-base-content/50">
                        <span className="font-semibold">Auth:</span> {endpoint.auth}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-base-200/50 rounded-2xl border border-dashed border-base-300">
                <h3 className="font-semibold text-base-content mb-2">Necesitas mas endpoints?</h3>
                <p className="text-base-content/60 mb-4">
                  Explora el codigo fuente del backend para ver todos los endpoints disponibles.
                </p>
                <div className="flex gap-2">
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm gap-2"
                  >
                    Ver en GitHub
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </section>

            <section>
              <ScrollAnimation>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-base-content">Otros Recursos</h2>
                    <p className="text-base-content/60">Enlaces utiles</p>
                  </div>
                </div>
              </ScrollAnimation>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: 'Servicios', desc: 'Ver planes y precios', href: '/services', icon: Shield },
                  { title: 'GitHub', desc: 'Codigo fuente', href: 'https://github.com', icon: Code, external: true },
                  { title: 'Contacto', desc: 'Obtener soporte', href: '#', icon: Users },
                ].map((item, idx) => (
                  <a 
                    key={idx}
                    href={item.href}
                    target={item.external ? '_blank' : '_self'}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="card bg-base-200/70 border border-base-300 hover:border-primary/50 transition-all cursor-pointer"
                  >
                    <div className="card-body p-4 flex flex-row items-center gap-3">
                      <item.icon className="w-6 h-6 text-primary" />
                      <div>
                        <h3 className="font-semibold text-base-content">{item.title}</h3>
                        <p className="text-xs text-base-content/60">{item.desc}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
