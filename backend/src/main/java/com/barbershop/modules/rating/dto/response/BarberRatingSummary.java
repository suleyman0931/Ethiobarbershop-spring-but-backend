package com.barbershop.modules.rating.dto.response;

import java.util.List;

public class BarberRatingSummary {

  private Long barberId;
  private Double averageRating;
  private Integer totalRatings;
  private List<RatingResponse> ratings;

  public BarberRatingSummary() {
  }

  public BarberRatingSummary(Long barberId, Double averageRating, Integer totalRatings,
      List<RatingResponse> ratings) {
    this.barberId = barberId;
    this.averageRating = averageRating;
    this.totalRatings = totalRatings;
    this.ratings = ratings;
  }

  public Long getBarberId() {
    return barberId;
  }

  public void setBarberId(Long barberId) {
    this.barberId = barberId;
  }

  public Double getAverageRating() {
    return averageRating;
  }

  public void setAverageRating(Double averageRating) {
    this.averageRating = averageRating;
  }

  public Integer getTotalRatings() {
    return totalRatings;
  }

  public void setTotalRatings(Integer totalRatings) {
    this.totalRatings = totalRatings;
  }

  public List<RatingResponse> getRatings() {
    return ratings;
  }

  public void setRatings(List<RatingResponse> ratings) {
    this.ratings = ratings;
  }

}
