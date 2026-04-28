package com.barbershop.modules.external.dto;

import org.springframework.web.multipart.MultipartFile;

public class HairstyleRecommendationRequest {
    private MultipartFile image;
    private String gender; // "male" only for this implementation

    public HairstyleRecommendationRequest() {
    }

    public HairstyleRecommendationRequest(MultipartFile image, String gender) {
        this.image = image;
        this.gender = gender;
    }

    public MultipartFile getImage() {
        return image;
    }

    public void setImage(MultipartFile image) {
        this.image = image;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }
}
