package com.barbershop.modules.external.controller;

import com.barbershop.modules.external.dto.HairstyleRecommendationResponse;
import com.barbershop.modules.external.service.HairstyleRecommendationService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/external")
public class HairstyleRecommendationController {

    private final HairstyleRecommendationService hairstyleService;

    public HairstyleRecommendationController(HairstyleRecommendationService hairstyleService) {
        this.hairstyleService = hairstyleService;
    }

    /**
     * POST /api/external/hairstyle-recommendations
     * Params: image (file), hair_type (int, optional — default 101)
     *
     * hair_type values:
     *   101 = Bangs, 201 = Long Hair, 301 = Bangs+Long,
     *   401 = Medium, 502 = Light Curling, 603 = Short Hair,
     *   801 = Blonde, 901 = Straight Hair
     */
    @PostMapping(value = "/hairstyle-recommendations", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<HairstyleRecommendationResponse> getHairstyleRecommendations(
            @RequestParam("image") MultipartFile image,
            @RequestParam(value = "hair_type", defaultValue = "101") int hairType) {

        HairstyleRecommendationResponse response = hairstyleService.getHairstyleRecommendations(image, hairType);

        return response.isSuccess()
            ? ResponseEntity.ok(response)
            : ResponseEntity.badRequest().body(response);
    }
}
