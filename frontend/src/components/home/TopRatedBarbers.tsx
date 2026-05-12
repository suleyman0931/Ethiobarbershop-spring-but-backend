"use client";

import { useQuery } from "@tanstack/react-query";
import { Star, Award, TrendingUp } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import type { BarberResponse } from "@/modules/barber/types/barber.types";
import type { BarberRatingSummary } from "@/types/rating";

export function TopRatedBarbers() {
  // Fetch all barbers
  const { data: barbers = [], isLoading: barbersLoading } = useQuery({
    queryKey: ["barbers"],
    queryFn: () => apiClient.get<BarberResponse[]>("/barbers"),
  });

  // Fetch ratings for all barbers
  const { data: ratingsData = [], isLoading: ratingsLoading } = useQuery({
    queryKey: ["all-barber-ratings"],
    queryFn: async () => {
      if (barbers.length === 0) return [];
      
      const ratingsPromises = barbers.map(async (barber) => {
        try {
          const summary = await apiClient.get<BarberRatingSummary>(
            `/ratings/barber/${barber.barberId}`
          );
          return {
            ...barber,
            averageRating: summary.averageRating,
            totalRatings: summary.totalRatings,
          };
        } catch (error) {
          return {
            ...barber,
            averageRating: 0,
            totalRatings: 0,
          };
        }
      });

      return Promise.all(ratingsPromises);
    },
    enabled: barbers.length > 0,
  });

  // Sort by rating (highest first) and show all barbers
  const barbersWithRatings = ratingsData
    .sort((a, b) => {
      // Barbers with ratings first
      if (b.totalRatings !== a.totalRatings && (a.totalRatings === 0 || b.totalRatings === 0)) {
        return b.totalRatings - a.totalRatings;
      }
      // Then sort by average rating
      return b.averageRating - a.averageRating;
    });

  const isLoading = barbersLoading || ratingsLoading;

  if (isLoading) {
    return (
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-10 lg:p-16">
        <h2 className="text-3xl font-black text-slate-900 mb-4 text-center">
          ⭐ Our Barbers & Ratings
        </h2>
        <p className="text-slate-600 text-center mb-12">
          Meet our professional team
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 shadow-sm animate-pulse"
            >
              <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4" />
              <div className="h-5 bg-slate-200 rounded w-3/4 mx-auto mb-2" />
              <div className="h-4 bg-slate-100 rounded w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (barbersWithRatings.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-10 lg:p-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-bold mb-4">
          <TrendingUp className="w-4 h-4" />
          Our Professional Team
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">
          ⭐ Our Barbers & Ratings
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Meet our skilled professionals and see what customers say about their work
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {barbersWithRatings.map((barber, index) => {
          const isTopThree = barber.totalRatings > 0 && index < 3;
          
          return (
            <div
              key={barber.barberId}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
            >
              {/* Top 3 Badge */}
              {isTopThree && (
                <>
                  {index === 0 && (
                    <div className="absolute top-4 right-4 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shadow-lg">
                      🏆
                    </div>
                  )}
                  {index === 1 && (
                    <div className="absolute top-4 right-4 bg-gradient-to-br from-slate-300 to-slate-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-black shadow-md">
                      2
                    </div>
                  )}
                  {index === 2 && (
                    <div className="absolute top-4 right-4 bg-gradient-to-br from-orange-400 to-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-black shadow-md">
                      3
                    </div>
                  )}
                </>
              )}

              {/* Barber Avatar */}
              <div className={`w-24 h-24 ${
                isTopThree 
                  ? 'bg-gradient-to-br from-amber-500 to-orange-600' 
                  : 'bg-gradient-to-br from-slate-600 to-slate-700'
              } rounded-full flex items-center justify-center text-white font-black text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                {barber.firstName[0]}{barber.lastName[0]}
              </div>

              {/* Barber Info */}
              <h3 className="font-black text-slate-900 text-xl mb-2 text-center">
                {barber.firstName} {barber.lastName}
              </h3>

              {/* Rating */}
              {barber.totalRatings > 0 ? (
                <>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(barber.averageRating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-slate-900 text-lg">
                      {barber.averageRating.toFixed(1)}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-center gap-4 text-sm text-slate-600 mb-6">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>{barber.totalRatings} reviews</span>
                    </div>
                    {barber.experienceYears > 0 && (
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>{barber.experienceYears}y exp</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center mb-6">
                  <p className="text-sm text-slate-500 mb-4">No ratings yet</p>
                  {barber.experienceYears > 0 && (
                    <div className="flex items-center justify-center gap-1 text-sm text-slate-600">
                      <Award className="w-4 h-4" />
                      <span>{barber.experienceYears} years experience</span>
                    </div>
                  )}
                </div>
              )}

              {/* Skills */}
              {barber.skills && (
                <p className="text-sm text-slate-600 text-center mb-6 line-clamp-2">
                  {barber.skills}
                </p>
              )}

              {/* Book Button */}
              <Link
                href={`/appointments/book?barberId=${barber.barberId}`}
                className={`block text-center ${
                  isTopThree
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'
                    : 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800'
                } text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg`}
              >
                Book with {barber.firstName}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
