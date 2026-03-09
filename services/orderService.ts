import { createClient } from '@/utils/supabase/client';
import { Order, OrderCreate } from '@/types/order';
import { API_URL } from '@/lib/api';

const supabase = createClient();

export const orderService = {
  async createOrder(orderData: OrderCreate): Promise<Order> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    const response = await fetch(`${API_URL}/orders/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al crear el pedido');
    }

    return response.json();
  },

  async getMyOrders(): Promise<Order[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    const response = await fetch(`${API_URL}/orders/me`, {
      headers: {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los pedidos');
    }

    return response.json();
  },

  async getOrder(orderId: number): Promise<Order> {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener el pedido');
    }
    console.log(response);
    return response.json();
  },

  async uploadPaymentProof(orderId: number, file: File): Promise<Order> {
    const formData = new FormData();
    formData.append('payment_proof', file);

    const { data: { session } } = await supabase.auth.getSession();

    const response = await fetch(`${API_URL}/orders/${orderId}/payment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al subir el comprobante');
    }

    return response.json();
  },
};
