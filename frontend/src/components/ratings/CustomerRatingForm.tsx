import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/modules/shadcn/ui/button";
import { Alert, AlertDescription } from "@/modules/shadcn/ui/alert";
import { useCreateRating } from "@/hooks/useRatings";
import { ratingSchema, type RatingFormData } from "@/schemas/ratingSchema";
import { Star, AlertCircle } from "lucide-react";

interface CustomerRatingFormProps {
  appointmentId: number;
  barberId: number;
  onSuccess?: () => void;
}

/**
 * CustomerRatingForm Component
 * 
 * Allows customers to rate barbers after completed appointments.
 * Implements Requirements 4.1, 4.2, 8.1 from appointment-management-rating spec.
 * 
 * Features:
 * - Star rating input (1-5 stars) with hover and click interactions
 * - Review textarea with character counter (max 500 characters)
 * - Form validation using react-hook-form with Zod resolver
 * - Loading state on submit button during mutation
 * - Inline validation error display
 * - API error display using Alert component
 * - Success message on successful submission
 * - Calls onSuccess callback after successful submission
 */
export const CustomerRatingForm: React.FC<CustomerRatingFormProps> = ({
  appointmentId,
  barberId,
  onSuccess,
}) => {
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  
  const createRatingMutation = useCreateRating();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<RatingFormData>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      appointmentId,
      ratingScore: 0,
      reviewText: "",
    },
  });

  const ratingScore = watch("ratingScore");
  const reviewText = watch("reviewText") || "";

  const handleStarClick = (star: number) => {
    setValue("ratingScore", star, { shouldValidate: true });
  };

  const onSubmit = (data: RatingFormData) => {
    createRatingMutation.mutate(data, {
      onSuccess: () => {
        reset();
        setValue("ratingScore", 0);
        onSuccess?.();
      },
    });
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Rate Your Experience</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Star Rating Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoveredStar || ratingScore)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-slate-300"
                  }`}
                />
              </button>
            ))}
          </div>
          {errors.ratingScore && (
            <p className="text-sm text-red-600">{errors.ratingScore.message}</p>
          )}
        </div>

        {/* Review Textarea */}
        <div className="space-y-2">
          <label htmlFor="reviewText" className="block text-sm font-medium text-slate-700">
            Review (Optional)
          </label>
          <textarea
            id="reviewText"
            {...register("reviewText")}
            rows={4}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            placeholder="Share your experience with this barber..."
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            <div>
              {errors.reviewText && (
                <p className="text-sm text-red-600">{errors.reviewText.message}</p>
              )}
            </div>
            <p className="text-sm text-slate-500">
              {reviewText.length}/500 characters
            </p>
          </div>
        </div>

        {/* API Error Display */}
        {createRatingMutation.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {createRatingMutation.error instanceof Error
                ? createRatingMutation.error.message
                : "An error occurred while submitting your rating."}
            </AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={createRatingMutation.isPending}
          className="w-full"
        >
          {createRatingMutation.isPending ? "Submitting..." : "Submit Rating"}
        </Button>
      </form>
    </div>
  );
};
