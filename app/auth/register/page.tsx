import RegisterForm from "@/components/auth/registerForm";
import { Facebook, Instagram } from 'lucide-react';
function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="login-card flex w-[850px] max-w-[95%] bg-base-200 rounded-[4px] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.1)]">
        <div 
          className="image-side hidden lg:flex flex-1 bg-cover bg-center min-h-[500px]"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80')"
          }}
        />

        <div className="form-side flex-1 p-10 flex flex-col">
          <div className="header-form flex justify-between items-center mb-5">
            <h2 className="text-[1.8rem] text-base-content font-[500]">Registrarse</h2>
            <div className="social-icons flex gap-2.5">
              <a href="#" className="w-9 h-9 rounded-full border border-base-content/20 flex justify-center items-center text-base-content/90 text-[0.9rem] no-underline transition-all hover:bg-primary hover:text-white hover:border-primary">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-base-content/20 flex justify-center items-center text-base-content/90 text-[0.9rem] no-underline transition-all hover:bg-primary hover:text-white hover:border-primary">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
