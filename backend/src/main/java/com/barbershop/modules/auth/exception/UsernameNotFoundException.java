package com.barbershop.modules.auth.exception;

public class UsernameNotFoundException extends RuntimeException {
  public UsernameNotFoundException() {
    super("Username not found 😔");
  }

  public UsernameNotFoundException(String message) {
    super(message);
  }

}
