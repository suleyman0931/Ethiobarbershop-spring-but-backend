package com.barbershop.modules.barber.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.barbershop.modules.barber.model.entity.Barber;

@Repository
public interface BarberRepository extends JpaRepository<Barber, Long> {
  Optional<Barber> findByUserId(Long userId);
  List<Barber> findByShopId(Long shopId);
}
