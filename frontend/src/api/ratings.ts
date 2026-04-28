import { apiClient } from "@/lib/api";
import type { RatingRequest, RatingResponse, BarberRatingSummary } from "@/types/rating";

/**
 * API client methods for rating management
 * Implements Requirements 4.1, 6.1, 7.1 from appointment-management-rating spec
 */

export const createRating = (data: RatingRequest): Promise<RatingResponse> => {
  return apiClient.post<RatingResponse>("/ratings", data);
};

export const getBarberRatings = (barberId: number): Promise<BarberRatingSummary> => {
  return apiClient.get<BarberRatingSummary>(`/ratings/barber/${barberId}`);
};

export const getMyRatings = (): Promise<RatingResponse[]> => {
  return apiClient.get<RatingResponse[]>("/ratings/my-ratings");
};
