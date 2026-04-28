"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { MapPin, Wind, Droplets } from "lucide-react";

interface WeatherData {
  temperature: number;
  condition: string;
  message: string;
  icon: string;
  windSpeed: number;
  humidity: number;
  cityName: string;
}

export const WeatherWidget = () => {
  const { data, isLoading, isError } = useQuery<WeatherData>({
    queryKey: ["weather"],
    queryFn: () => apiClient.get<WeatherData>("/external/weather"),
    staleTime: 10 * 60 * 1000, // cache 10 minutes
    retry: 1,
  });

  if (isLoading) return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-4 animate-pulse">
      <div className="h-4 bg-white/20 rounded w-40 mb-2" />
      <div className="h-6 bg-white/20 rounded w-32" />
    </div>
  );

  if (isError || !data) return null;

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-4 shadow-lg">
      {/* City Name */}
      <div className="flex items-center gap-1.5 mb-2">
        <MapPin className="w-4 h-4 text-blue-300" />
        <span className="text-blue-200 text-sm font-medium">{data.cityName}</span>
      </div>
      
      {/* Temperature and Condition */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-4xl">{data.icon}</span>
        <div>
          <div className="text-white font-bold text-3xl leading-none mb-1">
            {Math.round(data.temperature)}°C
          </div>
          <div className="text-blue-200 text-sm font-medium">{data.condition}</div>
        </div>
      </div>

      {/* Wind and Humidity */}
      <div className="flex items-center gap-4 mb-2 text-blue-100">
        <div className="flex items-center gap-1.5">
          <Wind className="w-4 h-4" />
          <span className="text-sm">{Math.round(data.windSpeed)} km/h</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Droplets className="w-4 h-4" />
          <span className="text-sm">{data.humidity}%</span>
        </div>
      </div>

      {/* Message */}
      <p className="text-blue-100 text-xs leading-relaxed">{data.message}</p>
    </div>
  );
};
