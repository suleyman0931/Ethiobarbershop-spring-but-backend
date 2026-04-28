export interface HairstyleRecommendation {
  styleName: string;
  imageUrl: string;
  matchScore: number;
  description: string;
}

export interface HairstyleRecommendationResponse {
  success: boolean;
  message: string;
  recommendations: HairstyleRecommendation[] | null;
}
