package com.barbershop.modules.image.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.barbershop.modules.barber.model.entity.Barber;
import com.barbershop.modules.barber.repository.BarberRepository;
import com.barbershop.modules.customer.model.entity.Customer;
import com.barbershop.modules.customer.repository.CustomerRepository;
import com.barbershop.modules.image.model.entity.Image;
import com.barbershop.modules.image.repository.ImageRepository;
import com.barbershop.modules.owner.model.entity.Owner;
import com.barbershop.modules.owner.repository.OwnerRepository;
import com.barbershop.modules.shared.exception.BadRequestException;
import com.barbershop.modules.shared.exception.ResourceNotFoundException;
import com.barbershop.modules.shop.model.entity.Shop;
import com.barbershop.modules.shop.repository.ShopRepository;

@Service
@Transactional
public class ImageServiceImpl implements ImageService {

  private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif"
  );

  private final ImageRepository imageRepository;
  private final OwnerRepository ownerRepository;
  private final BarberRepository barberRepository;
  private final CustomerRepository customerRepository;
  private final ShopRepository shopRepository;
  private final Path uploadPath;

  public ImageServiceImpl(
          ImageRepository imageRepository,
          OwnerRepository ownerRepository,
          BarberRepository barberRepository,
          CustomerRepository customerRepository,
          ShopRepository shopRepository,
          @Value("${app.upload.dir:uploads/images}") String uploadDir
  ) throws IOException {
    this.imageRepository = imageRepository;
    this.ownerRepository = ownerRepository;
    this.barberRepository = barberRepository;
    this.customerRepository = customerRepository;
    this.shopRepository = shopRepository;
    this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();

    Files.createDirectories(this.uploadPath);
  }

  @Override
  public Image uploadForOwner(Long ownerId, MultipartFile file) throws IOException {
    Owner owner = ownerRepository.findById(ownerId)
            .orElseThrow(() -> new ResourceNotFoundException("Owner not found with id: " + ownerId));

    imageRepository.findByOwnerId(ownerId)
            .ifPresent(existingImage -> {
              deleteFileFromDisk(existingImage.getFileName());
              imageRepository.delete(existingImage);
            });

    Image image = storeFile(file);
    image.setOwner(owner);

    return imageRepository.save(image);
  }

  @Override
  @Transactional(readOnly = true)
  public Image getOwnerImage(Long ownerId) {
    return imageRepository.findByOwnerId(ownerId)
            .orElseThrow(() -> new ResourceNotFoundException("Image not found for owner id: " + ownerId));
  }

  @Override
  public void deleteOwnerImage(Long ownerId) {
    Image image = imageRepository.findByOwnerId(ownerId)
            .orElseThrow(() -> new ResourceNotFoundException("Image not found for owner id: " + ownerId));

    deleteFileFromDisk(image.getFileName());
    imageRepository.delete(image);
  }

  @Override
  public Image updateOwnerImage(Long ownerId, MultipartFile file) throws IOException {
    return uploadForOwner(ownerId, file);
  }

  @Override
  public Image uploadForBarber(Long barberId, MultipartFile file) throws IOException {
    Barber barber = barberRepository.findById(barberId)
            .orElseThrow(() -> new ResourceNotFoundException("Barber not found with id: " + barberId));

    imageRepository.findByBarberId(barberId)
            .ifPresent(existingImage -> {
              deleteFileFromDisk(existingImage.getFileName());
              imageRepository.delete(existingImage);
            });

    Image image = storeFile(file);
    image.setBarber(barber);

    return imageRepository.save(image);
  }

  @Override
  public Image uploadForCustomer(Long customerId, MultipartFile file) throws IOException {
    Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

    imageRepository.findByCustomerId(customerId)
            .ifPresent(existingImage -> {
              deleteFileFromDisk(existingImage.getFileName());
              imageRepository.delete(existingImage);
              imageRepository.flush(); // Ensure delete is committed before insert
            });

    Image image = storeFile(file);
    image.setCustomer(customer);

    return imageRepository.save(image);
  }

  @Override
  public Image uploadForShop(Long shopId, MultipartFile file) throws IOException {
    Shop shop = shopRepository.findById(shopId)
            .orElseThrow(() -> new ResourceNotFoundException("Shop not found with id: " + shopId));

    imageRepository.findByShopId(shopId)
            .ifPresent(existingImage -> {
              deleteFileFromDisk(existingImage.getFileName());
              imageRepository.delete(existingImage);
            });

    Image image = storeFile(file);
    image.setShop(shop);

    return imageRepository.save(image);
  }

  @Override
  @Transactional(readOnly = true)
  public Resource loadFileAsResource(String fileName) throws IOException {
    try {
      Path filePath = uploadPath.resolve(fileName).normalize();
      Resource resource = new UrlResource(filePath.toUri());

      if (!resource.exists() || !resource.isReadable()) {
        throw new ResourceNotFoundException("File not found: " + fileName);
      }

      return resource;
    } catch (MalformedURLException ex) {
      throw new IOException("Could not load file: " + fileName, ex);
    }
  }

  @Override
  public void deleteFileFromDisk(String fileName) {
    try {
      Path filePath = uploadPath.resolve(fileName).normalize();
      Files.deleteIfExists(filePath);
    } catch (IOException ignored) {
      // File deletion failure should not break database deletion.
    }
  }

  private Image storeFile(MultipartFile file) throws IOException {
    validateFile(file);

    String originalFileName = StringUtils.cleanPath(
            file.getOriginalFilename() == null ? "image" : file.getOriginalFilename()
    );

    String extension = getExtension(originalFileName);
    String storedFileName = UUID.randomUUID() + extension;

    Path targetLocation = uploadPath.resolve(storedFileName).normalize();

    Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

    String fileUrl = "/api/images/files/" + storedFileName;

    return new Image(
            storedFileName,
            originalFileName,
            file.getContentType(),
            file.getSize(),
            targetLocation.toString(),
            fileUrl
    );
  }

  private void validateFile(MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new BadRequestException("Image file is required");
    }

    if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
      throw new BadRequestException("Only JPEG, PNG, WEBP, and GIF image files are allowed");
    }
  }

  private String getExtension(String fileName) {
    int dotIndex = fileName.lastIndexOf('.');

    if (dotIndex < 0) {
      return "";
    }

    return fileName.substring(dotIndex);
  }
}
