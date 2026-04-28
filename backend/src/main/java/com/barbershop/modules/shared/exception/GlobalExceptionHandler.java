package com.barbershop.modules.shared.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.barbershop.modules.customer.exception.CustomerProfileAlreadyExistsException;
import com.barbershop.modules.appointment.exception.InvalidStatusTransitionException;
import com.barbershop.modules.rating.exception.DuplicateRatingException;
import com.barbershop.modules.rating.exception.AppointmentNotCompletedException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomerProfileAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleCustomerProfileAlreadyExists(CustomerProfileAlreadyExistsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("Conflict", ex.getMessage()));
    }

    @ExceptionHandler(InvalidStatusTransitionException.class)
    public ResponseEntity<ErrorResponse> handleInvalidStatusTransition(InvalidStatusTransitionException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("INVALID_STATUS_TRANSITION", ex.getMessage()));
    }

    @ExceptionHandler(DuplicateRatingException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateRating(DuplicateRatingException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("DUPLICATE_RATING", ex.getMessage()));
    }

    @ExceptionHandler(AppointmentNotCompletedException.class)
    public ResponseEntity<ErrorResponse> handleAppointmentNotCompleted(AppointmentNotCompletedException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("APPOINTMENT_NOT_COMPLETED", ex.getMessage()));
    }

    /**
     * Catch-all for RuntimeExceptions thrown from service layer.
     * Returns 400 Bad Request with the exception message.
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        String message = ex.getMessage();
        if (message == null) message = "An unexpected error occurred";

        HttpStatus status = HttpStatus.BAD_REQUEST;
        if (message.contains("not found") || message.contains("Not found")) {
            status = HttpStatus.NOT_FOUND;
        } else if (message.contains("already exists") || message.contains("already an owner")) {
            status = HttpStatus.CONFLICT;
        } else if (message.contains("not authorized") || message.contains("only confirm") || message.contains("only complete")) {
            status = HttpStatus.FORBIDDEN;
        } else if (message.contains("expired")) {
            status = HttpStatus.UNAUTHORIZED;
        }

        return ResponseEntity.status(status).body(new ErrorResponse("Error", message));
    }

    public static class ErrorResponse {
        private String error;
        private String message;

        public ErrorResponse(String error, String message) {
            this.error = error;
            this.message = message;
        }

        public String getError()   { return error; }
        public void setError(String error) { this.error = error; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}