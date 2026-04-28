package com.barbershop.modules.shop.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.barbershop.modules.barber.model.entity.Barber;
import com.barbershop.modules.shop.model.entity.Shop;
import com.barbershop.modules.shop.model.entity.ShopApplication;
import com.barbershop.modules.shop.model.enums.ApplicationStatus;

@Repository
public interface ShopApplicationRepository extends JpaRepository<ShopApplication, Long> {

    // All applications for a given shop
    List<ShopApplication> findByShop(Shop shop);

    // All applications for a given shop with a certain status
    List<ShopApplication> findByShopAndStatus(Shop shop, ApplicationStatus status);

    // Check if a barber already has an application for the shop
    Optional<ShopApplication> findByShopAndBarber(Shop shop, Barber barber);
}
