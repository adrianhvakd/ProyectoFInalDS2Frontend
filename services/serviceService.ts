import { createClient } from '@/utils/supabase/client';
import { Service } from '@/types/service';

const supabase = createClient();

export const serviceService = {
  async getServices(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('service')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    return data || [];
  },

  async getService(id: number): Promise<Service> {
    const { data, error } = await supabase
      .from('service')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
};
