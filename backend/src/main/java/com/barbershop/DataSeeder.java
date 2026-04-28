package com.barbershop;

import com.barbershop.modules.auth.model.entity.Role;
import com.barbershop.modules.auth.model.entity.User;
import com.barbershop.modules.auth.model.enums.RoleType;
import com.barbershop.modules.auth.repository.RoleTypeRepository;
import com.barbershop.modules.auth.repository.UserRepository;
import com.barbershop.modules.barber.model.entity.Barber;
import com.barbershop.modules.barber.repository.BarberRepository;
import com.barbershop.modules.customer.model.entity.Customer;
import com.barbershop.modules.customer.repository.CustomerRepository;
import com.barbershop.modules.owner.model.entity.Owner;
import com.barbershop.modules.owner.repository.OwnerRepository;
import com.barbershop.modules.service.model.entity.Service;
import com.barbershop.modules.service.repository.ServiceRepository;
import com.barbershop.modules.shared.model.entity.Address;
import com.barbershop.modules.shop.model.entity.BarberShopAssociation;
import com.barbershop.modules.shop.model.entity.Seat;
import com.barbershop.modules.shop.model.entity.Shop;
import com.barbershop.modules.shop.repository.BarberShopAssociationRepository;
import com.barbershop.modules.shop.repository.SeatRepository;
import com.barbershop.modules.shop.repository.ShopRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Component
public class DataSeeder implements ApplicationRunner {

