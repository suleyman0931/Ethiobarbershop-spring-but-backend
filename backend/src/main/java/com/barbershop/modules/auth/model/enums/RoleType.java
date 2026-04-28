package com.barbershop.modules.auth.model.enums;

public enum RoleType {
  ROLE_OWNER,
  ROLE_BARBER,
  ROLE_CUSTOMER;
  // SPRING SECURITY LOOKS FOR "ROLE_blah"
  // WRITE_PRIVILEGE,  -- POTENTIAL FUTURE IMPL
  // READ_PRIVILEGE, -- POTENTIAL FUTURE IMPL
}
