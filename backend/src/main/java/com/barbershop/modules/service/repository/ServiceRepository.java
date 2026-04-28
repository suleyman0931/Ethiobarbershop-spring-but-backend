package com.barbershop.modules.service.repository;

import com.barbershop.modules.service.model.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByActiveTrue();
}
