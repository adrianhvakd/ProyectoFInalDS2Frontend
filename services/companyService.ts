import { API_URL } from '@/lib/api';
import { Company, CompanyCreate, CompanyUpdate } from '@/types/company';

export const companyService = {
  async getAll(): Promise<Company[]> {
    const res = await fetch(`${API_URL}/companies/`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Error fetching companies');
    return res.json();
  },

  async getById(id: number): Promise<Company> {
    const res = await fetch(`${API_URL}/companies/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Error fetching company');
    return res.json();
  },

  async create(data: CompanyCreate): Promise<Company> {
    const res = await fetch(`${API_URL}/companies/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error creating company');
    return res.json();
  },

  async update(id: number, data: CompanyUpdate): Promise<Company> {
    const res = await fetch(`${API_URL}/companies/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error updating company');
    return res.json();
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/companies/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error deleting company');
  },

  async completeOnboarding(id: number): Promise<Company> {
    const res = await fetch(`${API_URL}/companies/${id}/complete-onboarding`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Error completing onboarding');
    return res.json();
  },

  async getOnboardingStatus(id: number): Promise<{ onboarding_completed: boolean }> {
    const res = await fetch(`${API_URL}/companies/${id}/onboarding-status`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Error fetching onboarding status');
    return res.json();
  },
};
