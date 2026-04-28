package com.barbershop.modules.service.controller;

import com.barbershop.modules.service.dto.request.ServiceRequest;
import com.barbershop.modules.service.dto.response.ServiceResponse;
import com.barbershop.modules.service.service.ServiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {
    
    private final ServiceService serviceService;
    
    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }
    
    @GetMapping
    public ResponseEntity<List<ServiceResponse>> getAllServices() {
        List<ServiceResponse> services = serviceService.getAllServices();
        return ResponseEntity.ok(services);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<ServiceResponse>> getAllActiveServices() {
        List<ServiceResponse> services = serviceService.getAllActiveServices();
        return ResponseEntity.ok(services);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ServiceResponse> createService(@RequestBody ServiceRequest request) {
        ServiceResponse service = serviceService.createService(request);
        return ResponseEntity.ok(service);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ServiceResponse> updateService(@PathVariable Long id, @RequestBody ServiceRequest request) {
        ServiceResponse service = serviceService.updateService(id, request);
        return ResponseEntity.ok(service);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}
