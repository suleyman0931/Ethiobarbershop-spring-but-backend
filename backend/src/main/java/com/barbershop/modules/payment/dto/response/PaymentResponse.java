package com.barbershop.modules.payment.dto.response;

import com.barbershop.modules.payment.model.enums.PaymentMethod;
import com.barbershop.modules.payment.model.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.Instant;

public class PaymentResponse {
    private Long id;
    private Long appointmentId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private String transactionId;
    private String screenshotUrl;
    private PaymentStatus status;
    private Instant createdAt;
    private Instant verifiedAt;
    private Long verifiedByOwnerId;
    
    public PaymentResponse() {
    }
    
    public PaymentResponse(Long id, Long appointmentId, BigDecimal amount, PaymentMethod paymentMethod,
                          String transactionId, String screenshotUrl, PaymentStatus status,
                          Instant createdAt, Instant verifiedAt, Long verifiedByOwnerId) {
        this.id = id;
        this.appointmentId = appointmentId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.transactionId = transactionId;
        this.screenshotUrl = screenshotUrl;
        this.status = status;
        this.createdAt = createdAt;
        this.verifiedAt = verifiedAt;
        this.verifiedByOwnerId = verifiedByOwnerId;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getAppointmentId() {
        return appointmentId;
    }
    
    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public String getTransactionId() {
        return transactionId;
    }
    
    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }
    
    public String getScreenshotUrl() {
        return screenshotUrl;
    }
    
    public void setScreenshotUrl(String screenshotUrl) {
        this.screenshotUrl = screenshotUrl;
    }
    
    public PaymentStatus getStatus() {
        return status;
    }
    
    public void setStatus(PaymentStatus status) {
        this.status = status;
    }
    
    public Instant getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
    
    public Instant getVerifiedAt() {
        return verifiedAt;
    }
    
    public void setVerifiedAt(Instant verifiedAt) {
        this.verifiedAt = verifiedAt;
    }
    
    public Long getVerifiedByOwnerId() {
        return verifiedByOwnerId;
    }
    
    public void setVerifiedByOwnerId(Long verifiedByOwnerId) {
        this.verifiedByOwnerId = verifiedByOwnerId;
    }
}
