package com.barbershop.modules.owner.serviceImpl;

import com.barbershop.modules.auth.model.entity.User;
import com.barbershop.modules.auth.repository.UserRepository;
import com.barbershop.modules.owner.dto.request.OwnerRequest;
import com.barbershop.modules.owner.dto.response.OwnerResponse;
import com.barbershop.modules.owner.model.entity.Owner;
import com.barbershop.modules.owner.repository.OwnerRepository;
import com.barbershop.modules.owner.service.OwnerService;
import org.springframework.stereotype.Service;

@Service
public class OwnerServiceImpl implements OwnerService {

    private final OwnerRepository ownerRepository;
    private final UserRepository userRepository;

    public OwnerServiceImpl(OwnerRepository ownerRepository, UserRepository userRepository) {
        this.ownerRepository = ownerRepository;
        this.userRepository = userRepository;
    }

    @Override
    public OwnerResponse createOwnerProfile(Long userId, OwnerRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (ownerRepository.findByUserId(userId).isPresent()) {
            throw new RuntimeException("Owner profile already exists");
        }

        Owner owner = new Owner(user, request.getFirstName(), request.getLastName(), request.getPhoneNumber());
        return toResponse(ownerRepository.save(owner));
    }

    @Override
    public OwnerResponse getOwnerProfileByUserId(Long userId) {
        Owner owner = ownerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Owner profile not found"));
        return toResponse(owner);
    }

    @Override
    public OwnerResponse updateOwnerProfile(Long userId, OwnerRequest request) {
        Owner owner = ownerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Owner profile not found"));

        owner.setFirstName(request.getFirstName());
        owner.setLastName(request.getLastName());
        owner.setPhoneNumber(request.getPhoneNumber());

        return toResponse(ownerRepository.save(owner));
    }

    @Override
    public void deleteOwnerProfile(Long userId) {
        Owner owner = ownerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Owner profile not found"));
        ownerRepository.delete(owner);
    }

    private OwnerResponse toResponse(Owner o) {
        return new OwnerResponse(
                o.getId(),
                o.getFirstName(),
                o.getLastName(),
                o.getEmail(),
                o.getPhoneNumber(),
                o.getUser().getId());
    }
}
