package com.barbershop.modules.service.serviceImpl;

import com.barbershop.modules.service.dto.request.ServiceRequest;
import com.barbershop.modules.service.dto.response.ServiceResponse;
import com.barbershop.modules.service.model.entity.Service;
import com.barbershop.modules.service.repository.ServiceRepository;
import com.barbershop.modules.service.service.ServiceService;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class ServiceServiceImpl implements ServiceService {
    
    private final ServiceRepository serviceRepository;
    
    public ServiceServiceImpl(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }
    
    @Override
    public List<ServiceResponse> getAllServices() {
        List<Service> services = serviceRepository.findAll();
        return services.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ServiceResponse> getAllActiveServices() {
        List<Service> services = serviceRepository.findByActiveTrue();
        return services.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public ServiceResponse createService(ServiceRequest request) {
        Service service = new Service();
        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setActive(request.getActive() != null ? request.getActive() : true);
        
        Service savedService = serviceRepository.save(service);
        return toResponse(savedService);
    }
    
    @Override
    public ServiceResponse updateService(Long id, ServiceRequest request) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
        
        if (request.getName() != null) service.setName(request.getName());
        if (request.getDescription() != null) service.setDescription(request.getDescription());
        if (request.getPrice() != null) service.setPrice(request.getPrice());
        if (request.getDurationMinutes() != null) service.setDurationMinutes(request.getDurationMinutes());
        if (request.getActive() != null) service.setActive(request.getActive());
        
        Service updatedService = serviceRepository.save(service);
        return toResponse(updatedService);
    }
    
    @Override
    public void deleteService(Long id) {
        if (!serviceRepository.existsById(id)) {
            throw new RuntimeException("Service not found with id: " + id);
        }
        serviceRepository.deleteById(id);
    }
    
    private ServiceResponse toResponse(Service service) {
        return new ServiceResponse(
                service.getId(),
                service.getName(),
                service.getDescription(),
                service.getPrice(),
                service.getDurationMinutes(),
                service.getActive()
        );
    }
}
