package com.barbershop.modules.payment.service;

import com.barbershop.modules.payment.dto.request.PaymentSubmissionRequest;
import com.barbershop.modules.payment.dto.response.PaymentResponse;

import java.util.List;

public interface PaymentService {
    PaymentResponse submitPayment(Long customerUserId, PaymentSubmissionRequest request);
    PaymentResponse verifyPayment(Long paymentId, Long ownerId);
    PaymentResponse rejectPayment(Long paymentId, Long ownerId);
    List<PaymentResponse> getPendingPayments();
}
