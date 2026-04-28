package com.barbershop.modules.image.model.entity;

import jakarta.persistence.*;
import com.barbershop.modules.barber.model.entity.Barber;
import com.barbershop.modules.customer.model.entity.Customer;
import com.barbershop.modules.owner.model.entity.Owner;
import com.barbershop.modules.shop.model.entity.Shop;

@Entity
@Table(name = "images")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String originalFileName;

    private String fileType;

    private long fileSize;

    private String filePath;

    private String fileUrl;

    @OneToOne
    @JoinColumn(name = "owner_id")
    private Owner owner;

    @OneToOne
    @JoinColumn(name = "barber_id")
    private Barber barber;

    @OneToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @OneToOne
    @JoinColumn(name = "shop_id")
    private Shop shop;

    public Image() {
    }

    public Image(String fileName, String originalFileName, String fileType, long fileSize, String filePath, String fileUrl) {
        this.fileName = fileName;
        this.originalFileName = originalFileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.filePath = filePath;
        this.fileUrl = fileUrl;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public long getFileSize() { return fileSize; }
    public void setFileSize(long fileSize) { this.fileSize = fileSize; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public Owner getOwner() { return owner; }
    public void setOwner(Owner owner) { this.owner = owner; }

    public Barber getBarber() { return barber; }
    public void setBarber(Barber barber) { this.barber = barber; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public Shop getShop() { return shop; }
    public void setShop(Shop shop) { this.shop = shop; }
}