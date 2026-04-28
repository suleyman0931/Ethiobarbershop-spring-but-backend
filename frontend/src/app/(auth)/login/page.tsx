"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/modules/auth/services/auth.service";
import { loginSchema, type LoginPayload } from "@/modules/auth/types/auth.types";
import { PasswordInput } from "@/components/ui/PasswordInput";

export default function LoginPage() {
  const router = useRouter();
  const { setCredentials } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginPayload>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginPayload) => {
    try {
      const res = await authService.login(data);

      setCredentials(
        { id: res.id.toString(), username: res.username, email: res.email, roles: res.roles },
        res.accessToken,
        res.refreshToken
      );

      // Route based on role
      if (res.roles.includes("ROLE_OWNER"))   router.push("/owners/dashboard");
      else if (res.roles.includes("ROLE_BARBER"))  router.push("/barbers/dashboard");
      else                                          router.push("/");
    } catch {
      setError("root", { message: "Invalid username or password." });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Welcome back</h1>
          <p className="mt-2 text-slate-600">Sign in to your Ethio Barbershop account</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {errors.root && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {errors.root.message}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Username</label>
              <input
                type="text"
                {...register("username")}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 active:bg-blue-50 outline-none transition-all"
                placeholder="your_username"
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <PasswordInput
                {...register("password")}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed py-3 px-4 rounded-xl font-bold text-white shadow-md hover:shadow-lg active:shadow-sm transition-all transform active:scale-[0.98]"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
