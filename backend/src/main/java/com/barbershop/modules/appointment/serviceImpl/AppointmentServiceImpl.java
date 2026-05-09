package com.barbershop.modules.appointment.serviceImpl;

import com.barbershop.modules.appointment.dto.request.AppointmentRequest;
import com.barbershop.modules.appointment.dto.response.AppointmentResponse;
import com.barbershop.modules.appointment.exception.InvalidStatusTransitionException;
import com.barbershop.modules.appointment.model.entity.Appointment;
import com.barbershop.modules.appointment.model.enums.AppointmentStatus;
import com.barbershop.modules.appointment.repository.AppointmentRepository;
import com.barbershop.modules.appointment.service.AppointmentService;
import com.barbershop.modules.barber.model.entity.Barber;
import com.barbershop.modules.barber.repository.BarberRepository;
import com.barbershop.modules.customer.model.entity.Customer;
import com.barbershop.modules.customer.repository.CustomerRepository;
import com.barbershop.modules.service.model.entity.Service;
import com.barbershop.modules.service.repository.ServiceRepository;
import com.barbershop.modules.shop.model.entity.Shop;
import com.barbershop.modules.shop.repository.ShopRepository;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final CustomerRepository customerRepository;
    private final BarberRepository barberRepository;
    private final ServiceRepository serviceRepository;
    private final ShopRepository shopRepository;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository,
                                  CustomerRepository customerRepository,
                                  BarberRepository barberRepository,
                                  ServiceRepository serviceRepository,
                                  ShopRepository shopRepository) {
        this.appointmentRepository = appointmentRepository;
        this.customerRepository = customerRepository;
        this.barberRepository = barberRepository;
        this.serviceRepository = serviceRepository;
        this.shopRepository = shopRepository;
    }

    @Override
    public AppointmentResponse createAppointment(Long customerUserId, AppointmentRequest request) {
        Customer customer = customerRepository.findByUserId(customerUserId)
                .orElseThrow(() -> new RuntimeException("Customer profile not found. Please create your profile first."));

        Barber barber = barberRepository.findById(request.getBarberProfileId())
                .orElseThrow(() -> new RuntimeException("Barber not found"));

        Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // Get shop if provided
        Shop shop = null;
        if (request.getShopId() != null) {
            shop = shopRepository.findById(request.getShopId())
                    .orElseThrow(() -> new RuntimeException("Shop not found"));
        }

        // Check for double-booking: barber already has an appointment within 1 hour of requested time
        java.time.LocalDateTime desiredTime = request.getDesiredTime();
        java.time.LocalDateTime windowStart = desiredTime.minusMinutes(59);
        java.time.LocalDateTime windowEnd   = desiredTime.plusMinutes(59);

        boolean conflict = !appointmentRepository
                .findByBarberProfileAndAppointmentTimeBetween(barber, windowStart, windowEnd)
                .stream()
                .filter(a -> a.getStatus() == AppointmentStatus.PENDING_PAYMENT || a.getStatus() == AppointmentStatus.CONFIRMED)
                .collect(java.util.stream.Collectors.toList())
                .isEmpty();

        if (conflict) {
            throw new RuntimeException("This barber already has an appointment at that time. Please choose a different time.");
        }

        Appointment appointment = new Appointment(
                desiredTime,
                AppointmentStatus.PENDING_PAYMENT,
                customer,
                barber,
                shop,
                service);

        return toResponse(appointmentRepository.save(appointment));
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public AppointmentResponse confirmAppointment(Long appointmentId, Long barberUserId) {
        Appointment appointment = getAndValidate(appointmentId);

        if (!appointment.getBarberProfile().getUser().getId().equals(barberUserId)) {
            throw new RuntimeException("You can only confirm your own appointments");
        }
        if (appointment.getStatus() != AppointmentStatus.PENDING_PAYMENT) {
            throw new RuntimeException("Only PENDING_PAYMENT appointments can be confirmed");
        }

        appointment.setStatus(AppointmentStatus.CONFIRMED);
        return toResponse(appointmentRepository.save(appointment));
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public AppointmentResponse approveAppointment(Long appointmentId, Long barberUserId) {
        Appointment appointment = getAndValidate(appointmentId);

        if (!appointment.getBarberProfile().getUser().getId().equals(barberUserId)) {
            throw new RuntimeException("You are not authorized to approve this appointment");
        }
        if (appointment.getStatus() != AppointmentStatus.PENDING_PAYMENT) {
            throw new InvalidStatusTransitionException("Only PENDING_PAYMENT appointments can be approved");
        }

        appointment.setStatus(AppointmentStatus.CONFIRMED);
        return toResponse(appointmentRepository.save(appointment));
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public AppointmentResponse cancelAppointment(Long appointmentId, Long requesterUserId) {
        Appointment appointment = getAndValidate(appointmentId);

        boolean isBarber   = appointment.getBarberProfile().getUser().getId().equals(requesterUserId);
        boolean isCustomer = appointment.getCustomerProfile().getUser().getId().equals(requesterUserId);

        if (!isBarber && !isCustomer) {
            throw new RuntimeException("You are not authorized to cancel this appointment");
        }
        if (appointment.getStatus() == AppointmentStatus.COMPLETED || appointment.getStatus() == AppointmentStatus.CANCELED) {
            throw new InvalidStatusTransitionException("Cannot cancel a COMPLETED or CANCELED appointment");
        }

        appointment.setStatus(AppointmentStatus.CANCELED);
        return toResponse(appointmentRepository.save(appointment));
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public AppointmentResponse completeAppointment(Long appointmentId, Long barberUserId) {
        Appointment appointment = getAndValidate(appointmentId);

        if (!appointment.getBarberProfile().getUser().getId().equals(barberUserId)) {
            throw new RuntimeException("You are not authorized to complete this appointment");
        }
        if (appointment.getStatus() != AppointmentStatus.CONFIRMED) {
            throw new InvalidStatusTransitionException("Only CONFIRMED appointments can be completed");
        }

        appointment.setStatus(AppointmentStatus.COMPLETED);
        return toResponse(appointmentRepository.save(appointment));
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public AppointmentResponse getAppointment(Long appointmentId, Long requesterUserId) {
        Appointment appointment = getAndValidate(appointmentId);

        boolean isBarber   = appointment.getBarberProfile().getUser().getId().equals(requesterUserId);
        boolean isCustomer = appointment.getCustomerProfile().getUser().getId().equals(requesterUserId);

        if (!isBarber && !isCustomer) {
            throw new RuntimeException("You are not authorized to view this appointment");
        }

        return toResponse(appointment);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsForUser(Long userId) {
        // Try customer first, then barber
        List<Appointment> appointments;

        var customerOpt = customerRepository.findByUserId(userId);
        if (customerOpt.isPresent()) {
            appointments = appointmentRepository.findByCustomerProfile(customerOpt.get());
        } else {
            var barberOpt = barberRepository.findByUserId(userId);
            if (barberOpt.isPresent()) {
                appointments = appointmentRepository.findByBarberProfile(barberOpt.get());
            } else {
                return List.of();
            }
        }

        return appointments.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByShop(Long shopId) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
        
        List<Appointment> appointments = appointmentRepository.findByShopOrderByAppointmentTimeDesc(shop);
        return appointments.stream().map(this::toResponse).collect(Collectors.toList());
    }

    private Appointment getAndValidate(Long appointmentId) {
        return appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    private AppointmentResponse toResponse(Appointment a) {
        Service service = a.getService();
        return new AppointmentResponse(
                a.getId(),
                a.getCustomerProfile().getId(),
                a.getCustomerProfile().getFirstName() + " " + a.getCustomerProfile().getLastName(),
                a.getBarberProfile().getId(),
                a.getBarberProfile().getFirstName() + " " + a.getBarberProfile().getLastName(),
                a.getShop() != null ? a.getShop().getId() : null,
                a.getShop() != null ? a.getShop().getName() : null,
                service.getId(),
                service.getName(),
                service.getPrice(),
                service.getDurationMinutes(),
                a.getAppointmentTime(),
                a.getStatus());
    }
}
