"use client";

import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { signup } from "./actions";

export type RegisterFormInputs = {
  email: string;
  username: string;
  full_name: string;
  password: string;
  role: string;
  confirmPassword: string;
};

function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    data.role = "operator";

    const result = await signup(data);

    if (result.error) {
      console.log(result.error);
    } else {
      console.log(
        "¡Usuario creado exitosamente! Por favor, revisa tu Gmail para confirmar la cuenta.", 
        data
      );
    }
  };

  const password = watch("password");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full px-5 mt-5 gap-1"
    >
      <label className="label label-text">Correo electrónico</label>
      <input
        type="email"
        placeholder="juan@example.com"
        className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`}
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

      <label className="label label-text mt-2">Usuario</label>
      <input
        type="text"
        placeholder="juanito"
        className={`input input-bordered w-full ${errors.username ? "input-error" : ""}`}
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

      <label className="label label-text mt-2">Nombre Completo</label>
      <input
        type="text"
        placeholder="Juan Pérez"
        className={`input input-bordered w-full ${errors.full_name ? "input-error" : ""}`}
        {...register("full_name", { required: "El nombre es obligatorio" })}
      />
      {errors.full_name && (
        <span className="text-error text-xs mt-1">
          {errors.full_name.message}
        </span>
      )}

      <label className="label label-text mt-2">Contraseña</label>
      <input
        type="password"
        placeholder="●●●●●●●●"
        className={`input input-bordered w-full ${errors.password ? "input-error" : ""}`}
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

      <label className="label label-text mt-2">Confirmar Contraseña</label>
      <input
        type="password"
        placeholder="●●●●●●●●"
        className={`input input-bordered w-full ${errors.confirmPassword ? "input-error" : ""}`}
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

      <p className="text-sm my-4">
        ¿Ya tienes una cuenta?{" "}
        <Link
          href="/auth/login"
          className="text-primary font-bold hover:underline"
        >
          Iniciar sesión
        </Link>
      </p>

      <button type="submit" className="btn btn-primary w-full">
        Registrar
      </button>
    </form>
  );
}

export default RegisterForm;
