"use client";

import { HairstyleRecommendation } from "@/components/hairstyle/HairstyleRecommendation";
import { Sparkles } from "lucide-react";

export default function HairstyleRecommendationsPage() {
  return (
    <div className="container max-w-6xl mx-auto py-8">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Popular Hairstyles</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse trending hairstyles and find your perfect look. Save your favorites and show them to your barber at your next appointment.
          </p>
        </div>

        {/* Main Component */}
        <HairstyleRecommendation />

        {/* Info Section */}
        <div className="mt-12 bg-muted/50 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-3">How to use this gallery</h3>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-semibold text-primary">1.</span>
              <span>Browse through our curated collection of popular hairstyles</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-primary">2.</span>
              <span>Filter by category (Short, Medium) to find styles that match your preference</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-primary">3.</span>
              <span>Save or screenshot your favorite styles</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-primary">4.</span>
              <span>Show the images to your barber when you book your appointment</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
