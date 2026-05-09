package com.barbershop.modules.payment.serviceImpl;

import com.barbershop.modules.appointment.model.entity.Appointment;
import com.barbershop.modules.appointment.model.enums.AppointmentStatus;
import com.barbershop.modules.appointment.repository.AppointmentRepository;
import com.barbershop.modules.payment.dto.request.PaymentSubmissionRequest;
import com.barbershop.modules.payment.dto.response.PaymentResponse;
import com.barbershop.modules.payment.model.entity.Payment;
import com.barbershop.modules.payment.model.enums.PaymentStatus;
import com.barbershop.modules.payment.repository.PaymentRepository;
import com.barbershop.modules.payment.service.PaymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final AppointmentRepository appointmentRepository;
    
    public PaymentServiceImpl(PaymentRepository paymentRepository, 
                             AppointmentRepository appointmentRepository) {
        this.paymentRepository = paymentRepository;
        this.appointmentRepository = appointmentRepository;
    }
    
    @Override
    @Transactional
    public PaymentResponse submitPayment(Long customerUserId, PaymentSubmissionRequest request) {
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        // Verify the appointment belongs to the customer
        if (!appointment.getCustomerProfile().getUser().getId().equals(customerUserId)) {
            throw new RuntimeException("You are not authorized to submit payment for this appointment");
        }
        
        // Verify appointment is in PENDING_PAYMENT status
        if (appointment.getStatus() != AppointmentStatus.PENDING_PAYMENT) {
            throw new RuntimeException("Payment can only be submitted for appointments in PENDING_PAYMENT status");
        }
        
        // Validate: at least one of transaction ID or screenshot must be provided
        if ((request.getTransactionId() == null || request.getTransactionId().trim().isEmpty()) && 
            (request.getScreenshotUrl() == null || request.getScreenshotUrl().trim().isEmpty())) {
            throw new RuntimeException("Either transaction ID or screenshot URL must be provided");
        }
        
        // Create payment record
        Payment payment = new Payment(
                appointment,
                appointment.getService().getPrice(),
                request.getPaymentMethod(),
                request.getTransactionId(),
                request.getScreenshotUrl()
        );
        
        payment = paymentRepository.save(payment);
        
        // Update appointment status
        appointment.setStatus(AppointmentStatus.PAYMENT_SUBMITTED);
        appointmentRepository.save(appointment);
        
        return toResponse(payment);
    }
    
    @Override
    @Transactional
    public PaymentResponse verifyPayment(Long paymentId, Long ownerId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new RuntimeException("Only pending payments can be verified");
        }
        
        // Update payment status
        payment.setStatus(PaymentStatus.VERIFIED);
        payment.setVerifiedAt(Instant.now());
        payment.setVerifiedByOwnerId(ownerId);
        payment = paymentRepository.save(payment);
        
        // Update appointment status
        Appointment appointment = payment.getAppointment();
        appointment.setStatus(AppointmentStatus.CONFIRMED);
        appointmentRepository.save(appointment);
        
        return toResponse(payment);
    }
    
    @Override
    @Transactional
    public PaymentResponse rejectPayment(Long paymentId, Long ownerId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new RuntimeException("Only pending payments can be rejected");
        }
        
        // Update payment status
        payment.setStatus(PaymentStatus.REJECTED);
        payment.setVerifiedAt(Instant.now());
        payment.setVerifiedByOwnerId(ownerId);
        payment = paymentRepository.save(payment);
        
        // Update appointment status
        Appointment appointment = payment.getAppointment();
        appointment.setStatus(AppointmentStatus.PAYMENT_REJECTED);
        appointmentRepository.save(appointment);
        
        return toResponse(payment);
    }
    
    @Override
    public List<PaymentResponse> getPendingPayments() {
        List<Payment> payments = paymentRepository.findByStatusOrderByCreatedAtDesc(PaymentStatus.PENDING);
        return payments.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    private PaymentResponse toResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getAppointment().getId(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getTransactionId(),
                payment.getScreenshotUrl(),
                payment.getStatus(),
                payment.getCreatedAt(),
                payment.getVerifiedAt(),
                payment.getVerifiedByOwnerId()
        );
    }
}
