import { createClient } from '@/utils/supabase/client';
import {
  SubscriptionInfo,
  SubscriptionPayment,
  RenewalCalculation,
  UpgradeCalculation,
  DowngradeCalculation,
} from '@/types/subscription';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const supabase = createClient();

async function getAuthHeader(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Authorization': `Bearer ${session?.access_token}`,
  };
}

export const subscriptionService = {
  async getMySubscription(): Promise<SubscriptionInfo> {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/subscriptions/me`, {
      credentials: 'include',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al obtener suscripción');
    }
    return response.json();
  },

  async getHistory(): Promise<SubscriptionPayment[]> {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/subscriptions/history`, {
      credentials: 'include',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al obtener historial');
    }
    return response.json();
  },

  async calculateRenewal(): Promise<RenewalCalculation> {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/subscriptions/renewal/calculate`, {
      credentials: 'include',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al calcular renovación');
    }
    return response.json();
  },

  async createRenewalPayment(file: File): Promise<SubscriptionPayment> {
    const headers = await getAuthHeader();
    const formData = new FormData();
    formData.append('payment_proof', file);
    
    const response = await fetch(`${API_URL}/subscriptions/renewal`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al crear pago de renovación');
    }
    return response.json();
  },

  async calculateUpgrade(newServiceId: number): Promise<UpgradeCalculation> {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/subscriptions/upgrade/calculate/${newServiceId}`, {
      credentials: 'include',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al calcular upgrade');
    }
    return response.json();
  },

  async processUpgrade(newServiceId: number, file: File): Promise<SubscriptionPayment> {
    const headers = await getAuthHeader();
    const formData = new FormData();
    formData.append('payment_proof', file);
    
    const response = await fetch(`${API_URL}/subscriptions/upgrade/${newServiceId}`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al procesar upgrade');
    }
    return response.json();
  },

  async calculateDowngrade(newServiceId: number): Promise<DowngradeCalculation> {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/subscriptions/downgrade/calculate/${newServiceId}`, {
      credentials: 'include',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al calcular downgrade');
    }
    return response.json();
  },

  async processDowngrade(newServiceId: number): Promise<{ message: string; company_id: number }> {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/subscriptions/downgrade/${newServiceId}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al procesar downgrade');
    }
    return response.json();
  },
};
