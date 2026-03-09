"use client";

import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { signup } from "./actions";
import { useState } from "react";

export type RegisterFormInputs = {
  email: string;
  username: string;
  full_name: string;
  password: string;
  confirmPassword: string;
};

function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    setIsLoading(true);

    const result = await signup(data);

    setIsLoading(false);

    if (result.error) {
      alert(result.error);
    } else {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-8">
        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
          <i className="fas fa-envelope text-2xl text-success"></i>
        </div>
        <h3 className="text-xl font-semibold text-base-content mb-2">¡Registro exitoso!</h3>
        <p className="text-base-content/60 text-sm mb-6">
          Te hemos enviado un correo de verificación a tu bandeja de entrada.
          Por favor, revisa tu email y haz clic en el enlace para activar tu cuenta.
        </p>
        <Link
          href="/auth/login"
          className="btn bg-primary text-base-content border-none py-3 px-6 rounded-[4px] font-[500] transition-all"
        >
          Ir a Iniciar Sesión
        </Link>
      </div>
    );
  }

  const password = watch("password");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-0">
      <div className="input-group mb-2">
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
          <span className="text-error text-xs mt-1">{errors.email.message}</span>
        )}
      </div>

      <div className="input-group mb-2">
        <label className="block uppercase text-[0.7rem] font-bold text-base-content mb-2 tracking-wider">
          Nombre de Usuario
        </label>
        <input
          type="text"
          placeholder="juanito"
          className={`w-full py-3 border-b border-base-content/20 outline-none text-[0.9rem] transition-all focus:border-b-primary ${errors.username ? "border-b-error" : ""}`}
          {...register("username", {
            required: "El usuario es obligatorio",
            minLength: { value: 3, message: "Mínimo 3 caracteres" },
          })}
        />
        {errors.username && (
          <span className="text-error text-xs mt-1">
            {errors.username.message}
          </span>
        )}
      </div>

      <div className="input-group mb-2">
        <label className="block uppercase text-[0.7rem] font-bold text-base-content mb-2 tracking-wider">
          Nombre Completo
        </label>
        <input
          type="text"
          placeholder="Juan Pérez"
          className={`w-full py-3 border-b border-base-content/20 outline-none text-[0.9rem] transition-all focus:border-b-primary ${errors.full_name ? "border-b-error" : ""}`}
          {...register("full_name", { required: "El nombre es obligatorio" })}
        />
        {errors.full_name && (
          <span className="text-error text-xs mt-1">
            {errors.full_name.message}
          </span>
        )}
      </div>

      <div className="input-group mb-2">
        <label className="block uppercase text-[0.7rem] font-bold text-base-content mb-2 tracking-wider">
          Contraseña
        </label>
        <input
          type="password"
          placeholder="●●●●●●●●"
          className={`w-full py-3 border-b border-base-content/20 outline-none text-[0.9rem] transition-all focus:border-b-primary ${errors.password ? "border-b-error" : ""}`}
          {...register("password", {
            required: "La contraseña es obligatoria",
            minLength: { value: 8, message: "Debe tener al menos 8 caracteres" },
          })}
        />
        {errors.password && (
          <span className="text-error text-xs mt-1">
            {errors.password.message}
          </span>
        )}
      </div>

      <div className="input-group mb-2">
        <label className="block uppercase text-[0.7rem] font-bold text-base-content mb-2 tracking-wider">
          Confirmar Contraseña
        </label>
        <input
          type="password"
          placeholder="●●●●●●●●"
          className={`w-full py-3 border-b border-base-content/20 outline-none text-[0.9rem] transition-all focus:border-b-primary ${errors.confirmPassword ? "border-b-error" : ""}`}
          {...register("confirmPassword", {
            required: "Confirma tu contraseña",
            validate: (value) =>
              value === password || "Las contraseñas no coinciden",
          })}
        />
        {errors.confirmPassword && (
          <span className="text-error text-xs mt-1">
            {errors.confirmPassword.message}
          </span>
        )}
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="btn btn-primary mt-2.5"
      >
        {isLoading ? "Cargando..." : "Registrarse"}
      </button>

      <p className="text-center mt-auto pt-3 text-[0.85rem] text-base-content/60">
        ¿Ya tienes una cuenta?{" "}
        <Link
          href="/auth/login"
          className="text-primary font-bold no-underline hover:underline"
        >
          Iniciar Sesión
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
