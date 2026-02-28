import { apiClientFetch } from "@/lib/api-client";
import { TrendPoint } from "@/types/reading";

export const getReadingTrendClient = async (type: string, hours: number = 24): Promise<TrendPoint[]> => {
  return await apiClientFetch<TrendPoint[]>(`readings/trend/${type}?hours=${hours}`);
};