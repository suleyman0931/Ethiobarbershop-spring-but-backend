package com.barbershop.modules.rating.dto.response;

import java.time.Instant;

public class RatingResponse {

  private Long id;
  private Integer ratingScore;
  private String reviewText;
  private Instant createdAt;
  private Long customerId;
  private String customerName;
  private Long barberId;
  private Long appointmentId;

  public RatingResponse() {
  }

  public RatingResponse(Long id, Integer ratingScore, String reviewText, Instant createdAt,
      Long customerId, String customerName, Long barberId, Long appointmentId) {
    this.id = id;
    this.ratingScore = ratingScore;
    this.reviewText = reviewText;
    this.createdAt = createdAt;
    this.customerId = customerId;
    this.customerName = customerName;
    this.barberId = barberId;
    this.appointmentId = appointmentId;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
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

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public Long getCustomerId() {
    return customerId;
  }

  public void setCustomerId(Long customerId) {
    this.customerId = customerId;
  }

  public String getCustomerName() {
    return customerName;
  }

  public void setCustomerName(String customerName) {
    this.customerName = customerName;
  }

  public Long getBarberId() {
    return barberId;
  }

  public void setBarberId(Long barberId) {
    this.barberId = barberId;
  }

  public Long getAppointmentId() {
    return appointmentId;
  }

  public void setAppointmentId(Long appointmentId) {
    this.appointmentId = appointmentId;
  }

}
