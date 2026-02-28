"use client";

import { logout } from "./auth/actions";
import { Gauge, ChartLine, TriangleAlert, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Gauge },
    { href: "/sensors", label: "Sensores en vivo", icon: ChartLine },
    { href: "/alerts", label: "Alertas", icon: TriangleAlert },
  ];

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <nav className="navbar w-full bg-base-200">
          <label
            htmlFor="my-drawer"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="my-1.5 inline-block size-5"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>
          <div className="px-4 font-bold text-primary">MINA PRO</div>
        </nav>

        <main className="min-h-screen">{children}</main>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64 border-r border-primary/10">
          <div className="p-4 is-drawer-close:hidden">
            <h1 className="text-2xl font-black text-primary italic">MINA PRO</h1>
            <span className="text-[10px] uppercase tracking-widest opacity-50">
              Control Center
            </span>
          </div>

          <ul className="menu w-full grow gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${
                      isActive ? "bg-primary/20" : ""
                    }`}
                    data-tip={item.label}
                  >
                    <Icon className="size-5" />
                    <span className="is-drawer-close:hidden">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="w-full p-4 border-t border-primary/10">
            <form action={logout}>
              <button
                className="btn btn-error btn-outline btn-sm w-full is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Cerrar sesión"
              >
                <LogOut className="size-4" />
                <span className="is-drawer-close:hidden">Cerrar sesión</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
