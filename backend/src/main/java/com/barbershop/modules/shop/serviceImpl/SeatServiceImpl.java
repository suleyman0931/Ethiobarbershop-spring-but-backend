package com.barbershop.modules.shop.serviceImpl;

import com.barbershop.modules.shop.dto.request.AssignBarberRequest;
import com.barbershop.modules.shop.dto.request.SeatRequest;
import com.barbershop.modules.shop.dto.response.SeatResponse;
import com.barbershop.modules.shop.service.SeatService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SeatServiceImpl implements SeatService {

    @Override
    public SeatResponse createSeat(Long shopId, SeatRequest request) {
        return null;
    }

    @Override
    public List<SeatResponse> getSeatsByShop(Long shopId) {
        return new ArrayList<>();
    }

    @Override
    public SeatResponse getSeatById(Long shopId, Long seatId) {
        return null;
    }

    @Override
    public SeatResponse removeSeatById(Long shopId, Long seatId) {
        return null;
    }

    @Override
    public SeatResponse updateSeatById(Long shopId, Long seatId, SeatRequest request) {
        return null;
    }

    @Override
    public SeatResponse assignSeatToBarber(Long shopId, Long seatId, AssignBarberRequest request) {
        return null;
    }
}
