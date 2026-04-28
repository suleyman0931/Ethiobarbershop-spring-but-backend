import React from "react";
import { useBarberRatings } from "@/hooks/useRatings";
import { Star } from "lucide-react";

interface RatingDisplayProps {
  barberId: number;
}

/**
 * RatingDisplay Component
 * 
 * Displays ratings for a specific barber including average rating and individual reviews.
 * Implements Requirements 6.1, 6.2, 6.3, 7.1, 7.2, 7.3, 7.4 from appointment-management-rating spec.
 * 
 * Features:
 * - Displays average rating with star visualization
 * - Shows total number of ratings
 * - Lists individual ratings with star rating, review text, customer name, and timestamp
 * - Formats timestamp as relative time (e.g., "2 days ago")
 * - Shows loading skeleton during data fetch
 * - Displays empty state when no ratings exist
 */
export const RatingDisplay: React.FC<RatingDisplayProps> = ({ barberId }) => {
  const { data: ratingSummary, isLoading, error } = useBarberRatings(barberId);

  // Format timestamp as relative time
  const formatRelativeTime = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
  };

  // Render star rating visualization
  const renderStars = (rating: number, size: "sm" | "lg" = "sm") => {
    const starSize = size === "lg" ? "w-6 h-6" : "w-4 h-4";
    
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-slate-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
        <div className="space-y-3">
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
          <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
              <div className="h-16 w-full bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <p className="text-red-600">
          {error instanceof Error ? error.message : "Failed to load ratings."}
        </p>
      </div>
    );
  }

  // Empty state - no ratings
  if (!ratingSummary || ratingSummary.totalRatings === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="text-center py-8">
          <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 text-lg">No ratings yet</p>
          <p className="text-slate-500 text-sm mt-1">
            Be the first to rate this barber!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
      {/* Average Rating Section */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl font-bold text-slate-900">
            {ratingSummary.averageRating.toFixed(1)}
          </span>
          {renderStars(Math.round(ratingSummary.averageRating), "lg")}
        </div>
        <p className="text-sm text-slate-600">
          Based on {ratingSummary.totalRatings} {ratingSummary.totalRatings === 1 ? "rating" : "ratings"}
        </p>
      </div>

      {/* Individual Ratings List */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-slate-900">Customer Reviews</h4>
        <div className="space-y-4">
          {ratingSummary.ratings.map((rating) => (
            <div
              key={rating.id}
              className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
            >
              {/* Rating Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {renderStars(rating.ratingScore)}
                    <span className="text-sm font-medium text-slate-900">
                      {rating.customerName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {formatRelativeTime(rating.createdAt)}
                  </p>
                </div>
              </div>

              {/* Review Text */}
              {rating.reviewText && (
                <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                  {rating.reviewText}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
