package com.barbershop.modules.appointment.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.barbershop.modules.appointment.model.entity.Appointment;
import com.barbershop.modules.barber.model.entity.Barber;
import com.barbershop.modules.customer.model.entity.Customer;
import com.barbershop.modules.shop.model.entity.Shop;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

  // Find appointments for a specific barber in a time range
  List<Appointment> findByBarberProfileAndAppointmentTimeBetween(
      Barber barberProfile,
      LocalDateTime start,
      LocalDateTime end);

  // Find appointments for a specific customer
  List<Appointment> findByCustomerProfile(Customer customerProfile);

  // Find all appointments for a specific barber
  List<Appointment> findByBarberProfile(Barber barberProfile);

  // Find all appointments for a specific shop
  List<Appointment> findByShop(Shop shop);
  
  // Find all appointments for a specific shop ordered by appointment time
  List<Appointment> findByShopOrderByAppointmentTimeDesc(Shop shop);

}
