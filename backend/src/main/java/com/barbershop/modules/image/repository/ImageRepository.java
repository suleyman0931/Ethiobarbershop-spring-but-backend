package com.barbershop.modules.image.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.barbershop.modules.image.model.entity.Image;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {

  Optional<Image> findByOwnerId(Long ownerId);

  Optional<Image> findByBarberId(Long barberId);

  Optional<Image> findByCustomerId(Long customerId);

  Optional<Image> findByShopId(Long shopId);

  Optional<Image> findByFileName(String fileName);

  @Modifying
  @Transactional
  void deleteByOwnerId(Long ownerId);

  @Modifying
  @Transactional
  void deleteByBarberId(Long barberId);

  @Modifying
  @Transactional
  void deleteByCustomerId(Long customerId);

  @Modifying
  @Transactional
  void deleteByShopId(Long shopId);
}