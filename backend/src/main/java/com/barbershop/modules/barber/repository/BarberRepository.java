package com.barbershop.modules.barber.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.barbershop.modules.barber.model.entity.Barber;

@Repository
public interface BarberRepository extends JpaRepository<Barber, Long> {
  Optional<Barber> findByUserId(Long userId);
  List<Barber> findByShopId(Long shopId);
  
  @Modifying
  @Transactional
  @Query(value = "DELETE FROM barber_profiles WHERE id = :barberId", nativeQuery = true)
  void deleteBarberByIdNative(@Param("barberId") Long barberId);
}
