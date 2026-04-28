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
            <h1 className="text-4xl font-bold">Hairstyle Recommendations</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover your perfect hairstyle with AI-powered recommendations. Upload your photo and let our advanced AI suggest the best hairstyles for you.
          </p>
        </div>

        {/* Main Component */}
        <HairstyleRecommendation />

        {/* Info Section */}
        <div className="mt-12 bg-muted/50 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-3">How it works</h3>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-semibold text-primary">1.</span>
              <span>Upload a clear photo of yourself (front-facing works best)</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-primary">2.</span>
              <span>Our AI analyzes your facial features and face shape</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-primary">3.</span>
              <span>Get personalized hairstyle recommendations with match scores</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-primary">4.</span>
              <span>Book an appointment with your favorite style!</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
