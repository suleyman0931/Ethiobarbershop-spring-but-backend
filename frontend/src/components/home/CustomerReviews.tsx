"use client";

import { useQuery } from "@tanstack/react-query";
import { Star, Quote, User } from "lucide-react";
import { apiClient } from "@/lib/api";
import type { BarberResponse } from "@/modules/barber/types/barber.types";
import type { BarberRatingSummary, RatingResponse } from "@/types/rating";

export function CustomerReviews() {
  // Fetch all barbers
  const { data: barbers = [], isLoading: barbersLoading } = useQuery({
    queryKey: ["barbers"],
    queryFn: () => apiClient.get<BarberResponse[]>("/barbers"),
  });

  // Fetch all ratings
  const { data: allReviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["all-reviews"],
    queryFn: async () => {
      if (barbers.length === 0) return [];

      const reviewsPromises = barbers.map(async (barber) => {
        try {
          const summary = await apiClient.get<BarberRatingSummary>(
            `/ratings/barber/${barber.barberId}`
          );
          return summary.ratings.map((rating) => ({
            ...rating,
            barberName: `${barber.firstName} ${barber.lastName}`,
          }));
        } catch (error) {
          return [];
        }
      });

      const results = await Promise.all(reviewsPromises);
      return results.flat();
    },
    enabled: barbers.length > 0,
  });

  // Filter reviews with text and sort by rating, then by date
  const topReviews = allReviews
    .filter((review) => review.reviewText && review.reviewText.trim().length > 0)
    .sort((a, b) => {
      // First sort by rating (highest first)
      if (b.ratingScore !== a.ratingScore) {
        return b.ratingScore - a.ratingScore;
      }
      // Then by date (most recent first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 6); // Show top 6 reviews

  const isLoading = barbersLoading || reviewsLoading;

  if (isLoading) {
    return (
      <section>
        <h2 className="text-3xl font-black text-slate-900 mb-4 text-center">
          💬 What Our Customers Say
        </h2>
        <p className="text-slate-600 text-center mb-12">
          Real reviews from real customers
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse"
            >
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="w-5 h-5 bg-slate-200 rounded" />
                ))}
              </div>
              <div className="h-4 bg-slate-200 rounded w-full mb-2" />
              <div className="h-4 bg-slate-100 rounded w-3/4 mb-4" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (topReviews.length === 0) {
    return null; // Don't show section if no reviews yet
  }

  return (
    <section>
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold mb-4">
          <Quote className="w-4 h-4" />
          Customer Testimonials
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">
          💬 What Our Customers Say
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Don't just take our word for it — hear from our satisfied customers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-lg transition-all relative"
          >
            {/* Quote Icon */}
            <div className="absolute top-4 right-4 text-blue-100">
              <Quote className="w-12 h-12" />
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-1 mb-4 relative z-10">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < review.ratingScore
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-slate-300"
                  }`}
                />
              ))}
            </div>

            {/* Review Text */}
            <p className="text-slate-700 mb-6 leading-relaxed line-clamp-4 relative z-10">
              "{review.reviewText}"
            </p>

            {/* Customer Info */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">
                  Verified Customer
                </p>
                <p className="text-xs text-slate-500">
                  Barber: {review.barberName}
                </p>
              </div>
            </div>

            {/* Date */}
            <p className="text-xs text-slate-400 mt-3">
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>

      {/* Show More Link */}
      {allReviews.length > 6 && (
        <div className="text-center mt-8">
          <p className="text-slate-600">
            <span className="font-bold text-slate-900">
              {allReviews.length - 6}+
            </span>{" "}
            more reviews from happy customers
          </p>
        </div>
      )}
    </section>
  );
}
