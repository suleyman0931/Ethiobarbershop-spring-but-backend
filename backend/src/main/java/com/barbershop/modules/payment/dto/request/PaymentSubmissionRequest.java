package com.barbershop.modules.payment.dto.request;

import com.barbershop.modules.payment.model.enums.PaymentMethod;

public class PaymentSubmissionRequest {
    private Long appointmentId;
    private PaymentMethod paymentMethod;
    private String transactionId;
    private String screenshotUrl;
    
    public PaymentSubmissionRequest() {
    }
    
    public PaymentSubmissionRequest(Long appointmentId, PaymentMethod paymentMethod, 
                                   String transactionId, String screenshotUrl) {
        this.appointmentId = appointmentId;
        this.paymentMethod = paymentMethod;
        this.transactionId = transactionId;
        this.screenshotUrl = screenshotUrl;
    }
    
    public Long getAppointmentId() {
        return appointmentId;
    }
    
    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
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
}
