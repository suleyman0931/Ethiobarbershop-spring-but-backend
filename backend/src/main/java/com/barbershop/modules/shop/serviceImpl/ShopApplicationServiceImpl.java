package com.barbershop.modules.shop.serviceImpl;

import com.barbershop.modules.shop.dto.response.ShopApplicationResponse;
import com.barbershop.modules.shop.service.ShopApplicationService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ShopApplicationServiceImpl implements ShopApplicationService {

    @Override
    public ShopApplicationResponse barberApplies(Long shopId, Long barberUserId, String message) {
        return null;
    }

    @Override
    public List<ShopApplicationResponse> getApplications(Long shopId, Long ownerUserId) {
        return new ArrayList<>();
    }

    @Override
    public ShopApplicationResponse approveApplication(Long shopId, Long applicationId, Long ownerUserId) {
        return null;
    }

    @Override
    public ShopApplicationResponse rejectApplication(Long shopId, Long applicationId, Long ownerUserId) {
        return null;
    }
}
