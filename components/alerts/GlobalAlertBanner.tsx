'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Alert } from '@/types/alert';
import { getUserData } from '@/components/auth/actions';
import { 
  AlertTriangle, 
  X, 
  Bell, 
  CheckCircle,
  ChevronRight,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export function GlobalAlertBanner() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadCompanyId() {
      const userData = await getUserData();
      if (userData?.company_id) {
        setCompanyId(userData.company_id);
      }
    }
    loadCompanyId();
  }, []);

  useEffect(() => {
    if (!companyId) return;

    const fetchAlerts = async () => {
      try {
        const { data, error } = await supabase
          .from('alert')
          .select('*')
          .eq('is_resolved', false)
          .eq('company_id', companyId)
          .order('timestamp', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching alerts:', error);
          return;
        }

        setAlerts(data || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    const channel = supabase
      .channel('global-alerts-banner')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alert',
        },
        () => {
          fetchAlerts();
          setDismissed(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [companyId]);

  const resolveAlert = async (alertId: number) => {
    try {
      await supabase
        .from('alert')
        .update({ is_resolved: true })
        .eq('id', alertId);

      setAlerts(prev => prev.filter(a => a.id !== alertId));
    } catch (err) {
      console.error('Error resolving alert:', err);
    }
  };

  const criticalAlerts = alerts.filter(a => a.severity === 'high');
  const warningAlerts = alerts.filter(a => a.severity === 'medium');
  const hasAlerts = alerts.length > 0;

  if (loading || dismissed || !hasAlerts) {
    return null;
  }

  const bannerColor = criticalAlerts.length > 0 
    ? 'bg-error/90 hover:bg-error' 
    : 'bg-warning/90 hover:bg-warning';

  return (
    <div className={`${bannerColor} text-white px-4 py-2 shadow-lg transition-all duration-300`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse" />
          
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-sm whitespace-nowrap">
              {criticalAlerts.length > 0 
                ? `${criticalAlerts.length} alerta${criticalAlerts.length > 1 ? 's' : ''} crítica${criticalAlerts.length > 1 ? 's' : ''}`
                : `${warningAlerts.length} advertencia${warningAlerts.length > 1 ? 's' : ''}`
              }
            </span>
            
            <div className="flex gap-2 overflow-x-auto max-w-md scrollbar-hide">
              {alerts.slice(0, 3).map((alert) => (
                <button
                  key={alert.id}
                  onClick={() => resolveAlert(alert.id)}
                  className="flex items-center gap-1 bg-white/20 hover:bg-white/30 rounded-full px-2 py-0.5 text-xs whitespace-nowrap transition-colors"
                >
                  <span className="max-w-[150px] truncate">{alert.message}</span>
                  <CheckCircle className="w-3 h-3 flex-shrink-0" />
                </button>
              ))}
              {alerts.length > 3 && (
                <span className="text-xs opacity-80 whitespace-nowrap">
                  +{alerts.length - 3} más
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link 
            href="/operator/alerts" 
            className="flex items-center gap-1 text-xs hover:underline font-medium"
          >
            Ver todas <ChevronRight className="w-3 h-3" />
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
