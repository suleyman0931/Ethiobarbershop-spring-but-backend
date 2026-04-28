import { useMutation } from "@tanstack/react-query";
import { getHairstyleRecommendations } from "@/api/hairstyle";

export const useHairstyleRecommendations = () => {
  return useMutation({
    mutationFn: ({ imageFile, hairType }: { imageFile: File; hairType: number }) =>
      getHairstyleRecommendations(imageFile, hairType),
  });
};
