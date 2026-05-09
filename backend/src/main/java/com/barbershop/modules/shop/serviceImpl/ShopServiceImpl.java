package com.barbershop.modules.shop.serviceImpl;

import com.barbershop.modules.owner.model.entity.Owner;
import com.barbershop.modules.owner.repository.OwnerRepository;
import com.barbershop.modules.shop.dto.request.ShopRequest;
import com.barbershop.modules.shop.dto.response.ShopResponse;
import com.barbershop.modules.shop.model.entity.Shop;
import com.barbershop.modules.shop.repository.ShopRepository;
import com.barbershop.modules.shop.service.ShopService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShopServiceImpl implements ShopService {

    private final ShopRepository shopRepository;
    private final OwnerRepository ownerRepository;

    public ShopServiceImpl(ShopRepository shopRepository, OwnerRepository ownerRepository) {
        this.shopRepository = shopRepository;
        this.ownerRepository = ownerRepository;
    }

    @Override
    public ShopResponse createShop(Long ownerId, ShopRequest request) {
        Owner owner = ownerRepository.findByUserId(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        
        Shop shop = new Shop(request.getName(), request.getAddress(), owner);
        Shop savedShop = shopRepository.save(shop);
        
        return mapToResponse(savedShop);
    }

    @Override
    public ShopResponse getShopById(Long shopId) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
        return mapToResponse(shop);
    }

    @Override
    public List<ShopResponse> getAllShops() {
        return shopRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ShopResponse updateShop(Long ownerId, Long shopId, ShopRequest request) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
        
        // Verify owner
        if (!shop.getOwner().getUser().getId().equals(ownerId)) {
            throw new RuntimeException("You don't own this shop");
        }
        
        shop.setName(request.getName());
        shop.setAddress(request.getAddress());
        Shop updatedShop = shopRepository.save(shop);
        
        return mapToResponse(updatedShop);
    }

    @Override
    public List<ShopResponse> getShopsByOwner(Long ownerId) {
        Owner owner = ownerRepository.findByUserId(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        
        return shopRepository.findByOwner(owner).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ShopResponse mapToResponse(Shop shop) {
        return new ShopResponse(
                shop.getId(),
                shop.getName(),
                shop.getAddress(),
                new ArrayList<>() // Empty seats list for now
        );
    }
}
