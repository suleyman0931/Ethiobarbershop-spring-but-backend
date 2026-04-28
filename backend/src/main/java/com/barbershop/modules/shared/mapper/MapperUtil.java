package com.barbershop.modules.shared.mapper;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import com.barbershop.modules.barber.dto.request.BarberRequest;
import com.barbershop.modules.barber.model.entity.Barber;
import com.barbershop.modules.customer.model.entity.Customer;
import com.barbershop.modules.shop.model.entity.*;
import com.barbershop.modules.image.model.entity.Image;
import com.barbershop.modules.image.dto.response.ImageResponse;

@Component
public class MapperUtil {

  public static Barber toBarberProfile(BarberRequest request) {
    Barber profile = new Barber();
    profile.setFirstName(request.getFirstName());
    profile.setLastName(request.getLastName());
    profile.setPhoneNumber(request.getPhoneNumber());
    return profile;
  }

  // Image Mappings
  public static ImageResponse toImageResponse(Image image) {
    return new ImageResponse(
        image.getId(),
        image.getFileName(),
        image.getFileUrl(),
        image.getFileType(),
        image.getFileSize());
  }
}
