"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Sidebar from "@/components/sidebar";
import AlertNotifications from "@/components/alerts/AlertNotifications";
import { GlobalAlertBanner } from "@/components/alerts/GlobalAlertBanner";
import { SubscriptionInfo } from "@/types/subscription";

interface ClientLayoutProps {
  children: React.ReactNode;
  userData?: {
    id: string;
    email: string;
    username: string;
    full_name: string;
    role: string;
    company_id?: number;
  };
}

export default function ClientLayout({ children, userData }: ClientLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [checked, setChecked] = useState(false);
  const supabase = createClient();
  
  const isAuthPage = pathname?.startsWith('/auth/login') || pathname?.startsWith('/auth/register') || pathname?.startsWith('/auth/callback');
  const isPublicPage = pathname === '/' || pathname?.startsWith('/services');
  const isOperatorPage = pathname?.startsWith('/operator');
  const isAdminPage = pathname?.startsWith('/admin');
  const isSubscriptionPage = pathname === '/operator/subscription';

  useEffect(() => {
    async function checkSubscription() {
      if (!userData?.company_id) {
        setChecked(true);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const headers = {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/me`, {
          credentials: 'include',
          headers,
        });
        
        if (response.ok) {
          const data = await response.json();
          setSubscription(data);
        }
      } catch (e) {
        console.error('Error checking subscription:', e);
      } finally {
        setChecked(true);
      }
    }

    if (userData?.role === 'operator' || userData?.role === 'admin') {
      checkSubscription();
    } else {
      setChecked(true);
    }
  }, [userData, supabase]);

  useEffect(() => {
    if (!checked) return;
    if (isAuthPage || isPublicPage || isSubscriptionPage) return;
    
    const shouldCheckSubscription = (isOperatorPage || isAdminPage) && userData?.role !== 'admin';
    
    if (shouldCheckSubscription && subscription) {
      const isActive = subscription.company?.is_subscription_active;
      
      if (!isActive) {
        router.push('/operator/subscription?expired=true');
      }
    }
  }, [checked, subscription, pathname, userData, isOperatorPage, isAdminPage, isSubscriptionPage, isPublicPage, isAuthPage, router]);

  if (isAuthPage || isPublicPage) {
    return <>{children}</>;
  }

  return (
    <>
      {isOperatorPage && <GlobalAlertBanner />}
      {(isOperatorPage || isAdminPage) && <AlertNotifications />}
      <Sidebar userData={userData}>
        {children}
      </Sidebar>
    </>
  );
}
