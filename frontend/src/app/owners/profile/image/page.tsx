"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { imageService } from "@/modules/image/services";
import { Button } from "@/modules/shadcn/ui/button";

export default function ProfileImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();

  const handleUpload = async () => {
    if (!file || !user) return;
    setIsUploading(true);
    try {
      await imageService.uploadOwnerImage(Number(user.id), file);
      router.push("/owners/profile/edit");
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 relative overflow-hidden">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-md w-full z-10 animate-in-fade">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Profile Image</h1>
          <p className="mt-2 text-slate-500">Upload a photo for your owner profile</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <div className="space-y-6">
            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl bg-white/30 hover:bg-white/50 transition-colors">
              <div className="space-y-2 text-center">
                <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-slate-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer font-medium text-blue-600 hover:text-blue-500">
                    <span>Choose a file</span>
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                {file && (
                  <p className="text-sm font-semibold text-blue-700 mt-2">Selected: {file.name}</p>
                )}
              </div>
            </div>

            <Button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="w-full premium-gradient border-none rounded-xl py-3 font-bold text-white shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload Image"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
