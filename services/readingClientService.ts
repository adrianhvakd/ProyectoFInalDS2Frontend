import { apiClientFetch } from "@/lib/api-client";
import { TrendPoint } from "@/types/reading";

export const getReadingTrendClient = async (type: string, hours: number = 24, companyId?: number): Promise<TrendPoint[]> => {
  const params = new URLSearchParams({ hours: hours.toString() });
  if (companyId) {
    params.append('company_id', companyId.toString());
  }
  return await apiClientFetch<TrendPoint[]>(`readings/trend/${type}?${params.toString()}`);
};