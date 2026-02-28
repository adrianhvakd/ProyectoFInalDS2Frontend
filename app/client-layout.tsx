"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar";
import AlertNotifications from "@/components/alerts/AlertNotifications";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isAuthPage = pathname?.startsWith('/auth/login') || 
                     pathname?.startsWith('/auth/register') ||
                     pathname?.startsWith('/auth/callback');

  if (isAuthPage) {
    return (
      <html lang="es" data-theme="light">
        <body className="antialiased font-sans">
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="es" data-theme="light">
      <body className="antialiased font-sans">
        <AlertNotifications />
        <Sidebar>
          {children}
        </Sidebar>
      </body>
    </html>
  );
}
