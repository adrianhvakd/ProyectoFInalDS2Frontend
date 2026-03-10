"use client";

import { useEffect, useRef } from "react";
import { logout } from "./auth/actions";
import { UserData } from "./auth/actions";
import { useNotifications, NotificationBell, NotificationDropdown } from "@/components/ui/useNotifications";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  Gauge,
  TriangleAlert,
  LogOut,
  HardHat,
  Menu,
  Settings,
  User,
  ShoppingCart,
  Users,
  Shield,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  children: React.ReactNode;
  userData?: UserData;
}

export default function Sidebar({ children, userData }: SidebarProps) {
  const pathname = usePathname();
  const role = userData?.role || 'user';
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { notifications, loading, isOpen, unreadCount, openNotifications, closeNotifications, markAllAsRead } = useNotifications();

  const operatorNavItems = [
    { href: "/operator", label: "Dashboard", icon: Gauge },
    { href: "/operator/map", label: "Mapa de la Mina", icon: HardHat },
    { href: "/operator/alerts", label: "Alertas", icon: TriangleAlert },
    { href: "/operator/subscription", label: "Suscripción", icon: CreditCard },
  ];

  const adminNavItems = [
    { href: "/admin", label: "Dashboard", icon: Gauge },
    { href: "/admin/orders", label: "Pedidos", icon: ShoppingCart },
    { href: "/admin/users", label: "Usuarios", icon: Users },
  ];

  const navItems = role === 'admin' ? adminNavItems : operatorNavItems;

  const displayName = userData?.username || userData?.full_name || 'Usuario';
  const displayRole = role === 'admin' ? 'Administrador' : role === 'operator' ? 'Operador' : 'Usuario';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeNotifications();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeNotifications]);

  return (
    <div className="drawer lg:drawer-open bg-base-100">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col min-h-screen">
        <nav className="navbar w-full bg-base-100 border-b border-base-300/50 sticky top-0 z-30 px-4 h-16">
          <div className="flex-1 flex items-center gap-4">
            <label
              htmlFor="my-drawer"
              aria-label="Abrir menú"
              className="btn btn-square btn-ghost"
            >
              <Menu className="size-5" />
            </label>
          </div>

          <div className="flex-none flex items-center gap-2 sm:gap-4">

            <ThemeToggle />

            <div className="relative" ref={dropdownRef}>
              <NotificationBell unreadCount={unreadCount} onClick={openNotifications} />
              <NotificationDropdown 
                notifications={notifications} 
                loading={loading} 
                isOpen={isOpen} 
                onClose={closeNotifications}
                onMarkAllRead={markAllAsRead}
              />
            </div>

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-3 hover:bg-base-200/50 p-1 pr-3 rounded-full transition-all cursor-pointer"
              >
                <div className="avatar placeholder">
                  <div className="bg-primary/20 text-primary border border-primary rounded-full w-9 h-9 flex items-center justify-center shadow-inner">
                    <User className="size-5" />
                  </div>
                </div>
                <div className="flex flex-col items-start hidden md:flex">
                  <span className="text-sm font-semibold leading-none">
                    {displayName}
                  </span>
                  <span className="text-xs text-base-content/50 mt-1">
                    {displayRole}
                  </span>
                </div>
              </div>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-200 border border-base-300 rounded-box z-1 mt-4 w-56 p-2 shadow-xl"
              >
                <li className="menu-title px-4 py-2 text-xs opacity-60">
                  Mi Cuenta
                </li>
                <li>
                  <Link href="/profile" className="py-2.5">
                    <User className="size-4 opacity-70" /> Mi Perfil
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="py-2.5">
                    <Settings className="size-4 opacity-70" /> Configuración
                  </Link>
                </li>
                <div className="divider my-1"></div>
                <li className="p-0">
                  <form action={logout} className="p-0 w-full flex">
                    <button
                      type="submit"
                      className="w-full text-error flex items-center justify-start rounded-lg px-3 gap-1 py-2.5 hover:bg-error/10"
                    >
                      <LogOut className="size-4" /> Cerrar sesión
                    </button>
                  </form>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <main className="flex-1 bg-base-100">{children}</main>
      </div>

      <div className="drawer-side z-40 is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <div className="flex min-h-full flex-col bg-base-100 is-drawer-close:w-20 is-drawer-open:w-64 border-r border-base-300/50 transition-all">
          <div className="flex flex-col items-center gap-2 px-4 py-6 border-b border-base-300/50">
            <Shield className="size-12 text-primary is-drawer-close:size-8 transition-all" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-base-content/80 is-drawer-close:hidden">
              MineMonitor
            </span>
          </div>

          <ul className="menu w-full grow gap-2 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`is-drawer-close:tooltip is-drawer-close:tooltip-right py-3 px-4 rounded-xl transition-all ${
                      isActive
                        ? "bg-primary text-primary-content shadow-lg shadow-primary/20 hover:bg-primary/90 hover:text-primary-content"
                        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                    }`}
                    data-tip={item.label}
                  >
                    <Icon className="size-5" />
                    <span className="is-drawer-close:hidden font-medium">
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="w-full p-4 border-t border-base-300/50">
            <form action={logout}>
              <button
                className="btn btn-outline btn-error w-full is-drawer-close:tooltip is-drawer-close:tooltip-right rounded-xl"
                data-tip="Cerrar sesión"
              >
                <LogOut className="size-5" />
                <span className="is-drawer-close:hidden">Cerrar sesión</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
