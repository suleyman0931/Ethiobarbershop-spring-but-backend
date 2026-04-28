import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRating, getBarberRatings, getMyRatings } from "@/api/ratings";
import type { RatingRequest, RatingResponse, BarberRatingSummary } from "@/types/rating";

/**
 * React Query hooks for rating management
 * Implements Requirements 4.1, 6.1, 7.1 from appointment-management-rating spec
 */

/**
 * Hook for creating a rating for a completed appointment
 * Invalidates both ratings and appointments queries on success
 * Validates: Requirements 4.1
 */
export const useCreateRating = () => {
  const queryClient = useQueryClient();

  return useMutation<RatingResponse, Error, RatingRequest>({
    mutationFn: (data: RatingRequest) => createRating(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

/**
 * Hook for fetching ratings for a specific barber
 * Returns barber rating summary with average, total count, and individual ratings
 * Validates: Requirements 6.1, 7.1
 */
export const useBarberRatings = (barberId: number) => {
  return useQuery<BarberRatingSummary, Error>({
    queryKey: ["ratings", "barber", barberId],
    queryFn: () => getBarberRatings(barberId),
    enabled: !!barberId,
  });
};

/**
 * Hook for fetching ratings for the authenticated barber
 * Returns list of all ratings received by the barber
 * Validates: Requirements 6.1
 */
export const useMyRatings = () => {
  return useQuery<RatingResponse[], Error>({
    queryKey: ["ratings", "my"],
    queryFn: () => getMyRatings(),
  });
};
