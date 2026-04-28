package com.barbershop.modules.shared.exception;

import com.barbershop.modules.appointment.exception.InvalidStatusTransitionException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler handler;

    @BeforeEach
    void setUp() {
        handler = new GlobalExceptionHandler();
    }

    @Test
    void shouldHandleInvalidStatusTransitionException() {
        String errorMessage = "Cannot transition from COMPLETED to CONFIRMED";
        InvalidStatusTransitionException exception = new InvalidStatusTransitionException(errorMessage);

        ResponseEntity<GlobalExceptionHandler.ErrorResponse> response = 
            handler.handleInvalidStatusTransition(exception);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("INVALID_STATUS_TRANSITION", response.getBody().getError());
        assertEquals(errorMessage, response.getBody().getMessage());
    }

    @Test
    void shouldReturnBadRequestForInvalidStatusTransition() {
        InvalidStatusTransitionException exception = 
            new InvalidStatusTransitionException("Invalid transition");

        ResponseEntity<GlobalExceptionHandler.ErrorResponse> response = 
            handler.handleInvalidStatusTransition(exception);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void shouldIncludeErrorCodeInResponse() {
        InvalidStatusTransitionException exception = 
            new InvalidStatusTransitionException("Test message");

        ResponseEntity<GlobalExceptionHandler.ErrorResponse> response = 
            handler.handleInvalidStatusTransition(exception);

        assertNotNull(response.getBody());
        assertEquals("INVALID_STATUS_TRANSITION", response.getBody().getError());
    }
}
