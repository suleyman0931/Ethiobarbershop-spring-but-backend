package com.barbershop.modules.shop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.barbershop.modules.barber.model.entity.Barber;
import com.barbershop.modules.shop.model.entity.BarberShopAssociation;
import com.barbershop.modules.shop.model.entity.Shop;

@Repository
public interface BarberShopAssociationRepository extends JpaRepository<BarberShopAssociation, Long> {

  List<BarberShopAssociation> findByShopId(Long shopId);

  // If you want to check if a barber is already in a shop
  boolean existsByShopAndBarber(Shop shop, Barber barber);
  
  // Delete all associations for a barber
  @Modifying
  @Transactional
  void deleteByBarberId(Long barberId);
}
