"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { authService } from "@/modules/auth/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { registerSchema, type RegisterPayload } from "@/modules/auth/types/auth.types";
import { PasswordInput } from "@/components/ui/PasswordInput";

export default function SignupPage() {
  const router = useRouter();
  const { setCredentials } = useAuthStore();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterPayload>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "customer" },
  });

  const onSubmit = async (data: RegisterPayload) => {
    try {
      await authService.signup({ ...data, role: "customer" });

      const loginRes = await authService.login({
        username: data.username,
        password: data.password,
      });

      setCredentials(
        { id: loginRes.id.toString(), username: loginRes.username, email: loginRes.email, roles: loginRes.roles },
        loginRes.accessToken,
        loginRes.refreshToken
      );

      router.push("/customers/profile/create");
    } catch (error: any) {
      setError("root", { message: error.message || "Signup failed. Please try again." });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Create account</h1>
          <p className="mt-2 text-slate-600">Join Ethio Barbershop and book your next cut</p>
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
                {...register("username")}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 active:bg-purple-50 outline-none transition-all"
                placeholder="your_username"
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                {...register("email")}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 active:bg-purple-50 outline-none transition-all"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <PasswordInput
                {...register("password")}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 active:from-purple-800 active:to-pink-800 disabled:opacity-60 disabled:cursor-not-allowed py-3 px-4 rounded-xl font-bold text-white shadow-md hover:shadow-lg active:shadow-sm transition-all transform active:scale-[0.98]"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-purple-600 font-semibold hover:text-purple-700 hover:underline transition-colors">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
