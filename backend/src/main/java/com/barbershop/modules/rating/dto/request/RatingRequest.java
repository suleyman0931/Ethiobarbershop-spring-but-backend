package com.barbershop.modules.rating.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RatingRequest {

  @NotNull
  @Min(1)
  @Max(5)
  private Integer ratingScore;

  @Size(max = 500)
  private String reviewText;

  @NotNull
  private Long appointmentId;

  public RatingRequest() {
  }

  public RatingRequest(Integer ratingScore, String reviewText, Long appointmentId) {
    this.ratingScore = ratingScore;
    this.reviewText = reviewText;
    this.appointmentId = appointmentId;
  }

  public Integer getRatingScore() {
    return ratingScore;
  }

  public void setRatingScore(Integer ratingScore) {
    this.ratingScore = ratingScore;
  }

  public String getReviewText() {
    return reviewText;
  }

  public void setReviewText(String reviewText) {
    this.reviewText = reviewText;
  }

  public Long getAppointmentId() {
    return appointmentId;
  }

  public void setAppointmentId(Long appointmentId) {
    this.appointmentId = appointmentId;
  }

}
