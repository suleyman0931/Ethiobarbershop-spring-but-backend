package com.barbershop.modules.appointment.dto.request;

import java.time.LocalDateTime;

public class AppointmentRequest {
  private Long barberProfileId;
  private Long shopId; // optional if you want them to pick a specific shop
  private Long serviceId; // required - the service being booked
  private LocalDateTime desiredTime;

  public AppointmentRequest() {
  }

  public AppointmentRequest(Long barberProfileId, Long shopId, Long serviceId, LocalDateTime desiredTime) {
    this.barberProfileId = barberProfileId;
    this.shopId = shopId;
    this.serviceId = serviceId;
    this.desiredTime = desiredTime;
  }

  public Long getBarberProfileId() {
    return barberProfileId;
  }

  public void setBarberProfileId(Long barberProfileId) {
    this.barberProfileId = barberProfileId;
  }

  public Long getShopId() {
    return shopId;
  }

  public void setShopId(Long shopId) {
    this.shopId = shopId;
  }

  public Long getServiceId() {
    return serviceId;
  }

  public void setServiceId(Long serviceId) {
    this.serviceId = serviceId;
  }

  public LocalDateTime getDesiredTime() {
    return desiredTime;
  }

  public void setDesiredTime(LocalDateTime desiredTime) {
    this.desiredTime = desiredTime;
  }

}
