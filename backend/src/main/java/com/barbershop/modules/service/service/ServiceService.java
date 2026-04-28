package com.barbershop.modules.service.service;

import com.barbershop.modules.service.dto.request.ServiceRequest;
import com.barbershop.modules.service.dto.response.ServiceResponse;

import java.util.List;

public interface ServiceService {
    List<ServiceResponse> getAllServices();
    List<ServiceResponse> getAllActiveServices();
    ServiceResponse createService(ServiceRequest request);
    ServiceResponse updateService(Long id, ServiceRequest request);
    void deleteService(Long id);
}
