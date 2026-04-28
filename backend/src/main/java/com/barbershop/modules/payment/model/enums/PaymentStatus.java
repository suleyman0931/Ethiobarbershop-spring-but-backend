package com.barbershop.modules.payment.model.enums;

public enum PaymentStatus {
    PENDING,    // Payment submitted, awaiting owner verification
    VERIFIED,   // Owner verified the payment
    REJECTED    // Owner rejected the payment
}
