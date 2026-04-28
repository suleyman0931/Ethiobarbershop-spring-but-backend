package com.barbershop.modules.payment.controller;

import com.barbershop.modules.auth.serviceImpl.UserDetailsImpl;
import com.barbershop.modules.payment.dto.request.PaymentSubmissionRequest;
import com.barbershop.modules.payment.dto.response.PaymentResponse;
import com.barbershop.modules.payment.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    
    private final PaymentService paymentService;
    
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
    
    @PostMapping("/submit")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<PaymentResponse> submitPayment(
            @RequestBody PaymentSubmissionRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Long userId = userDetails.getId();
        PaymentResponse response = paymentService.submitPayment(userId, request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/pending")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<PaymentResponse>> getPendingPayments() {
        List<PaymentResponse> payments = paymentService.getPendingPayments();
        return ResponseEntity.ok(payments);
    }
    
    @PutMapping("/{id}/verify")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<PaymentResponse> verifyPayment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Long ownerId = userDetails.getId();
        PaymentResponse response = paymentService.verifyPayment(id, ownerId);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<PaymentResponse> rejectPayment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Long ownerId = userDetails.getId();
        PaymentResponse response = paymentService.rejectPayment(id, ownerId);
        return ResponseEntity.ok(response);
    }
}
