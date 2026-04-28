package com.barbershop.modules.owner.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.barbershop.modules.auth.dto.response.MessageResponse;
import com.barbershop.modules.auth.model.entity.Role;
import com.barbershop.modules.auth.model.entity.User;
import com.barbershop.modules.auth.model.enums.RoleType;
import com.barbershop.modules.auth.repository.RoleTypeRepository;
import com.barbershop.modules.auth.repository.UserRepository;
import com.barbershop.modules.auth.serviceImpl.UserDetailsImpl;
import com.barbershop.modules.barber.model.entity.Barber;
import com.barbershop.modules.barber.repository.BarberRepository;
import com.barbershop.modules.owner.dto.request.OwnerRequest;
import com.barbershop.modules.owner.dto.request.RegisterBarberRequest;
import com.barbershop.modules.owner.dto.response.OwnerResponse;
import com.barbershop.modules.owner.service.OwnerService;
import com.barbershop.modules.shop.model.entity.Shop;
import com.barbershop.modules.shop.repository.ShopRepository;

import java.util.Set;

@RestController
@RequestMapping("/api/owners")
public class OwnerController {

  private final OwnerService ownerService;
  private final UserRepository userRepository;
  private final RoleTypeRepository roleRepository;
  private final BarberRepository barberRepository;
  private final ShopRepository shopRepository;
  private final PasswordEncoder passwordEncoder;

  public OwnerController(OwnerService ownerService,
                         UserRepository userRepository,
                         RoleTypeRepository roleRepository,
                         BarberRepository barberRepository,
                         ShopRepository shopRepository,
                         PasswordEncoder passwordEncoder) {
    this.ownerService = ownerService;
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.barberRepository = barberRepository;
    this.shopRepository = shopRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @PostMapping("/me")
  @PreAuthorize("hasRole('OWNER')")
  public OwnerResponse createOwnerProfile(@AuthenticationPrincipal UserDetailsImpl userDetails,
      @RequestBody OwnerRequest request) {
    return ownerService.createOwnerProfile(userDetails.getId(), request);
  }

  @GetMapping("/me")
  @PreAuthorize("hasRole('OWNER')")
  public OwnerResponse getMyOwnerProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
    return ownerService.getOwnerProfileByUserId(userDetails.getId());
  }

  @PutMapping("/me")
  @PreAuthorize("hasRole('OWNER')")
  public OwnerResponse updateOwnerProfile(@AuthenticationPrincipal UserDetailsImpl userDetails,
      @RequestBody OwnerRequest request) {
    return ownerService.updateOwnerProfile(userDetails.getId(), request);
  }

  @DeleteMapping("/me")
  @PreAuthorize("hasRole('OWNER')")
  public ResponseEntity<?> deleteOwnerProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
    ownerService.deleteOwnerProfile(userDetails.getId());
    return ResponseEntity.ok("Owner profile deleted successfully.");
  }

  @PostMapping("/register-barber")
  @PreAuthorize("hasRole('OWNER')")
  public ResponseEntity<?> registerBarber(@RequestBody RegisterBarberRequest req) {
    if (userRepository.existsByUsername(req.getUsername())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Username already taken"));
    }
    if (userRepository.existsByEmail(req.getEmail())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Email already in use"));
    }

    Role barberRole = roleRepository.findByRoleType(RoleType.ROLE_BARBER)
            .orElseThrow(() -> new RuntimeException("ROLE_BARBER not found"));

    User user = new User(req.getUsername(), req.getEmail(), passwordEncoder.encode(req.getPassword()));
    user.setRoles(Set.of(barberRole));
    userRepository.save(user);

    Barber barber = new Barber(user,
            req.getFirstName(),
            req.getLastName(),
            req.getPhoneNumber(),
            null,
            req.getSkills(),
            req.getExperienceYears());

    // Assign to shop if provided
    if (req.getShopId() != null) {
      Shop shop = shopRepository.findById(req.getShopId()).orElse(null);
      if (shop != null) {
        barber.setShop(shop);
      }
    }

    barberRepository.save(barber);

    return ResponseEntity.ok(new MessageResponse("Barber registered successfully"));
  }
}
