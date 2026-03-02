"use client";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { login } from "./actions";
import { useState } from "react";

export type LoginFormInputs = {
  email: string;
  password: string;
};

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const [rememberMe, setRememberMe] = useState(true);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const result = await login(data, rememberMe);

    if (result && result.error) {
      alert(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-0">
      <div className="input-group mb-6">
        <label className="block uppercase text-[0.7rem] font-bold text-base-content mb-2 tracking-wider">
          Correo Electrónico
        </label>
        <input
          type="email"
          placeholder="juan@example.com"
          className={`w-full py-3 border-b border-base-content/20 outline-none text-[0.9rem] transition-all focus:border-b-primary ${errors.email ? "border-b-error" : ""}`}
          autoFocus
          {...register("email", {
            required: "El correo es obligatorio",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email no válido",
            },
          })}
        />
        {errors.email && (
          <span className="text-error text-xs mt-1">
            {String(errors.email.message)}
          </span>
        )}
      </div>

      <div className="input-group mb-6">
        <label className="block uppercase text-[0.7rem] font-bold text-base-content mb-2 tracking-wider">
          Contraseña
        </label>
        <input
          type="password"
          placeholder="●●●●●●●●"
          className={`w-full py-3 border-b border-base-content/20 outline-none text-[0.9rem] transition-all focus:border-b-primary ${errors.password ? "border-b-error" : ""}`}
          {...register("password", {
            required: "La contraseña es obligatoria",
            minLength: { value: 8, message: "Mínimo 8 caracteres" },
          })}
        />
        {errors.password && (
          <span className="text-error text-xs mt-1">
            {String(errors.password.message)}
          </span>
        )}
      </div>

      <button 
        type="submit" 
        className="btn btn-primary mt-2.5"
      >
        Iniciar Sesión
      </button>

      <div className="footer-options flex justify-between items-center mt-6 text-[0.85rem]">
        <label className="checkbox-container flex items-center gap-2 text-primary font-[500] cursor-pointer">
          <input 
            type="checkbox" 
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="accent-primary"
          />
          <span>Recuerdame</span>
        </label>
        <a href="#" className="text-base-content/60 no-underline hover:text-primary transition-colors">
          ¿Has olvidado tu contraseña?
        </a>
      </div>

      <p className="text-center mt-auto pt-7 text-[0.85rem] text-base-content/60">
        ¿No tienes una cuenta?{" "}
        <Link
          href="/auth/register"
          className="text-primary font-bold no-underline hover:underline"
        >
          Registrarse
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
