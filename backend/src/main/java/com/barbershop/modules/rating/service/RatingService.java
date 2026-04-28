package com.barbershop.modules.rating.service;

import com.barbershop.modules.rating.dto.request.RatingRequest;
import com.barbershop.modules.rating.dto.response.BarberRatingSummary;
import com.barbershop.modules.rating.dto.response.RatingResponse;
import java.util.List;

public interface RatingService {

  RatingResponse createRating(Long customerUserId, RatingRequest request);

  List<RatingResponse> getBarberRatings(Long barberId);

  BarberRatingSummary getBarberRatingSummary(Long barberId);

  List<RatingResponse> getMyRatings(Long barberUserId);

}
