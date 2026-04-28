export interface RatingRequest {
  ratingScore: number;
  reviewText?: string;
  appointmentId: number;
}

export interface RatingResponse {
  id: number;
  ratingScore: number;
  reviewText?: string;
  createdAt: string; // ISO datetime from backend Instant
  customerId: number;
  customerName: string;
  barberId: number;
  appointmentId: number;
}

export interface BarberRatingSummary {
  barberId: number;
  averageRating: number;
  totalRatings: number;
  ratings: RatingResponse[];
}
