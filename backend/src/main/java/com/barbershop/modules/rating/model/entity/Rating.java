package com.barbershop.modules.rating.model.entity;

import com.barbershop.modules.appointment.model.entity.Appointment;
import com.barbershop.modules.barber.model.entity.Barber;
import com.barbershop.modules.customer.model.entity.Customer;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Table(name = "ratings", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"customer_id", "appointment_id"}))
@EntityListeners(AuditingEntityListener.class)
public class Rating {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    @Min(1)
    @Max(5)
    private Integer ratingScore;
    
    @Column(length = 500)
    @Size(max = 500)
    private String reviewText;
    
    @CreatedDate
    @Column(updatable = false, nullable = false)
    private Instant createdAt;
    
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "barber_id", nullable = false)
    private Barber barber;
    
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;
    
    public Rating() {
    }
    
    public Rating(Integer ratingScore, String reviewText, Customer customer, Barber barber, Appointment appointment) {
        this.ratingScore = ratingScore;
        this.reviewText = reviewText;
        this.customer = customer;
        this.barber = barber;
        this.appointment = appointment;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Integer getRatingScore() {
        return ratingScore;
    }
    
    public void setRatingScore(Integer ratingScore) {
        this.ratingScore = ratingScore;
    }
    
    public String getReviewText() {
        return reviewText;
    }
    
    public void setReviewText(String reviewText) {
        this.reviewText = reviewText;
    }
    
    public Instant getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
    
    public Customer getCustomer() {
        return customer;
    }
    
    public void setCustomer(Customer customer) {
        this.customer = customer;
    }
    
    public Barber getBarber() {
        return barber;
    }
    
    public void setBarber(Barber barber) {
        this.barber = barber;
    }
    
    public Appointment getAppointment() {
        return appointment;
    }
    
    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }
}
