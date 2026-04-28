package com.barbershop.modules.image.service;

import java.io.IOException;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import com.barbershop.modules.image.model.entity.Image;

public interface ImageService {
    Image uploadForOwner(Long ownerId, MultipartFile file) throws IOException;
    Image getOwnerImage(Long ownerId);
    void deleteOwnerImage(Long ownerId);
    Image updateOwnerImage(Long ownerId, MultipartFile file) throws IOException;
    Image uploadForBarber(Long barberId, MultipartFile file) throws IOException;
    Image uploadForCustomer(Long customerId, MultipartFile file) throws IOException;
    Image uploadForShop(Long shopId, MultipartFile file) throws IOException;
    Resource loadFileAsResource(String fileName) throws IOException;
    void deleteFileFromDisk(String fileName);
}