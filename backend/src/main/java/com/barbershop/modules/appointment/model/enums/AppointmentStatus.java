package com.barbershop.modules.appointment.model.enums;

public enum AppointmentStatus {
  PENDING_PAYMENT,   // Customer created, awaiting payment
  PAYMENT_SUBMITTED, // Payment submitted, awaiting owner verification
  CONFIRMED,         // Payment verified by owner, appointment confirmed
  ASSIGNED_TO_BARBER, // Appointment sent to barber
  COMPLETED,         // Service done
  CANCELED,          // Either barber or customer canceled
  PAYMENT_REJECTED   // Owner rejected the payment
}
