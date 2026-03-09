"use client";

import Link from "next/link";
import { logout } from "@/components/auth/actions";
import NavbarNotifications from "@/components/layout/NavbarNotifications";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Shield, LogOut, ChevronRight, Users } from "lucide-react";

interface UserData {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: string;
}

interface PublicNavbarProps {
  user?: UserData | null;
}

export default function PublicNavbar({ user }: PublicNavbarProps) {
  return (
    <div className="navbar bg-base-100/80 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 border-b border-base-300/50 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-200 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg">
            <li><Link href="/services" className="cursor-pointer">Servicios</Link></li>
            <li><a className="cursor-pointer">Acerca de</a></li>
            <li><a className="cursor-pointer">Contacto</a></li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl gap-2 cursor-pointer">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-base-content">MineMonitor</span>
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li>
            <Link href="/services" className="text-base-content/70 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer">
              Servicios
            </Link>
          </li>
          <li>
            <a className="text-base-content/70 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer">
              Acerca de
            </a>
          </li>
          <li>
            <a className="text-base-content/70 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer">
              Contacto
            </a>
          </li>
        </ul>
      </div>
      
      <div className="navbar-end gap-2">
        <ThemeToggle />
        
        {user ? (
          <>
            <NavbarNotifications />
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar cursor-pointer">
                <div className="w-9 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-sm font-bold">
                    {user.username?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                  </span>
                </div>
              </div>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52 border border-base-300">
                <li className="menu-title px-2 py-1 text-xs">
                  <span className="text-base-content/60">{user.email}</span>
                </li>
                <li>
                  <Link href={`/${user.role}`} className="cursor-pointer">
                    <ChevronRight className="w-4 h-4" />
                    Mi Panel
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="cursor-pointer">
                    <Users className="w-4 h-4" />
                    Perfil
                  </Link>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <form action={logout}>
                    <button type="submit" className="w-full text-error cursor-pointer">
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </form>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="btn btn-ghost btn-sm gap-1 cursor-pointer">
              Iniciar Sesión
            </Link>
            <Link href="/auth/register" className="btn btn-primary btn-sm gap-1 cursor-pointer">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
