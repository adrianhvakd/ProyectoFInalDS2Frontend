import LoginForm from "@/components/auth/loginForm";

function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <h1 className="text-5xl font-black italic mb-4">MINA PRO</h1>
          <p className="text-xl opacity-90 max-w-md">
            Sistema de monitoreo en tiempo real para operaciones mineras.
            Controla tus sensores y recibe alertas instantáneas.
          </p>
          <div className="mt-8 flex gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-2xl font-bold">24/7</p>
              <p className="text-sm opacity-70">Monitoreo</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-2xl font-bold">Real-time</p>
              <p className="text-sm opacity-70">Alertas</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-2xl font-bold">100%</p>
              <p className="text-sm opacity-70">Online</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-base-100">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-black text-primary italic">MINA PRO</h1>
            <p className="text-base-content/60">Sistema de Monitoreo Minero</p>
          </div>

          <h2 className="text-2xl font-semibold mb-2">Bienvenido de nuevo</h2>
          <p className="text-base-content/60 mb-8">Ingresa tus credenciales para acceder al panel</p>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
