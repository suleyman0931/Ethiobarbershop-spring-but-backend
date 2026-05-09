"use client";
// app/owners/profile/createpage.tx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ownerSchema,
  type OwnerPayload,
} from "@/modules/owner/types/owner.types";
import { useRouter } from "next/navigation";
import { ownerService } from "@/modules/owner/services";
import { useState } from "react";
import { imageService } from "@/modules/image/services";

export default function CreateOwnerProfilePage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OwnerPayload>({
    resolver: zodResolver(ownerSchema),
  });

  // For storing the selected image file before upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 1) user picks a file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // 2) onSubmit → create the profile, then upload file, then go to dashboard
  const onSubmit = async (payload: OwnerPayload) => {
    try {
      const newProfile = await ownerService.createOwnerProfile(payload);

      if (selectedFile) {
        await imageService.uploadOwnerImage(newProfile.ownerId, selectedFile);
      }

      router.push("/owners/dashboard");
    } catch (error) {
      console.error("Create Owner Profile error:", error);
      alert("Failed to create profile or upload image.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-2xl w-full z-10 animate-in-fade">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Become an Owner</h1>
          <p className="mt-3 text-lg text-slate-500">Complete your profile to start managing your barbershop.</p>
        </div>

        <div className="glass-card rounded-2xl p-8 sm:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">First Name</label>
                <input
                  {...register("firstName")}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                  placeholder="Jane"
                />
                {errors.firstName && (
                  <span className="text-red-500 text-sm mt-1 inline-block">{errors.firstName.message}</span>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Last Name</label>
                <input
                  {...register("lastName")}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                  placeholder="Smith"
                />
                {errors.lastName && (
                  <span className="text-red-500 text-sm mt-1 inline-block">{errors.lastName.message}</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Phone Number</label>
              <input
                {...register("phoneNumber")}
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                placeholder="(555) 987-6543"
              />
              {errors.phoneNumber && (
                <span className="text-red-500 text-sm mt-1 inline-block">{errors.phoneNumber.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Profile Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl bg-white/30 hover:bg-white/50 transition-colors">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-slate-600 justify-center">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                  {selectedFile && <p className="text-sm font-semibold text-amber-700 mt-2">Selected: {selectedFile.name}</p>}
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-4 px-4 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                Create Owner Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
