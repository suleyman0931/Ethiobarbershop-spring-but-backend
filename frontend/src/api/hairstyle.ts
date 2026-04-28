import { apiClient } from "@/lib/api";
import type { HairstyleRecommendationResponse } from "@/types/hairstyle";

export const getHairstyleRecommendations = (
  imageFile: File,
  hairType: number = 101
): Promise<HairstyleRecommendationResponse> => {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("hair_type", String(hairType));

  // Call backend directly to avoid Next.js proxy timeout on large AI responses
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  return fetch("/api/external/hairstyle-recommendations", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Request failed with status ${res.status}`);
    }
    return res.json();
  });
};
