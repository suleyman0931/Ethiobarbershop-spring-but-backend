"use client";

import { useState, useRef } from "react";
import { useHairstyleRecommendations } from "@/hooks/useHairstyle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/modules/shadcn/ui/card";
import { Button } from "@/modules/shadcn/ui/button";
import { Alert, AlertDescription } from "@/modules/shadcn/ui/alert";
import { Loader2, Upload, Sparkles, AlertCircle, CheckCircle2, Scissors } from "lucide-react";

export const HairstyleRecommendation = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const recommendationMutation = useHairstyleRecommendations();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Please select a valid image file"); return; }
    if (file.size > 5 * 1024 * 1024) { alert("Image size must be less than 5MB"); return; }
    setSelectedImage(file);
    recommendationMutation.reset();
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleGetRecommendations = () => {
    if (selectedImage) {
      recommendationMutation.mutate({ imageFile: selectedImage, hairType: 101 });
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    recommendationMutation.reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Hairstyle Recommendations
          </CardTitle>
          <CardDescription>
            Upload your photo and discover popular hairstyles to try at your next appointment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />

          {!previewUrl ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-1">Upload your photo</p>
              <p className="text-sm text-muted-foreground">JPG, PNG — max 5MB</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border max-h-64">
                <img src={previewUrl} alt="Your photo" className="w-full object-contain bg-muted" />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleGetRecommendations}
                  disabled={recommendationMutation.isPending}
                  className="flex-1"
                  size="lg"
                >
                  {recommendationMutation.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Getting recommendations...</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" />Get Recommendations</>
                  )}
                </Button>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Change Photo
                </Button>
              </div>
            </div>
          )}

          {recommendationMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {recommendationMutation.error instanceof Error
                  ? recommendationMutation.error.message
                  : "Failed to get recommendations. Please try again."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {recommendationMutation.isSuccess && recommendationMutation.data?.recommendations && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Popular Hairstyles</h2>
              <p className="text-sm text-muted-foreground">Show any of these to your barber at your next appointment</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <Upload className="mr-2 h-4 w-4" />
              New Photo
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendationMutation.data.recommendations.map((rec, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={rec.imageUrl}
                    alt={rec.styleName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop";
                    }}
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Scissors className="h-4 w-4 text-primary" />
                    {rec.styleName}
                  </CardTitle>
                  <CardDescription className="text-xs">{rec.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-1">
                    <div className="flex-1 bg-muted rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: `${Math.round(rec.matchScore * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      {Math.round(rec.matchScore * 100)}% popular
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              💡 Save or screenshot your favourite style and show it to your barber when you book!
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};
