import Link from "next/link";
import { Shield } from "lucide-react";

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-4 border-t border-base-300/50 bg-base-200/30">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <span className="text-base-content/80 font-medium">
              © {currentYear} MineMonitor. Todos los derechos reservados.
            </span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-base-content/50 hover:text-primary transition-colors text-sm cursor-pointer">Términos</Link>
            <Link href="#" className="text-base-content/50 hover:text-primary transition-colors text-sm cursor-pointer">Privacidad</Link>
            <Link href="#" className="text-base-content/50 hover:text-primary transition-colors text-sm cursor-pointer">Contacto</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}