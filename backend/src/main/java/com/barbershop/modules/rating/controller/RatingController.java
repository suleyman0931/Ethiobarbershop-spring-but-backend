package com.barbershop.modules.rating.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.barbershop.modules.auth.serviceImpl.UserDetailsImpl;
import com.barbershop.modules.rating.dto.request.RatingRequest;
import com.barbershop.modules.rating.dto.response.BarberRatingSummary;
import com.barbershop.modules.rating.dto.response.RatingResponse;
import com.barbershop.modules.rating.service.RatingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

  private final RatingService ratingService;

  public RatingController(RatingService ratingService) {
    this.ratingService = ratingService;
  }

  /**
   * Customer creates a rating for a completed appointment.
   */
  @PostMapping
  @PreAuthorize("hasRole('CUSTOMER')")
  @ResponseStatus(HttpStatus.CREATED)
  public RatingResponse createRating(
      @AuthenticationPrincipal UserDetailsImpl userDetails,
      @RequestBody @Valid RatingRequest request) {
    return ratingService.createRating(userDetails.getId(), request);
  }

  /**
   * Get barber rating summary (public endpoint).
   */
  @GetMapping("/barber/{barberId}")
  public BarberRatingSummary getBarberRatings(@PathVariable Long barberId) {
    return ratingService.getBarberRatingSummary(barberId);
  }

  /**
   * Barber retrieves their own ratings.
   */
  @GetMapping("/my-ratings")
  @PreAuthorize("hasRole('BARBER')")
  public List<RatingResponse> getMyRatings(
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return ratingService.getMyRatings(userDetails.getId());
  }
}
