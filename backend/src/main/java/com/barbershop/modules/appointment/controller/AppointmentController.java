package com.barbershop.modules.appointment.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.barbershop.modules.appointment.dto.request.AppointmentRequest;
import com.barbershop.modules.appointment.dto.response.AppointmentResponse;
import com.barbershop.modules.appointment.service.AppointmentService;
import com.barbershop.modules.auth.serviceImpl.UserDetailsImpl;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

  private final AppointmentService appointmentService;

  public AppointmentController(AppointmentService appointmentService) {
    this.appointmentService = appointmentService;
  }

  /**
   * 1. Customer books a new appointment (PENDING).
   */
  @PostMapping("/book")
  @PreAuthorize("hasRole('CUSTOMER')")
  public AppointmentResponse createAppointment(
      @AuthenticationPrincipal UserDetailsImpl userDetails,
      @RequestBody AppointmentRequest request) {
    return appointmentService.createAppointment(userDetails.getId(), request);
  }

  /**
   * 2. Barber confirms the appointment (transition from PENDING -> CONFIRMED).
   */
  @PostMapping("/{appointmentId}/confirm")
  @PreAuthorize("hasRole('BARBER')")
  public AppointmentResponse confirmAppointment(
      @PathVariable Long appointmentId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return appointmentService.confirmAppointment(appointmentId, userDetails.getId());
  }

  /**
   * 3. Barber or Customer can cancel the appointment (transition -> CANCELED).
   */
  @PostMapping("/{appointmentId}/cancel")
  @PreAuthorize("hasRole('BARBER') or hasRole('CUSTOMER')")
  public AppointmentResponse cancelAppointment(
      @PathVariable Long appointmentId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return appointmentService.cancelAppointment(appointmentId, userDetails.getId());
  }

  /**
   * 4. Barber marks appointment as COMPLETED.
   */
  @PostMapping("/{appointmentId}/complete")
  @PreAuthorize("hasRole('BARBER')")
  public AppointmentResponse completeAppointment(
      @PathVariable Long appointmentId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return appointmentService.completeAppointment(appointmentId, userDetails.getId());
  }

  /**
   * Retrieve a single appointment. Only barber/customer can see it.
   */
  @GetMapping("/{appointmentId}")
  public AppointmentResponse getAppointment(
      @PathVariable Long appointmentId,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return appointmentService.getAppointment(appointmentId, userDetails.getId());
  }

  /**
   * Retrieve all appointments for the current user (barber or customer).
   */
  @GetMapping("/my")
  public List<AppointmentResponse> getMyAppointments(
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return appointmentService.getAppointmentsForUser(userDetails.getId());
  }

  /**
   * Retrieve all appointments for a specific shop/branch (owner only).
   */
  @GetMapping("/shop/{shopId}")
  @PreAuthorize("hasRole('OWNER')")
  public List<AppointmentResponse> getAppointmentsByShop(
      @PathVariable Long shopId) {
    return appointmentService.getAppointmentsByShop(shopId);
  }

  /**
   * Barber approves a pending appointment (transition from PENDING -> CONFIRMED).
   */
  @PutMapping("/{id}/approve")
  @PreAuthorize("hasRole('BARBER')")
  public AppointmentResponse approveAppointment(
      @PathVariable Long id,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return appointmentService.approveAppointment(id, userDetails.getId());
  }

  /**
   * Barber completes a confirmed appointment (transition from CONFIRMED -> COMPLETED).
   */
  @PutMapping("/{id}/complete")
  @PreAuthorize("hasRole('BARBER')")
  public AppointmentResponse completeAppointmentPut(
      @PathVariable Long id,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return appointmentService.completeAppointment(id, userDetails.getId());
  }

  /**
   * Barber cancels an appointment (transition from PENDING/CONFIRMED -> CANCELED).
   */
  @PutMapping("/{id}/cancel")
  @PreAuthorize("hasRole('BARBER')")
  public AppointmentResponse cancelAppointmentPut(
      @PathVariable Long id,
      @AuthenticationPrincipal UserDetailsImpl userDetails) {
    return appointmentService.cancelAppointment(id, userDetails.getId());
  }
}
