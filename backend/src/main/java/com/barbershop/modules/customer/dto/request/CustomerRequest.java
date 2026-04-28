package com.barbershop.modules.customer.dto.request;

import java.time.LocalDate;
import com.barbershop.modules.shared.model.entity.Address;

public class CustomerRequest {
  private String firstName;
  private String lastName;
  private String phoneNumber;
  // Optional — no @Past validation so null is accepted
  private LocalDate dateOfBirth;
  private Address address;

  public CustomerRequest() {}

  public String getFirstName() { return firstName; }
  public void setFirstName(String firstName) { this.firstName = firstName; }

  public String getLastName() { return lastName; }
  public void setLastName(String lastName) { this.lastName = lastName; }

  public String getPhoneNumber() { return phoneNumber; }
  public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

  public LocalDate getDateOfBirth() { return dateOfBirth; }
  public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

  public Address getAddress() { return address; }
  public void setAddress(Address address) { this.address = address; }
}
