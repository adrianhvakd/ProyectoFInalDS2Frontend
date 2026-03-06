'use client';

import { useState, useEffect } from 'react';
import { companyService } from '@/services/companyService';
import { Company } from '@/types/company';

export function useCompany(companyId?: number) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadCompany();
  }, [companyId]);

  const loadCompany = async () => {
    try {
      setLoading(true);
      const companies = await companyService.getAll();
      
      if (companyId) {
        const found = companies.find(c => c.id === companyId);
        setCompany(found || null);
      } else {
        setCompany(companies[0] || null);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = async (data: Partial<Company>) => {
    if (!company) return;
    const updated = await companyService.update(company.id, data);
    setCompany(updated);
    return updated;
  };

  const completeOnboarding = async () => {
    if (!company) return;
    const updated = await companyService.completeOnboarding(company.id);
    setCompany(updated);
    return updated;
  };

  return {
    company,
    loading,
    error,
    refresh: loadCompany,
    updateCompany,
    completeOnboarding,
  };
}
