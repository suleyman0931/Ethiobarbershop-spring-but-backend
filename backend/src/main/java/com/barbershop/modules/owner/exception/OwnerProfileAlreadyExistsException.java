package com.barbershop.modules.owner.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class OwnerProfileAlreadyExistsException extends RuntimeException {
    public OwnerProfileAlreadyExistsException(String message) {
        super(message);
    }
}
