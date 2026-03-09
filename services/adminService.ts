import { createClient } from '@/utils/supabase/client';
import { Order } from '@/types/order';
import { User } from '@/types/user';
import { API_URL } from '@/lib/api';
import { UUID } from 'crypto';


const supabase = createClient();

export const adminService = {
  async getOrders(): Promise<Order[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    const session = (await supabase.auth.getSession()).data.session;
    
    const response = await fetch(`${API_URL}/admin/orders`, {
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los pedidos');
    }

    return response.json();
  },

  async getOrder(orderId: number): Promise<Order> {
    const session = (await supabase.auth.getSession()).data.session;

    const response = await fetch(`${API_URL}/admin/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener el pedido');
    }

    return response.json();
  },

  async approveOrder(orderId: number): Promise<Order> {
    const session = (await supabase.auth.getSession()).data.session;

    const response = await fetch(`${API_URL}/admin/orders/${orderId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al aprobar el pedido');
    }

    return response.json();
  },

  async rejectOrder(orderId: number): Promise<Order> {
    const session = (await supabase.auth.getSession()).data.session;

    const response = await fetch(`${API_URL}/admin/orders/${orderId}/reject`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al rechazar el pedido');
    }

    return response.json();
  },

  async getUsers(): Promise<User[]> {
    const session = (await supabase.auth.getSession()).data.session;

    const response = await fetch(`${API_URL}/admin/users`, {
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los usuarios');
    }

    return response.json();
  },

  async toggleUserActive(userId: UUID): Promise<User> {
    const session = (await supabase.auth.getSession()).data.session;

    const response = await fetch(`${API_URL}/admin/users/${userId}/toggle`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al cambiar el estado del usuario');
    }

    return response.json();
  },

  async getStats(): Promise<{
    total_users: number;
    total_orders: number;
    pending_orders: number;
    approved_orders: number;
    rejected_orders: number;
  }> {
    const session = (await supabase.auth.getSession()).data.session;

    const response = await fetch(`${API_URL}/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener las estadísticas');
    }

    return response.json();
  },
};
