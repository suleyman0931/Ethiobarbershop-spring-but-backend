import { z } from "zod";

export const ratingSchema = z.object({
  ratingScore: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  reviewText: z
    .string()
    .max(500, "Review text must not exceed 500 characters")
    .optional(),
  appointmentId: z.number(),
});

export type RatingFormData = z.infer<typeof ratingSchema>;
