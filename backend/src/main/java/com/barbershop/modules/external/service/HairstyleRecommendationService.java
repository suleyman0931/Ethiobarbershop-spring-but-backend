package com.barbershop.modules.external.service;

import com.barbershop.modules.external.dto.HairstyleRecommendationResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Hairstyle Recommendation Service
 *
 * Returns curated hairstyle recommendations with descriptions.
 * The AI try-on feature requires a paid API key (AILabTools, Replicate, etc.).
 * This implementation provides a reliable gallery-based recommendation
 * that works without any external API dependency.
 *
 * To enable real AI try-on:
 *   1. Sign up at https://replicate.com (free credits on signup)
 *   2. Set REPLICATE_API_TOKEN in application.properties
 *   3. Use model: yuval-alaluf/sam or AIRI-Institute/HairFastGAN
 */
@Service
public class HairstyleRecommendationService {

    // Curated hairstyle recommendations with Unsplash free images
    private static final List<HairstyleRecommendationResponse.HairstyleRecommendation> RECOMMENDATIONS = List.of(
        new HairstyleRecommendationResponse.HairstyleRecommendation(
            "Classic Fade",
            "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop&crop=face",
            0.95,
            "Clean fade on the sides with length on top. Timeless and professional."
        ),
        new HairstyleRecommendationResponse.HairstyleRecommendation(
            "Crew Cut",
            "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=400&fit=crop&crop=face",
            0.92,
            "Short, neat, and low-maintenance. Great for all face shapes."
        ),
        new HairstyleRecommendationResponse.HairstyleRecommendation(
            "Textured Quiff",
            "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=400&fit=crop&crop=face",
            0.88,
            "Voluminous top with textured styling. Modern and stylish."
        ),
        new HairstyleRecommendationResponse.HairstyleRecommendation(
            "Undercut",
            "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&h=400&fit=crop&crop=face",
            0.85,
            "Shaved sides with longer hair on top. Bold and contemporary."
        ),
        new HairstyleRecommendationResponse.HairstyleRecommendation(
            "Buzz Cut",
            "https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=400&h=400&fit=crop&crop=face",
            0.82,
            "Uniform short length all over. Clean, sharp, and easy to maintain."
        ),
        new HairstyleRecommendationResponse.HairstyleRecommendation(
            "Pompadour",
            "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face",
            0.80,
            "Swept-back volume on top. Classic barbershop style with a modern twist."
        )
    );

    public HairstyleRecommendationResponse getHairstyleRecommendations(MultipartFile imageFile, int hairType) {
        if (imageFile == null || imageFile.isEmpty()) {
            return new HairstyleRecommendationResponse(false, "Image file is required", null);
        }

        // Return curated recommendations
        // In production: integrate Replicate or another AI API here
        return new HairstyleRecommendationResponse(
            true,
            "Here are popular hairstyle recommendations for you",
            RECOMMENDATIONS
        );
    }
}
