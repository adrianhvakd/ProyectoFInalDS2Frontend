'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { User } from '@/types/user';
import { Shield, Users, UserCog, ToggleLeft, ToggleRight, Loader2, Search } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await adminService.getUsers();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    if (filter === 'active') return user.is_active;
    if (filter === 'inactive') return !user.is_active;
    return true;
  });

  const handleToggleActive = async (userId: string) => {
    setProcessingId(userId);
    setError(null);
    
    try {
      const updatedUser = await adminService.toggleUserActive(userId);
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      admin: 'badge-error',
      operator: 'badge-info',
      user: 'badge-ghost',
    };
    const roleLabels: Record<string, string> = {
      admin: 'Administrador',
      operator: 'Operador',
      user: 'Usuario',
    };
    return (
      <span className={`badge ${roleColors[role] || 'badge-ghost'}`}>
        {roleLabels[role] || role}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 p-6 lg:p-8">
        <main className="max-w-7xl mx-auto space-y-6">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="skeleton h-4 w-24 mb-2"></div>
              <div className="skeleton h-8 w-48"></div>
            </div>
            <div className="flex gap-2">
              <div className="skeleton h-8 w-20"></div>
              <div className="skeleton h-8 w-20"></div>
              <div className="skeleton h-8 w-20"></div>
            </div>
          </header>

          <div className="card bg-base-200 border border-base-300">
            <div className="card-body p-0">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-base-content/70">Usuario</th>
                      <th className="text-base-content/70">Email</th>
                      <th className="text-base-content/70">Nombre</th>
                      <th className="text-base-content/70">Rol</th>
                      <th className="text-base-content/70">Empresa ID</th>
                      <th className="text-base-content/70">Estado</th>
                      <th className="text-base-content/70">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map(i => (
                      <tr key={i} className="hover">
                        <td><div className="skeleton h-4 w-24"></div></td>
                        <td><div className="skeleton h-4 w-32"></div></td>
                        <td><div className="skeleton h-4 w-28"></div></td>
                        <td><div className="skeleton h-4 w-20"></div></td>
                        <td><div className="skeleton h-4 w-12"></div></td>
                        <td><div className="skeleton h-4 w-16"></div></td>
                        <td><div className="skeleton h-8 w-8"></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
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
            <h1 className="text-3xl font-bold text-base-content">Gestión de Usuarios</h1>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`btn btn-sm ${filter === 'active' ? 'btn-success' : 'btn-ghost'}`}
            >
              Activos
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`btn btn-sm ${filter === 'inactive' ? 'btn-error' : 'btn-ghost'}`}
            >
              Inactivos
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
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="w-12 h-12 mx-auto text-base-content/30 mb-4" />
                <p className="text-base-content/60">No hay usuarios para mostrar</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-base-content/70">Usuario</th>
                      <th className="text-base-content/70">Email</th>
                      <th className="text-base-content/70">Nombre</th>
                      <th className="text-base-content/70">Rol</th>
                      <th className="text-base-content/70">Empresa ID</th>
                      <th className="text-base-content/70">Estado</th>
                      <th className="text-base-content/70">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover">
                        <td className="font-medium text-base-content">{user.username}</td>
                        <td className="text-base-content/70 text-sm">{user.email}</td>
                        <td className="text-base-content">{user.full_name || '-'}</td>
                        <td>{getRoleBadge(user.role)}</td>
                        <td className="text-base-content/70 font-mono">
                          {user.company_id || '-'}
                        </td>
                        <td>
                          <span className={`badge ${user.is_active ? 'badge-success' : 'badge-error'}`}>
                            {user.is_active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleToggleActive(user.id)}
                            disabled={processingId === user.id}
                            className="btn btn-ghost btn-sm"
                          >
                            {processingId === user.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : user.is_active ? (
                              <ToggleRight className="w-5 h-5 text-error" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-success" />
                            )}
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
    </div>
  );
}
