"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Scissors } from "lucide-react";
import { PasswordInput } from "@/components/ui/PasswordInput";

interface RegisterBarberForm {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  skills: string;
  experienceYears: number;
  shopId: number | "";
}

export default function RegisterBarberPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterBarberForm>({
    username: "", email: "", password: "",
    firstName: "", lastName: "", phoneNumber: "",
    skills: "", experienceYears: 0, shopId: "",
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: shops = [] } = useQuery({
    queryKey: ["shops"],
    queryFn: () => apiClient.get<any[]>("/shops"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    if (!form.shopId) {
      setMessage("Please select a branch for this barber.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post<{ message: string }>("/owners/register-barber", {
        ...form,
        shopId: Number(form.shopId),
      });
      setMessage(res.message);
      setIsSuccess(true);
      setForm({ username: "", email: "", password: "", firstName: "", lastName: "", phoneNumber: "", skills: "", experienceYears: 0, shopId: "" });
    } catch (err: any) {
      setMessage(err.message || "Failed to register barber");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Scissors className="w-5 h-5 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Register New Barber</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        {message && (
          <div className={`mb-4 text-sm px-4 py-3 rounded-lg ${isSuccess ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Branch Selection — first and required */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Branch <span className="text-red-500">*</span>
            </label>
            <select
              value={form.shopId}
              onChange={e => setForm(f => ({ ...f, shopId: e.target.value as any }))}
              required
              className={inputClass}
            >
              <option value="">Select a branch...</option>
              {shops.map((shop: any) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name} — {shop.address}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
              <input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
              <input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} required className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <PasswordInput value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input value={form.phoneNumber} onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))} required className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Skills</label>
            <input value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} placeholder="Fade, Taper, Beard Trim..." className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience</label>
            <input type="number" min={0} value={form.experienceYears}
              onChange={e => setForm(f => ({ ...f, experienceYears: Number(e.target.value) }))} className={inputClass} />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all">
            {loading ? "Registering..." : "Register Barber"}
          </button>
        </form>
      </div>
    </div>
  );
}
