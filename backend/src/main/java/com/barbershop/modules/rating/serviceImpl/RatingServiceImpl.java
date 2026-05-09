package com.barbershop.modules.rating.serviceImpl;

import com.barbershop.modules.appointment.model.entity.Appointment;
import com.barbershop.modules.appointment.model.enums.AppointmentStatus;
import com.barbershop.modules.appointment.repository.AppointmentRepository;
import com.barbershop.modules.barber.model.entity.Barber;
import com.barbershop.modules.barber.repository.BarberRepository;
import com.barbershop.modules.customer.model.entity.Customer;
import com.barbershop.modules.customer.repository.CustomerRepository;
import com.barbershop.modules.rating.dto.request.RatingRequest;
import com.barbershop.modules.rating.dto.response.BarberRatingSummary;
import com.barbershop.modules.rating.dto.response.RatingResponse;
import com.barbershop.modules.rating.exception.AppointmentNotCompletedException;
import com.barbershop.modules.rating.exception.DuplicateRatingException;
import com.barbershop.modules.rating.model.entity.Rating;
import com.barbershop.modules.rating.repository.RatingRepository;
import com.barbershop.modules.rating.service.RatingService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final CustomerRepository customerRepository;
    private final BarberRepository barberRepository;
    private final AppointmentRepository appointmentRepository;

    public RatingServiceImpl(RatingRepository ratingRepository,
                             CustomerRepository customerRepository,
                             BarberRepository barberRepository,
                             AppointmentRepository appointmentRepository) {
        this.ratingRepository = ratingRepository;
        this.customerRepository = customerRepository;
        this.barberRepository = barberRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    @Transactional
    public RatingResponse createRating(Long customerUserId, RatingRequest request) {
        // 1. Verify customer profile exists
        Customer customer = customerRepository.findByUserId(customerUserId)
                .orElseThrow(() -> new EntityNotFoundException("Customer profile not found"));

        // 2. Verify appointment exists
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found"));

        // 3. Verify appointment is COMPLETED
        if (appointment.getStatus() != AppointmentStatus.COMPLETED) {
            throw new AppointmentNotCompletedException("Appointment must be completed before rating");
        }

        // 4. Verify customer owns appointment
        if (!appointment.getCustomerProfile().getId().equals(customer.getId())) {
            throw new AccessDeniedException("You can only rate your own appointments");
        }

        // 5. Check for duplicate rating
        if (ratingRepository.existsByCustomerAndAppointment(customer, appointment)) {
            throw new DuplicateRatingException("You have already rated this appointment");
        }

        // 6. Validate rating score (1-5) - handled by @Valid annotation on request
        // 7. Validate review text length (≤500) - handled by @Valid annotation on request

        // 8. Create and save Rating entity
        Rating rating = new Rating(
                request.getRatingScore(),
                request.getReviewText(),
                customer,
                appointment.getBarberProfile(),
                appointment
        );

        Rating savedRating = ratingRepository.save(rating);

        // 9. Return RatingResponse with timestamp
        return mapToRatingResponse(savedRating);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RatingResponse> getBarberRatings(Long barberId) {
        // Retrieve barber
        Barber barber = barberRepository.findById(barberId)
                .orElseThrow(() -> new EntityNotFoundException("Barber not found"));

        // Retrieve ratings using findByBarberOrderByCreatedAtDesc
        List<Rating> ratings = ratingRepository.findByBarberOrderByCreatedAtDesc(barber);

        return ratings.stream()
                .map(this::mapToRatingResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BarberRatingSummary getBarberRatingSummary(Long barberId) {
        // Retrieve barber
        Barber barber = barberRepository.findById(barberId)
                .orElseThrow(() -> new EntityNotFoundException("Barber not found"));

        // Retrieve ratings
        List<Rating> ratings = ratingRepository.findByBarberOrderByCreatedAtDesc(barber);

        // Calculate average using calculateAverageRating
        Double averageRating = ratingRepository.calculateAverageRating(barber);
        if (averageRating == null) {
            averageRating = 0.0;
        }

        // Map to response
        List<RatingResponse> ratingResponses = ratings.stream()
                .map(this::mapToRatingResponse)
                .collect(Collectors.toList());

        // Return summary with ratings list
        return new BarberRatingSummary(
                barberId,
                averageRating,
                ratings.size(),
                ratingResponses
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<RatingResponse> getMyRatings(Long barberUserId) {
        // Retrieve barber profile
        Barber barber = barberRepository.findByUserId(barberUserId)
                .orElseThrow(() -> new EntityNotFoundException("Barber profile not found"));

        // Return ratings ordered by timestamp
        List<Rating> ratings = ratingRepository.findByBarberOrderByCreatedAtDesc(barber);

        return ratings.stream()
                .map(this::mapToRatingResponse)
                .collect(Collectors.toList());
    }

    private RatingResponse mapToRatingResponse(Rating rating) {
        return new RatingResponse(
                rating.getId(),
                rating.getRatingScore(),
                rating.getReviewText(),
                rating.getCreatedAt(),
                rating.getCustomer().getId(),
                rating.getCustomer().getFirstName() + " " + rating.getCustomer().getLastName(),
                rating.getBarber().getId(),
                rating.getAppointment().getId()
        );
    }
}
