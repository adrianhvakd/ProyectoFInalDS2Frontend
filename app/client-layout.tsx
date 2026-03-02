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
  
  const isAuthPage = pathname?.startsWith('/auth/login') || 
                     pathname?.startsWith('/auth/register') ||
                     pathname?.startsWith('/auth/callback');

  if (isAuthPage) {
    return (
      <body className="antialiased font-sans">
        {children}
      </body>
    );
  }

  return (
    <body className="antialiased font-sans">
      <AlertNotifications />
      <Sidebar userData={userData}>
        {children}
      </Sidebar>
    </body>
  );
}
