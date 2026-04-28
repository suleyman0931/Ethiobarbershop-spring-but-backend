package com.barbershop.modules.rating.repository;

import com.barbershop.modules.appointment.model.entity.Appointment;
import com.barbershop.modules.barber.model.entity.Barber;
import com.barbershop.modules.customer.model.entity.Customer;
import com.barbershop.modules.rating.model.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    
    List<Rating> findByBarberOrderByCreatedAtDesc(Barber barber);
    
    Optional<Rating> findByCustomerAndAppointment(Customer customer, Appointment appointment);
    
    boolean existsByCustomerAndAppointment(Customer customer, Appointment appointment);
    
    @Query("SELECT AVG(r.ratingScore) FROM Rating r WHERE r.barber = :barber")
    Double calculateAverageRating(@Param("barber") Barber barber);
}
