"use client";

import { useQuery } from "@tanstack/react-query";
import { Star, Award } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import type { BarberResponse } from "@/modules/barber/types/barber.types";
import type { BarberRatingSummary } from "@/types/rating";

interface BarberCardsWithRatingsProps {
  barbers: BarberResponse[];
  isCustomer?: boolean;
  isGuest?: boolean;
}

export function BarberCardsWithRatings({ barbers, isCustomer, isGuest }: BarberCardsWithRatingsProps) {
  // Fetch ratings for all barbers
  const { data: ratingsData = [] } = useQuery({
    queryKey: ["barbers-with-ratings", barbers.map(b => b.barberId)],
    queryFn: async () => {
      const ratingsPromises = barbers.map(async (barber) => {
        try {
          const summary = await apiClient.get<BarberRatingSummary>(
            `/ratings/barber/${barber.barberId}`
          );
          return {
            barberId: barber.barberId,
            averageRating: summary.averageRating,
            totalRatings: summary.totalRatings,
          };
        } catch (error) {
          return {
            barberId: barber.barberId,
            averageRating: 0,
            totalRatings: 0,
          };
        }
      });
      return Promise.all(ratingsPromises);
    },
    enabled: barbers.length > 0,
  });

  // Merge barbers with their ratings
  const barbersWithRatings = barbers.map((barber) => {
    const rating = ratingsData.find((r) => r.barberId === barber.barberId);
    return {
      ...barber,
      averageRating: rating?.averageRating || 0,
      totalRatings: rating?.totalRatings || 0,
    };
  });

  // Sort: barbers with ratings first (by rating), then others
  const sortedBarbers = barbersWithRatings.sort((a, b) => {
    if (b.totalRatings !== a.totalRatings && (a.totalRatings === 0 || b.totalRatings === 0)) {
      return b.totalRatings - a.totalRatings;
    }
    return b.averageRating - a.averageRating;
  });

  // Determine top 3 ranked barbers
  const rankedBarbers = sortedBarbers.filter(b => b.totalRatings > 0).slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {sortedBarbers.map((barber) => {
        const rank = rankedBarbers.findIndex(b => b.barberId === barber.barberId);
        const isRanked = rank !== -1;

        return (
          <div
            key={barber.barberId}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 hover:shadow-lg transition-all group relative"
          >
            {/* Rank Badge for Top 3 */}
            {isRanked && (
              <div className="absolute top-4 right-4">
                {rank === 0 && (
                  <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-black shadow-lg">
                    🏆
                  </div>
                )}
                {rank === 1 && (
                  <div className="bg-gradient-to-br from-slate-300 to-slate-400 text-white w-9 h-9 rounded-full flex items-center justify-center font-black shadow-md text-sm">
                    2
                  </div>
                )}
                {rank === 2 && (
                  <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white w-9 h-9 rounded-full flex items-center justify-center font-black shadow-md text-sm">
                    3
                  </div>
                )}
              </div>
            )}

            {/* Barber Avatar */}
            <div className={`w-20 h-20 ${
              isRanked 
                ? 'bg-gradient-to-br from-yellow-500 to-orange-600' 
                : 'bg-gradient-to-br from-slate-900 to-slate-700'
            } rounded-full flex items-center justify-center text-white font-bold text-2xl mb-6 group-hover:scale-110 transition-transform`}>
              {barber.firstName[0]}{barber.lastName[0]}
            </div>

            {/* Barber Name */}
            <h3 className="font-bold text-slate-900 text-lg mb-1">
              {barber.firstName} {barber.lastName}
            </h3>

            {/* Rating Stars */}
            {barber.totalRatings > 0 ? (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(barber.averageRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-700">
                  {barber.averageRating.toFixed(1)}
                </span>
                <span className="text-xs text-slate-500">
                  ({barber.totalRatings} {barber.totalRatings === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            ) : (
              <p className="text-xs text-slate-400 mb-3">No reviews yet</p>
            )}

            {/* Skills */}
            {barber.skills && (
              <p className="text-sm text-slate-600 mt-2 mb-3">{barber.skills}</p>
            )}

            {/* Experience */}
            {barber.experienceYears > 0 && (
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                <Award className="w-4 h-4" />
                <span>{barber.experienceYears} years experience</span>
              </div>
            )}

            {/* Book Button - Show for customers and guests */}
            {(isCustomer || isGuest) && (
              <Link
                href={isGuest ? "/signup" : `/appointments/book?barberId=${barber.barberId}`}
                className={`mt-4 block text-center ${
                  isRanked
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-bold py-3 rounded-xl transition-all shadow-sm hover:shadow-md`}
              >
                {isGuest ? 'Sign Up to Book' : `Book with ${barber.firstName}`}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
