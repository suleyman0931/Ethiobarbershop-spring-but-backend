package com.barbershop.modules.payment.repository;

import com.barbershop.modules.appointment.model.entity.Appointment;
import com.barbershop.modules.payment.model.entity.Payment;
import com.barbershop.modules.payment.model.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByAppointment(Appointment appointment);
    List<Payment> findByStatus(PaymentStatus status);
    List<Payment> findByStatusOrderByCreatedAtDesc(PaymentStatus status);
}
