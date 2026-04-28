package com.barbershop.modules.barber.controller;

import com.barbershop.modules.auth.serviceImpl.UserDetailsImpl;
import com.barbershop.modules.barber.dto.request.BarberRequest;
import com.barbershop.modules.barber.dto.response.BarberResponse;
import com.barbershop.modules.barber.service.BarberService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/barbers")
public class BarberController {

    private final BarberService barberService;

    public BarberController(BarberService barberService) {
        this.barberService = barberService;
    }

    @PostMapping("/me")
    @PreAuthorize("hasRole('BARBER')")
    public BarberResponse createBarberProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody BarberRequest request) {
        return barberService.createBarberProfile(userDetails.getId(), request);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('BARBER')")
    public BarberResponse getBarberProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return barberService.getBarberProfileByUserId(userDetails.getId());
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('BARBER')")
    public BarberResponse updateBarberProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody BarberRequest request) {
        return barberService.updateBarberProfile(userDetails.getId(), request);
    }

    @GetMapping("/{barberId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<BarberResponse> getBarberProfileById(@PathVariable Long barberId) {
        BarberResponse response = barberService.getBarberProfileById(barberId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/me")
    @PreAuthorize("hasRole('BARBER')")
    public ResponseEntity<?> deleteBarberProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        barberService.deleteBarberProfile(userDetails.getId());
        return ResponseEntity.ok("Barber profile deleted successfully");
    }

    @DeleteMapping("/{barberId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> deleteBarberById(@PathVariable Long barberId) {
        barberService.deleteBarberById(barberId);
        return ResponseEntity.ok("Barber deleted successfully");
    }

    @GetMapping
    public List<BarberResponse> listAllBarbers() {
        return barberService.getAllBarbers();
    }

    @GetMapping("/shop/{shopId}")
    public List<BarberResponse> listBarbersByShop(@PathVariable Long shopId) {
        return barberService.getBarbersByShopId(shopId);
    }
}
