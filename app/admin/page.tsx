'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/adminService';
import { Shield, Users, ShoppingCart, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';

interface Stats {
  total_users: number;
  total_orders: number;
  pending_orders: number;
  approved_orders: number;
  rejected_orders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 p-6 lg:p-8">
        <main className="max-w-7xl mx-auto space-y-8">
          <header>
            <div className="skeleton h-8 w-48 mb-2"></div>
            <div className="skeleton h-4 w-64"></div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="card bg-base-200 border border-base-300">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="skeleton h-3 w-20 mb-1"></div>
                      <div className="skeleton h-8 w-12"></div>
                    </div>
                    <div className="skeleton w-12 h-12 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="card bg-base-200 border border-base-300">
                <div className="card-body">
                  <div className="skeleton h-5 w-40 mb-2"></div>
                  <div className="skeleton h-4 w-full"></div>
                  <div className="skeleton h-4 w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-error mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-6 lg:p-8">
      <main className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-base-content">Panel de Administración</h1>
          <p className="text-base-content/60 mt-1">Resumen de la plataforma</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Total Usuarios</p>
                  <p className="text-3xl font-bold text-base-content">{stats?.total_users || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 border border-base-300">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Total Pedidos</p>
                  <p className="text-3xl font-bold text-base-content">{stats?.total_orders || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-info" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 border border-base-300">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Pendientes</p>
                  <p className="text-3xl font-bold text-warning">{stats?.pending_orders || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 border border-base-300">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Aprobados</p>
                  <p className="text-3xl font-bold text-success">{stats?.approved_orders || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-base-content flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Gestión de Pedidos
              </h2>
              <p className="text-base-content/60 text-sm">
                Revisa, approve o rechaza los pedidos de servicios de los usuarios.
              </p>
              <div className="card-actions justify-end mt-4">
                <Link href="/admin/orders" className="btn btn-primary btn-sm gap-2">
                  Ver Pedidos
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-base-content flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gestión de Usuarios
              </h2>
              <p className="text-base-content/60 text-sm">
                Administra los usuarios de la plataforma, activa o desactiva cuentas.
              </p>
              <div className="card-actions justify-end mt-4">
                <Link href="/admin/users" className="btn btn-primary btn-sm gap-2">
                  Ver Usuarios
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {stats && stats.rejected_orders > 0 && (
          <div className="alert alert-warning">
            <XCircle className="w-5 h-5" />
            <span>Hay {stats.rejected_orders} pedidos rechazados. Considera revisarlos.</span>
            <Link href="/admin/orders" className="btn btn-warning btn-sm">
              Ver
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
