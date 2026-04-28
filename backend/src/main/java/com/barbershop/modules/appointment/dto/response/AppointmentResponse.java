package com.barbershop.modules.appointment.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.barbershop.modules.appointment.model.enums.AppointmentStatus;

public class AppointmentResponse {
  private Long id;
  private Long customerProfileId;
  private String customerName;
  private Long barberProfileId;
  private String barberName;
  private Long shopId; // if applicable
  private String shopName;
  private Long serviceId;
  private String serviceName;
  private BigDecimal servicePrice;
  private Integer serviceDuration;
  private LocalDateTime appointmentTime;
  private AppointmentStatus status;

  public AppointmentResponse() {
  }

  public AppointmentResponse(Long id, Long customerProfileId, String customerName,
      Long barberProfileId, String barberName, Long shopId, String shopName,
      Long serviceId, String serviceName, BigDecimal servicePrice, Integer serviceDuration,
      LocalDateTime appointmentTime, AppointmentStatus status) {
    this.id = id;
    this.customerProfileId = customerProfileId;
    this.customerName = customerName;
    this.barberProfileId = barberProfileId;
    this.barberName = barberName;
    this.shopId = shopId;
    this.shopName = shopName;
    this.serviceId = serviceId;
    this.serviceName = serviceName;
    this.servicePrice = servicePrice;
    this.serviceDuration = serviceDuration;
    this.appointmentTime = appointmentTime;
    this.status = status;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getCustomerProfileId() {
    return customerProfileId;
  }

  public void setCustomerProfileId(Long customerProfileId) {
    this.customerProfileId = customerProfileId;
  }

  public String getCustomerName() {
    return customerName;
  }

  public void setCustomerName(String customerName) {
    this.customerName = customerName;
  }

  public Long getBarberProfileId() {
    return barberProfileId;
  }

  public void setBarberProfileId(Long barberProfileId) {
    this.barberProfileId = barberProfileId;
  }

  public String getBarberName() {
    return barberName;
  }

  public void setBarberName(String barberName) {
    this.barberName = barberName;
  }

  public Long getShopId() {
    return shopId;
  }

  public void setShopId(Long shopId) {
    this.shopId = shopId;
  }

  public String getShopName() {
    return shopName;
  }

  public void setShopName(String shopName) {
    this.shopName = shopName;
  }

  public Long getServiceId() {
    return serviceId;
  }

  public void setServiceId(Long serviceId) {
    this.serviceId = serviceId;
  }

  public String getServiceName() {
    return serviceName;
  }

  public void setServiceName(String serviceName) {
    this.serviceName = serviceName;
  }

  public BigDecimal getServicePrice() {
    return servicePrice;
  }

  public void setServicePrice(BigDecimal servicePrice) {
    this.servicePrice = servicePrice;
  }

  public Integer getServiceDuration() {
    return serviceDuration;
  }

  public void setServiceDuration(Integer serviceDuration) {
    this.serviceDuration = serviceDuration;
  }

  public LocalDateTime getAppointmentTime() {
    return appointmentTime;
  }

  public void setAppointmentTime(LocalDateTime appointmentTime) {
    this.appointmentTime = appointmentTime;
  }

  public AppointmentStatus getStatus() {
    return status;
  }

  public void setStatus(AppointmentStatus status) {
    this.status = status;
  }

}
