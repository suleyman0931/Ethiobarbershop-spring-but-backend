package com.barbershop.modules.appointment.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import static org.junit.jupiter.api.Assertions.*;

class InvalidStatusTransitionExceptionTest {

    @Test
    void shouldCreateExceptionWithMessage() {
        String message = "Cannot transition from COMPLETED to CONFIRMED";
        InvalidStatusTransitionException exception = new InvalidStatusTransitionException(message);
        
        assertEquals(message, exception.getMessage());
    }

    @Test
    void shouldHaveBadRequestStatus() {
        ResponseStatus annotation = InvalidStatusTransitionException.class.getAnnotation(ResponseStatus.class);
        
        assertNotNull(annotation);
        assertEquals(HttpStatus.BAD_REQUEST, annotation.value());
    }

    @Test
    void shouldBeRuntimeException() {
        InvalidStatusTransitionException exception = new InvalidStatusTransitionException("test");
        
        assertTrue(exception instanceof RuntimeException);
    }
}
