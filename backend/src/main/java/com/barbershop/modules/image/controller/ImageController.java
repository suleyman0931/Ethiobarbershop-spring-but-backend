package com.barbershop.modules.image.controller;

import java.io.IOException;

import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.barbershop.modules.image.dto.response.ImageResponse;
import com.barbershop.modules.image.model.entity.Image;
import com.barbershop.modules.image.service.ImageService;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/owners/{ownerId}")
    public ResponseEntity<ImageResponse> uploadOwnerImage(
            @PathVariable Long ownerId,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        Image image = imageService.uploadForOwner(ownerId, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(image));
    }

    @GetMapping("/owners/{ownerId}")
    public ResponseEntity<ImageResponse> getOwnerImage(@PathVariable Long ownerId) {
        Image image = imageService.getOwnerImage(ownerId);
        return ResponseEntity.ok(toResponse(image));
    }

    @PutMapping("/owners/{ownerId}")
    public ResponseEntity<ImageResponse> updateOwnerImage(
            @PathVariable Long ownerId,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        Image image = imageService.updateOwnerImage(ownerId, file);
        return ResponseEntity.ok(toResponse(image));
    }

    @DeleteMapping("/owners/{ownerId}")
    public ResponseEntity<Void> deleteOwnerImage(@PathVariable Long ownerId) {
        imageService.deleteOwnerImage(ownerId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/barbers/{barberId}")
    public ResponseEntity<ImageResponse> uploadBarberImage(
            @PathVariable Long barberId,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        Image image = imageService.uploadForBarber(barberId, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(image));
    }

    @PostMapping("/customers/{customerId}")
    public ResponseEntity<ImageResponse> uploadCustomerImage(
            @PathVariable Long customerId,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        Image image = imageService.uploadForCustomer(customerId, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(image));
    }

    @PostMapping("/shops/{shopId}")
    public ResponseEntity<ImageResponse> uploadShopImage(
            @PathVariable Long shopId,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        Image image = imageService.uploadForShop(shopId, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(image));
    }

    @GetMapping("/files/{fileName:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName) throws IOException {
        Resource resource = imageService.loadFileAsResource(fileName);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    private ImageResponse toResponse(Image image) {
        return new ImageResponse(
                image.getId(),
                image.getFileName(),
                image.getFileUrl(),
                image.getFileType(),
                image.getFileSize()
        );
    }
}