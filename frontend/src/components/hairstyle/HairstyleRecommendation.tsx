"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/modules/shadcn/ui/card";
import { Button } from "@/modules/shadcn/ui/button";
import { Alert, AlertDescription } from "@/modules/shadcn/ui/alert";
import { Scissors, CheckCircle2, TrendingUp } from "lucide-react";

// Popular hairstyles with Unsplash images (no API key needed)
const POPULAR_HAIRSTYLES = [
  {
    id: 1,
    styleName: "Classic Fade",
    description: "Timeless and professional look with gradual fade on sides",
    imageUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&h=400&fit=crop",
    category: "Short",
    popularity: 95
  },
  {
    id: 2,
    styleName: "Textured Crop",
    description: "Modern short cut with textured top and clean sides",
    imageUrl: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=400&fit=crop",
    category: "Short",
    popularity: 92
  },
  {
    id: 3,
    styleName: "Pompadour",
    description: "Classic style with volume on top swept back",
    imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=400&fit=crop",
    category: "Medium",
    popularity: 88
  },
  {
    id: 4,
    styleName: "Buzz Cut",
    description: "Low maintenance, clean and sharp all around",
    imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop",
    category: "Short",
    popularity: 85
  },
  {
    id: 5,
    styleName: "Side Part",
    description: "Professional classic with defined side parting",
    imageUrl: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=400&h=400&fit=crop",
    category: "Medium",
    popularity: 90
  },
  {
    id: 6,
    styleName: "Quiff",
    description: "Stylish volume with height and texture on top",
    imageUrl: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=400&fit=crop",
    category: "Medium",
    popularity: 87
  },
  {
    id: 7,
    styleName: "Crew Cut",
    description: "Short, neat and easy to maintain military style",
    imageUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&h=400&fit=crop",
    category: "Short",
    popularity: 83
  },
  {
    id: 8,
    styleName: "Slick Back",
    description: "Smooth and polished look combed back",
    imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=400&fit=crop",
    category: "Medium",
    popularity: 86
  },
  {
    id: 9,
    styleName: "Undercut",
    description: "Dramatic contrast with long top and shaved sides",
    imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop",
    category: "Medium",
    popularity: 91
  }
];

const CATEGORIES = ["All", "Short", "Medium"];

export const HairstyleRecommendation = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredStyles = selectedCategory === "All" 
    ? POPULAR_HAIRSTYLES 
    : POPULAR_HAIRSTYLES.filter(style => style.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Popular Hairstyles
          </CardTitle>
          <CardDescription>
            Browse trending hairstyles and show your favorite to your barber at your next appointment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hairstyles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStyles.map((style) => (
          <Card key={style.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="aspect-square overflow-hidden bg-muted">
              <img
                src={style.imageUrl}
                alt={style.styleName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop";
                }}
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Scissors className="h-4 w-4 text-primary" />
                {style.styleName}
              </CardTitle>
              <CardDescription className="text-xs">{style.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-1">
                <div className="flex-1 bg-muted rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full"
                    style={{ width: `${style.popularity}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground ml-2">
                  {style.popularity}% popular
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
  );
};
