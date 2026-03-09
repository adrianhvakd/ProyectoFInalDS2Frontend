"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar";
import AlertNotifications from "@/components/alerts/AlertNotifications";
import { UserData } from "@/components/auth/actions";

interface ClientLayoutProps {
  children: React.ReactNode;
  userData?: UserData;
}

export default function ClientLayout({ children, userData }: ClientLayoutProps) {
  const pathname = usePathname();
  
  const isAuthPage = pathname?.startsWith('/auth/login') || pathname?.startsWith('/auth/register') || pathname?.startsWith('/auth/callback');
  const isPublicPage = pathname === '/' || pathname?.startsWith('/services') || pathname?.startsWith('/checkout') || pathname?.startsWith('/order');
  const isOperatorPage = pathname?.startsWith('/operator');
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAuthPage) {
    return (
      <body className="antialiased font-sans">
        {children}
      </body>
    );
  }

  if (isPublicPage) {
    return (
      <body className="antialiased font-sans">
        {children}
      </body>
    );
  }

  return (
    <body className="antialiased font-sans">
      {(isOperatorPage || isAdminPage) && <AlertNotifications />}
      <Sidebar userData={userData}>
        {children}
      </Sidebar>
    </body>
  );
}
