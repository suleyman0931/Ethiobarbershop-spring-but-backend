package com.barbershop.modules.barber.serviceImpl;

import com.barbershop.modules.auth.model.entity.User;
import com.barbershop.modules.auth.repository.UserRepository;
import com.barbershop.modules.barber.dto.request.BarberRequest;
import com.barbershop.modules.barber.dto.response.BarberResponse;
import com.barbershop.modules.barber.model.entity.Barber;
import com.barbershop.modules.barber.repository.BarberRepository;
import com.barbershop.modules.barber.service.BarberService;
import com.barbershop.modules.shop.model.entity.Seat;
import com.barbershop.modules.shop.repository.BarberShopAssociationRepository;
import com.barbershop.modules.shop.repository.SeatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BarberServiceImpl implements BarberService {

    private final BarberRepository barberRepository;
    private final UserRepository userRepository;
    private final BarberShopAssociationRepository associationRepository;
    private final SeatRepository seatRepository;

    public BarberServiceImpl(BarberRepository barberRepository, UserRepository userRepository,
                             BarberShopAssociationRepository associationRepository,
                             SeatRepository seatRepository) {
        this.barberRepository = barberRepository;
        this.userRepository = userRepository;
        this.associationRepository = associationRepository;
        this.seatRepository = seatRepository;
    }

    @Override
    @Transactional
    public BarberResponse createBarberProfile(Long userId, BarberRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (barberRepository.findByUserId(userId).isPresent()) {
            throw new RuntimeException("Barber profile already exists");
        }

        Barber barber = new Barber(user,
                request.getFirstName(),
                request.getLastName(),
                request.getPhoneNumber(),
                request.getSummary(),
                request.getSkills(),
                request.getExperienceYears());

        return toResponse(barberRepository.save(barber));
    }

    @Override
    @Transactional(readOnly = true)
    public BarberResponse getBarberProfileByUserId(Long userId) {
        Barber barber = barberRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Barber profile not found"));
        return toResponse(barber);
    }

    @Override
    @Transactional
    public BarberResponse updateBarberProfile(Long userId, BarberRequest request) {
        Barber barber = barberRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Barber profile not found"));

        barber.setFirstName(request.getFirstName());
        barber.setLastName(request.getLastName());
        barber.setPhoneNumber(request.getPhoneNumber());
        barber.setSummary(request.getSummary());
        barber.setSkills(request.getSkills());
        barber.setExperienceYears(request.getExperienceYears());

        return toResponse(barberRepository.save(barber));
    }

    @Override
    public void deleteBarberProfile(Long userId) {
        Barber barber = barberRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Barber profile not found"));
        barberRepository.delete(barber);
    }

    @Override
    @Transactional
    public void deleteBarberById(Long barberId) {
        Barber barber = barberRepository.findById(barberId)
                .orElseThrow(() -> new RuntimeException("Barber not found"));
        
        // Find all associations for this barber
        List<Long> associationIds = associationRepository.findAll().stream()
                .filter(assoc -> assoc.getBarber().getId().equals(barberId))
                .map(assoc -> assoc.getId())
                .collect(Collectors.toList());
        
        // For each association, null out the association_id in seats
        for (Long associationId : associationIds) {
            List<Seat> seats = seatRepository.findAllByAssociationId(associationId);
            for (Seat seat : seats) {
                seat.setAssociation(null);
                seatRepository.save(seat);
            }
        }
        
        // Delete all associations for this barber
        associationRepository.deleteByBarberId(barberId);
        
        // Finally, delete the barber
        barberRepository.delete(barber);
    }

    @Override
    @Transactional(readOnly = true)
    public BarberResponse getBarberProfileById(Long barberId) {
        Barber barber = barberRepository.findById(barberId)
                .orElseThrow(() -> new RuntimeException("Barber not found"));
        return toResponse(barber);
    }

    @Override
    @Transactional
    public BarberResponse updateBarberById(Long barberId, BarberRequest request) {
        Barber barber = barberRepository.findById(barberId)
                .orElseThrow(() -> new RuntimeException("Barber not found"));

        barber.setFirstName(request.getFirstName());
        barber.setLastName(request.getLastName());
        barber.setPhoneNumber(request.getPhoneNumber());
        barber.setSummary(request.getSummary());
        barber.setSkills(request.getSkills());
        barber.setExperienceYears(request.getExperienceYears());

        return toResponse(barberRepository.save(barber));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BarberResponse> getAllBarbers() {
        return barberRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BarberResponse> getBarbersByShopId(Long shopId) {
        List<Barber> barbers = barberRepository.findByShopId(shopId);
        if (barbers.isEmpty()) {
            return getAllBarbers(); // fallback: show all if none assigned
        }
        return barbers.stream().map(this::toResponse).collect(Collectors.toList());
    }

    private BarberResponse toResponse(Barber barber) {
        return new BarberResponse(
                barber.getId(),
                barber.getFirstName(),
                barber.getLastName(),
                barber.getEmail(),
                barber.getPhoneNumber(),
                barber.getSummary(),
                barber.getSkills(),
                barber.getExperienceYears(),
                barber.getUser().getId(),
                barber.getShop() != null ? barber.getShop().getId() : null,
                barber.getShop() != null ? barber.getShop().getName() : null);
    }
}
