import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ClientLayout from "./client-layout";
import { getUserData } from "@/components/auth/actions";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Monitoreo Minero",
  description: "Panel de control de sensores y alertas en tiempo real",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const userData = await getUserData();

  return (
    <html lang="es" data-theme="mining-dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var mode = localStorage.getItem('theme-mode') || 'dark';
                var color = localStorage.getItem('theme-color') || 'morado';
                var dataTheme = 'mining-' + mode + '-' + color;
                document.documentElement.setAttribute('data-theme', dataTheme);
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <ClientLayout userData={userData}>{children}</ClientLayout>
      </body>
    </html>
  );
}
