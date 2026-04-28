package com.barbershop.modules.rating.exception;

public class AppointmentNotCompletedException extends RuntimeException {
    public AppointmentNotCompletedException(String message) {
        super(message);
    }
}
