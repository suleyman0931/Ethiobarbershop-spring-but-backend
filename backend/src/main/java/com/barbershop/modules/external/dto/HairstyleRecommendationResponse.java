package com.barbershop.modules.external.dto;

import java.util.List;

public class HairstyleRecommendationResponse {
    private boolean success;
    private String message;
    private List<HairstyleRecommendation> recommendations;

    public HairstyleRecommendationResponse() {
    }

    public HairstyleRecommendationResponse(boolean success, String message, List<HairstyleRecommendation> recommendations) {
        this.success = success;
        this.message = message;
        this.recommendations = recommendations;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<HairstyleRecommendation> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<HairstyleRecommendation> recommendations) {
        this.recommendations = recommendations;
    }

    public static class HairstyleRecommendation {
        private String styleName;
        private String imageUrl;
        private Double matchScore;
        private String description;

        public HairstyleRecommendation() {
        }

        public HairstyleRecommendation(String styleName, String imageUrl, Double matchScore, String description) {
            this.styleName = styleName;
            this.imageUrl = imageUrl;
            this.matchScore = matchScore;
            this.description = description;
        }

        public String getStyleName() {
            return styleName;
        }

        public void setStyleName(String styleName) {
            this.styleName = styleName;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public Double getMatchScore() {
            return matchScore;
        }

        public void setMatchScore(Double matchScore) {
            this.matchScore = matchScore;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }
}