    private final RoleTypeRepository roleRepo;
    private final UserRepository userRepo;
    private final OwnerRepository ownerRepo;
    private final BarberRepository barberRepo;
    private final CustomerRepository customerRepo;
    private final ShopRepository shopRepo;
    private final BarberShopAssociationRepository associationRepo;
    private final SeatRepository seatRepo;
    private final ServiceRepository serviceRepo;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
            RoleTypeRepository roleRepo,
            UserRepository userRepo,
            OwnerRepository ownerRepo,
            BarberRepository barberRepo,
            CustomerRepository customerRepo,
            ShopRepository shopRepo,
            BarberShopAssociationRepository associationRepo,
            SeatRepository seatRepo,
            ServiceRepository serviceRepo,
            PasswordEncoder passwordEncoder) {
        this.roleRepo = roleRepo;
        this.userRepo = userRepo;
        this.ownerRepo = ownerRepo;
        this.barberRepo = barberRepo;
        this.customerRepo = customerRepo;
        this.shopRepo = shopRepo;
        this.associationRepo = associationRepo;
        this.seatRepo = seatRepo;
        this.serviceRepo = serviceRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        // Skip if data already exists
        if (roleRepo.count() > 0) {
            System.out.println("[DataSeeder] Data already exists, skipping seed.");
            return;
        }

        System.out.println("[DataSeeder] Seeding sample data...");

        // ── Roles ──────────────────────────────────────────────
        Role ownerRole    = roleRepo.save(new Role(RoleType.ROLE_OWNER));
        Role barberRole   = roleRepo.save(new Role(RoleType.ROLE_BARBER));
        Role customerRole = roleRepo.save(new Role(RoleType.ROLE_CUSTOMER));

        // Passwords: owner123, barber123, customer123
        String ownerPw = passwordEncoder.encode("owner123");
        String barberPw = passwordEncoder.encode("barber123");
        String customerPw = passwordEncoder.encode("customer123");

        // ── Owner user ────────────────────────────────────────
        User u1 = userRepo.save(new User("owner1", "owner@barbershop.com", ownerPw));
        u1.setRoles(Set.of(ownerRole));
        userRepo.save(u1);

        // ── Barber users ───────────────────────────────────────
        User u3 = userRepo.save(new User("barber1", "barber1@barbershop.com", barberPw));
        u3.setRoles(Set.of(barberRole));
        userRepo.save(u3);

        User u4 = userRepo.save(new User("barber2", "barber2@barbershop.com", barberPw));
        u4.setRoles(Set.of(barberRole));
        userRepo.save(u4);

        User u5 = userRepo.save(new User("barber3", "barber3@barbershop.com", barberPw));
        u5.setRoles(Set.of(barberRole));
        userRepo.save(u5);

        // ── Customer users ─────────────────────────────────────
        User u6 = userRepo.save(new User("customer1", "customer1@email.com", customerPw));
        u6.setRoles(Set.of(customerRole));
        userRepo.save(u6);

        User u7 = userRepo.save(new User("customer2", "customer2@email.com", customerPw));
        u7.setRoles(Set.of(customerRole));
        userRepo.save(u7);

        User u8 = userRepo.save(new User("customer3", "customer3@email.com", customerPw));
        u8.setRoles(Set.of(customerRole));
        userRepo.save(u8);

        User u9 = userRepo.save(new User("customer4", "customer4@email.com", customerPw));
        u9.setRoles(Set.of(customerRole));
        userRepo.save(u9);

        User u10 = userRepo.save(new User("customer5", "customer5@email.com", customerPw));
        u10.setRoles(Set.of(customerRole));
        userRepo.save(u10);

        // ── Owner profile ─────────────────────────────────────
        Owner owner = ownerRepo.save(new Owner(u1, "Premium", "Barbershop", "0911111111"));

        // ── Barber profiles ────────────────────────────────────
        Barber barber1 = barberRepo.save(new Barber(u3, "Ahmed", "Hassan", "0922111111",
                "Expert in traditional and modern haircuts", "Classic Cuts & Beard Styling", 5));
        Barber barber2 = barberRepo.save(new Barber(u4, "Dawit", "Tesfaye", "0922222222",
                "Specialist in modern styles and hair coloring", "Hair Coloring & Styling", 7));
        Barber barber3 = barberRepo.save(new Barber(u5, "Samuel", "Bekele", "0922333333",
                "Friendly barber specializing in kids and family cuts", "Kids Haircuts & Shaving", 4));

        // ── Customer profiles ──────────────────────────────────
        Address addr1 = new Address("Kebele 03", "Bole", "Addis Ababa Zone", "Addis Ababa", "Bole Road", true);
        Address addr2 = new Address("Kebele 07", "Arada", "Addis Ababa Zone", "Addis Ababa", "Piazza Area", true);
        Address addr3 = new Address("Kebele 12", "Kirkos", "Addis Ababa Zone", "Addis Ababa", "Megenagna", true);
        Address addr4 = new Address("Kebele 15", "Yeka", "Addis Ababa Zone", "Addis Ababa", "Gerji", true);
        Address addr5 = new Address("Kebele 18", "Kolfe", "Addis Ababa Zone", "Addis Ababa", "Kolfe", true);

        customerRepo.save(new Customer(u6, "Abebe", "Kebede", "0933111111",
                LocalDate.of(1990, 5, 15), null, null, addr1, null, null));
        customerRepo.save(new Customer(u7, "Meron", "Tadesse", "0933222222",
                LocalDate.of(1995, 8, 22), null, null, addr2, null, null));
        customerRepo.save(new Customer(u8, "Yohannes", "Alemu", "0933333333",
                LocalDate.of(1988, 12, 10), null, null, addr3, null, null));
        customerRepo.save(new Customer(u9, "Hanna", "Girma", "0933444444",
                LocalDate.of(1992, 3, 18), null, null, addr4, null, null));
        customerRepo.save(new Customer(u10, "Tigist", "Haile", "0933555555",
                LocalDate.of(1993, 7, 25), null, null, addr5, null, null));

        // ── Shops (3 BRANCHES) ──────────────
        Shop branch1 = shopRepo.save(new Shop("Downtown Branch", "Bole Road, Addis Ababa", owner));
        Shop branch2 = shopRepo.save(new Shop("Piazza Branch", "Piazza Area, Addis Ababa", owner));
        Shop branch3 = shopRepo.save(new Shop("Megenagna Branch", "Megenagna, Addis Ababa", owner));

        // ── Barber-Shop associations ───────────────────────────
        // Set shop for each barber
        barber1.setShop(branch1);
        barber2.setShop(branch2);
        barber3.setShop(branch3);
        barberRepo.save(barber1);
        barberRepo.save(barber2);
        barberRepo.save(barber3);
        
        BarberShopAssociation a1 = associationRepo.save(
                new BarberShopAssociation(branch1, barber1, LocalDateTime.now(), null));
        BarberShopAssociation a2 = associationRepo.save(
                new BarberShopAssociation(branch2, barber2, LocalDateTime.now(), null));
        BarberShopAssociation a3 = associationRepo.save(
                new BarberShopAssociation(branch3, barber3, LocalDateTime.now(), null));

        // ── Seats ──────────────────────────────────────────────
        Seat s1 = new Seat("Seat 1", branch1); s1.setAssociation(a1); seatRepo.save(s1);
        seatRepo.save(new Seat("Seat 2", branch1)); // open

        Seat s3 = new Seat("Seat 1", branch2); s3.setAssociation(a2); seatRepo.save(s3);
        seatRepo.save(new Seat("Seat 2", branch2)); // open

        Seat s5 = new Seat("Seat 1", branch3); s5.setAssociation(a3); seatRepo.save(s5);
        seatRepo.save(new Seat("Seat 2", branch3)); // open

        // ── Services ───────────────────────────────────────────
        serviceRepo.save(createService("Haircut", "Standard men's haircut with styling", 150.00, 30));
        serviceRepo.save(createService("Haircut + Beard Trim", "Complete haircut with professional beard styling", 200.00, 45));
        serviceRepo.save(createService("Beard Trim Only", "Professional beard shaping and trimming", 80.00, 20));
        serviceRepo.save(createService("Hair Coloring", "Professional hair coloring service", 300.00, 60));
        serviceRepo.save(createService("Kids Haircut", "Haircut for children under 12 years", 100.00, 25));
        serviceRepo.save(createService("Shave", "Traditional straight razor shave", 120.00, 30));
        serviceRepo.save(createService("Hair Treatment", "Deep conditioning and hair treatment", 250.00, 45));

        System.out.println("[DataSeeder] Done. Seeded 3 shops, 6 seats, 3 barbers, 1 owner, 5 customers, 7 services.");
    }

    private Service createService(String name, String description, double price, int durationMinutes) {
        Service service = new Service();
        service.setName(name);
        service.setDescription(description);
        service.setPrice(BigDecimal.valueOf(price));
        service.setDurationMinutes(durationMinutes);
        service.setActive(true);
        return service;
    }
}
