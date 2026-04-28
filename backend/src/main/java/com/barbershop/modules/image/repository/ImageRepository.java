package com.barbershop.modules.image.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.barbershop.modules.image.model.entity.Image;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {

  Optional<Image> findByOwnerId(Long ownerId);

  Optional<Image> findByBarberId(Long barberId);

  Optional<Image> findByCustomerId(Long customerId);

  Optional<Image> findByShopId(Long shopId);

  Optional<Image> findByFileName(String fileName);

  void deleteByOwnerId(Long ownerId);

  void deleteByBarberId(Long barberId);

  void deleteByCustomerId(Long customerId);

  void deleteByShopId(Long shopId);
}