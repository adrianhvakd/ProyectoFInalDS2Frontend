"use client";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { login } from "./actions";

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

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {

    const result = await login(data);

    if (result && result.error) {
      console.log(result.error);
      alert(result.error); 
    }

  };

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
        <span className="text-error text-xs mt-1">
          {String(errors.email.message)}
        </span>
      )}

      <label className="label label-text mt-3">Contraseña</label>
      <input
        type="password"
        placeholder="●●●●●●●●"
        className={`input input-bordered w-full ${errors.password ? "input-error" : ""}`}
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

      <p className="text-sm my-4">
        ¿No tienes una cuenta?{" "}
        <Link
          href="/auth/register"
          className="text-primary font-bold hover:underline"
        >
          Regístrate
        </Link>
      </p>

      <button type="submit" className="btn btn-primary w-full">
        Login
      </button>
    </form>
  );
}

export default LoginForm;
