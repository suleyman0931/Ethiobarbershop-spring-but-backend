# Spring Boot Backend - Detailed Code Explanation

## Table of Contents
1. Project Structure
2. Annotations Explained
3. DTOs (Data Transfer Objects)
4. Controllers
5. Services
6. Repositories
7. Entities/Models
8. Security Configuration

---

## 1. PROJECT STRUCTURE

```
backend/src/main/java/com/barbershop/
 BarbershopBackendApplication.java    # Main entry point
 DataSeeder.java                      # Seeds initial data
 modules/
     appointment/                     # Appointment management
        controller/
           AppointmentController.java
        dto/
           request/
              AppointmentRequest.java
           response/
               AppointmentResponse.java
        model/
           entity/
              Appointment.java
           enums/
               AppointmentStatus.java
        repository/
           AppointmentRepository.java
        service/
           AppointmentService.java
        serviceImpl/
            AppointmentServiceImpl.java
     auth/                            # Authentication
         controller/
         dto/
         model/
         repository/
         security/
         serviceImpl/
```

---

## 2. SPRING BOOT ANNOTATIONS EXPLAINED

### @SpringBootApplication
**Location**: BarbershopBackendApplication.java
**Purpose**: Marks the main class of Spring Boot application
**What it does**: Combines three annotations:
- @Configuration: Marks class as source of bean definitions
- @EnableAutoConfiguration: Tells Spring Boot to auto-configure based on dependencies
- @ComponentScan: Tells Spring to scan for components in this package

```java
@SpringBootApplication
public class BarbershopBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BarbershopBackendApplication.class, args);
    }
}
```

### @RestController
**Purpose**: Marks a class as a REST API controller
**What it does**: 
- Combines @Controller and @ResponseBody
- All methods return data (JSON) instead of views (HTML pages)
- Automatically converts Java objects to JSON

```java
@RestController  // This class handles HTTP requests
@RequestMapping("/api/appointments")  // Base URL for all methods
public class AppointmentController {
    // Methods here
}
```

### @RequestMapping
**Purpose**: Maps HTTP requests to handler methods
**Variants**:
- @GetMapping: For GET requests (retrieve data)
- @PostMapping: For POST requests (create data)
- @PutMapping: For PUT requests (update data)
- @DeleteMapping: For DELETE requests (delete data)

```java
@GetMapping("/my")  // Maps to: GET /api/appointments/my
public List<AppointmentResponse> getMyAppointments() {
    // Returns list of appointments
}

@PostMapping("/book")  // Maps to: POST /api/appointments/book
public AppointmentResponse bookAppointment(@RequestBody AppointmentRequest request) {
    // Creates new appointment
}
```

### @Service
**Purpose**: Marks a class as a service (business logic layer)
**What it does**: 
- Spring creates a single instance (singleton)
- Can be injected into other classes
- Contains business logic

```java
@Service
public class AppointmentServiceImpl implements AppointmentService {
    // Business logic methods
}
```

### @Repository
**Purpose**: Marks interface as data access layer
**What it does**:
- Provides database operations
- Extends JpaRepository for CRUD operations
- Spring automatically implements methods

```java
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    // Spring automatically implements basic CRUD
    // Custom queries can be added
}
```

### @Entity
**Purpose**: Marks a class as a database table
**What it does**:
- JPA maps this class to a database table
- Each instance = one row in table
- Fields = columns in table

```java
@Entity
@Table(name = "appointments")  // Table name in database
public class Appointment {
    @Id  // Primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-increment
    private Long id;
    
    private LocalDateTime appointmentTime;
    // More fields...
}
```

---

## 3. DTOs (Data Transfer Objects) EXPLAINED

### What is a DTO?
A DTO is a simple object that carries data between processes. It's like a container for data.

### Why Use DTOs?
1. **Security**: Don't expose internal entity structure
2. **Flexibility**: Can combine data from multiple entities
3. **Validation**: Can add validation rules
4. **Clean API**: Control exactly what data is sent/received

### Example: AppointmentRequest.java (Request DTO)

```java
package com.barbershop.modules.appointment.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data  // Lombok: Auto-generates getters, setters, toString, equals, hashCode
public class AppointmentRequest {
    
    @NotNull(message = "Barber profile ID is required")
    private Long barberProfileId;  // Which barber
    
    @NotNull(message = "Service ID is required")
    private Long serviceId;  // Which service (haircut, shave, etc.)
    
    private Long shopId;  // Which branch (optional)
    
    @NotNull(message = "Desired time is required")
    private LocalDateTime desiredTime;  // When
}
```

**Explanation**:
- @Data: Lombok annotation that generates boilerplate code
- @NotNull: Validation - field cannot be null
- This DTO is used when customer books appointment
- Frontend sends JSON that Spring converts to this object

**JSON Example**:
```json
{
  "barberProfileId": 5,
  "serviceId": 2,
  "shopId": 1,
  "desiredTime": "2024-05-15T10:00:00"
}
```

### Example: AppointmentResponse.java (Response DTO)

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentResponse {
    private Long id;
    private Long customerProfileId;
    private String customerName;
    private Long barberProfileId;
    private String barberName;
    private Long serviceId;
    private String serviceName;
    private BigDecimal servicePrice;
    private Long shopId;
    private LocalDateTime appointmentTime;
    private String status;
    private LocalDateTime createdAt;
}
```

**Explanation**:
- This is what backend sends to frontend
- Combines data from multiple tables (appointment, customer, barber, service)
- Frontend receives this as JSON

---

## 4. CONTROLLERS EXPLAINED

### What is a Controller?
A controller handles HTTP requests from frontend and returns responses.

### AppointmentController.java - Detailed Explanation

```java
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    // Dependency Injection
    private final AppointmentService appointmentService;
    
    // Constructor injection (recommended way)
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }
    
    /**
     * CREATE: Book new appointment
     * URL: POST /api/appointments/book
     * Access: Only customers can book
     */
    @PostMapping("/book")
    @PreAuthorize("hasRole('CUSTOMER')")  // Security: Only CUSTOMER role
    public AppointmentResponse createAppointment(
            @AuthenticationPrincipal UserDetailsImpl userDetails,  // Current logged-in user
            @RequestBody AppointmentRequest request) {  // Data from frontend
        
        // Get user ID from authenticated user
        Long userId = userDetails.getId();
        
        // Call service to create appointment
        return appointmentService.createAppointment(userId, request);
    }
    
    /**
     * READ: Get all my appointments
     * URL: GET /api/appointments/my
     * Access: Any authenticated user
     */
    @GetMapping("/my")
    public List<AppointmentResponse> getMyAppointments(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        return appointmentService.getAppointmentsForUser(userDetails.getId());
    }
    
    /**
     * READ: Get appointments by shop (for owners)
     * URL: GET /api/appointments/shop/{shopId}
     * Access: Only owners
     */
    @GetMapping("/shop/{shopId}")
    @PreAuthorize("hasRole('OWNER')")
    public List<AppointmentResponse> getAppointmentsByShop(
            @PathVariable Long shopId) {  // shopId from URL
        
        return appointmentService.getAppointmentsByShop(shopId);
    }
    
    /**
     * UPDATE: Cancel appointment
     * URL: POST /api/appointments/{appointmentId}/cancel
     * Access: Barber or Customer
     */
    @PostMapping("/{appointmentId}/cancel")
    @PreAuthorize("hasRole('BARBER') or hasRole('CUSTOMER')")
    public AppointmentResponse cancelAppointment(
            @PathVariable Long appointmentId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        return appointmentService.cancelAppointment(appointmentId, userDetails.getId());
    }
}
```

**Key Annotations in Controllers**:

1. **@RequestBody**: Converts JSON from frontend to Java object
2. **@PathVariable**: Extracts value from URL path
3. **@AuthenticationPrincipal**: Gets currently logged-in user
4. **@PreAuthorize**: Security check before method executes

---

## 5. SERVICES EXPLAINED

### What is a Service?
Service layer contains business logic - the "how" of operations.

### AppointmentServiceImpl.java - Detailed Explanation

```java
@Service
@Transactional  // All methods run in database transaction
public class AppointmentServiceImpl implements AppointmentService {

    // Dependencies
    private final AppointmentRepository appointmentRepository;
    private final CustomerRepository customerRepository;
    private final BarberRepository barberRepository;
    private final ServiceRepository serviceRepository;
    
    // Constructor injection
    public AppointmentServiceImpl(
            AppointmentRepository appointmentRepository,
            CustomerRepository customerRepository,
            BarberRepository barberRepository,
            ServiceRepository serviceRepository) {
        this.appointmentRepository = appointmentRepository;
        this.customerRepository = customerRepository;
        this.barberRepository = barberRepository;
        this.serviceRepository = serviceRepository;
    }
    
    @Override
    public AppointmentResponse createAppointment(Long userId, AppointmentRequest request) {
        // Step 1: Find customer profile
        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));
        
        // Step 2: Find barber profile
        Barber barber = barberRepository.findById(request.getBarberProfileId())
                .orElseThrow(() -> new RuntimeException("Barber not found"));
        
        // Step 3: Find service
        Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));
        
        // Step 4: Create appointment entity
        Appointment appointment = new Appointment();
        appointment.setCustomerProfile(customer);
        appointment.setBarberProfile(barber);
        appointment.setService(service);
        appointment.setAppointmentTime(request.getDesiredTime());
        appointment.setStatus("PENDING_PAYMENT");  // Initial status
        
        if (request.getShopId() != null) {
            Shop shop = shopRepository.findById(request.getShopId())
                    .orElseThrow(() -> new RuntimeException("Shop not found"));
            appointment.setShop(shop);
        }
        
        // Step 5: Save to database
        Appointment saved = appointmentRepository.save(appointment);
        
        // Step 6: Convert entity to DTO and return
        return toResponse(saved);
    }
    
    // Helper method: Convert Entity to DTO
    private AppointmentResponse toResponse(Appointment appointment) {
        AppointmentResponse response = new AppointmentResponse();
        response.setId(appointment.getId());
        response.setCustomerProfileId(appointment.getCustomerProfile().getId());
        response.setCustomerName(
            appointment.getCustomerProfile().getFirstName() + " " +
            appointment.getCustomerProfile().getLastName()
        );
        response.setBarberProfileId(appointment.getBarberProfile().getId());
        response.setBarberName(
            appointment.getBarberProfile().getFirstName() + " " +
            appointment.getBarberProfile().getLastName()
        );
        response.setServiceId(appointment.getService().getId());
        response.setServiceName(appointment.getService().getName());
        response.setServicePrice(appointment.getService().getPrice());
        response.setAppointmentTime(appointment.getAppointmentTime());
        response.setStatus(appointment.getStatus());
        response.setCreatedAt(appointment.getCreatedAt());
        
        if (appointment.getShop() != null) {
            response.setShopId(appointment.getShop().getId());
        }
        
        return response;
    }
}
```

**Key Concepts**:

1. **@Transactional**: If any operation fails, all changes are rolled back
2. **orElseThrow()**: If entity not found, throw exception
3. **Entity to DTO conversion**: Never expose entities directly to frontend

---

## 6. REPOSITORIES EXPLAINED

### What is a Repository?
Repository provides database access methods.

### AppointmentRepository.java

```java
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    // Spring automatically implements these methods based on method name
    
    /**
     * Find all appointments for a customer
     * SQL: SELECT * FROM appointments WHERE customer_profile_id = ?
     */
    List<Appointment> findByCustomerProfileId(Long customerProfileId);
    
    /**
     * Find all appointments for a barber
     * SQL: SELECT * FROM appointments WHERE barber_profile_id = ?
     */
    List<Appointment> findByBarberProfileId(Long barberProfileId);
    
    /**
     * Find all appointments for a shop
     * SQL: SELECT * FROM appointments WHERE shop_id = ?
     */
    List<Appointment> findByShopId(Long shopId);
    
    /**
     * Find appointments by status
     * SQL: SELECT * FROM appointments WHERE status = ?
     */
    List<Appointment> findByStatus(String status);
    
    /**
     * Custom query using @Query annotation
     */
    @Query("SELECT a FROM Appointment a WHERE a.appointmentTime BETWEEN :start AND :end")
    List<Appointment> findAppointmentsBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
```

**Method Naming Convention**:
- indBy: SELECT query
- indByCustomerProfileId: WHERE customer_profile_id = ?
- indByStatusAndBarberProfileId: WHERE status = ? AND barber_profile_id = ?
- deleteBy: DELETE query
- countBy: COUNT query

**Inherited Methods from JpaRepository**:
```java
save(entity)           // INSERT or UPDATE
findById(id)           // SELECT by ID
findAll()              // SELECT all
deleteById(id)         // DELETE by ID
count()                // COUNT all
existsById(id)         // Check if exists
```

---

## 7. ENTITIES/MODELS EXPLAINED

### What is an Entity?
An entity represents a database table as a Java class.

### Appointment.java - Detailed Explanation

```java
@Entity  // This is a database table
@Table(name = "appointments")  // Table name
@EntityListeners(AuditingEntityListener.class)  // Auto-update timestamps
public class Appointment {

    // PRIMARY KEY
    @Id  // This is the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-increment
    private Long id;
    
    // FOREIGN KEY: Many appointments -> One customer
    @ManyToOne(fetch = FetchType.LAZY)  // Lazy: Load only when accessed
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private Customer customerProfile;
    
    // FOREIGN KEY: Many appointments -> One barber
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barber_profile_id", nullable = false)
    private Barber barberProfile;
    
    // FOREIGN KEY: Many appointments -> One service
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;
    
    // FOREIGN KEY: Many appointments -> One shop (optional)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id")
    private Shop shop;
    
    // REGULAR COLUMNS
    @Column(name = "appointment_time", nullable = false)
    private LocalDateTime appointmentTime;
    
    @Column(name = "status", length = 50)
    private String status;  // PENDING_PAYMENT, CONFIRMED, COMPLETED, etc.
    
    // AUDIT FIELDS (auto-managed)
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // CONSTRUCTORS
    public Appointment() {}
    
    public Appointment(Customer customerProfile, Barber barberProfile, 
                      Service service, LocalDateTime appointmentTime) {
        this.customerProfile = customerProfile;
        this.barberProfile = barberProfile;
        this.service = service;
        this.appointmentTime = appointmentTime;
        this.status = "PENDING_PAYMENT";
    }
    
    // GETTERS AND SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Customer getCustomerProfile() { return customerProfile; }
    public void setCustomerProfile(Customer customerProfile) { 
        this.customerProfile = customerProfile; 
    }
    
    // ... more getters and setters
}
```

**Key Annotations**:

1. **@ManyToOne**: Many appointments belong to one customer/barber/service
2. **@JoinColumn**: Specifies foreign key column name
3. **FetchType.LAZY**: Don't load related data until accessed (performance)
4. **@CreatedDate/@LastModifiedDate**: Auto-set timestamps

**Relationship Types**:
- **@OneToOne**: One user has one profile
- **@OneToMany**: One customer has many appointments
- **@ManyToOne**: Many appointments belong to one customer
- **@ManyToMany**: Many students have many courses

---

## 8. SECURITY CONFIGURATION

### WebSecurityConfig.java - Detailed Explanation

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity  // Enable @PreAuthorize annotations
public class WebSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsService;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF (not needed for stateless JWT)
            .csrf(csrf -> csrf.disable())
            
            // Configure CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Configure authorization rules
            .authorizeHttpRequests(auth -> auth
                // Public endpoints (no authentication required)
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/external/weather").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/services/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/barbers/**").permitAll()
                
                // Protected endpoints (authentication required)
                .requestMatchers("/api/appointments/**").authenticated()
                .requestMatchers("/api/customers/**").hasRole("CUSTOMER")
                .requestMatchers("/api/barbers/profile/**").hasRole("BARBER")
                .requestMatchers("/api/owners/**").hasRole("OWNER")
                
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            
            // Stateless session (no server-side sessions)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // Add JWT filter before UsernamePasswordAuthenticationFilter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();  // Hash passwords with BCrypt
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) 
            throws Exception {
        return config.getAuthenticationManager();
    }
}
```

**Security Flow**:
1. Request comes in
2. JWT filter extracts token from header
3. JWT filter validates token
4. If valid, sets authentication in SecurityContext
5. Request proceeds to controller
6. @PreAuthorize checks if user has required role
7. If authorized, method executes

---

## COMPLETE REQUEST FLOW EXAMPLE

### Scenario: Customer books an appointment

**Step 1: Frontend sends request**
```javascript
POST https://backend.railway.app/api/appointments/book
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  "Content-Type": "application/json"
}
Body: {
  "barberProfileId": 5,
  "serviceId": 2,
  "shopId": 1,
  "desiredTime": "2024-05-15T10:00:00"
}
```

**Step 2: Security Filter (JwtAuthenticationFilter)**
- Extracts JWT token from Authorization header
- Validates token signature
- Extracts user info (userId, username, roles)
- Sets authentication in SecurityContext

**Step 3: Controller (AppointmentController)**
```java
@PostMapping("/book")
@PreAuthorize("hasRole('CUSTOMER')")  //  User has CUSTOMER role
public AppointmentResponse createAppointment(
        @AuthenticationPrincipal UserDetailsImpl userDetails,  // User from JWT
        @RequestBody AppointmentRequest request) {  // JSON converted to object
    
    return appointmentService.createAppointment(userDetails.getId(), request);
}
```

**Step 4: Service (AppointmentServiceImpl)**
```java
@Transactional
public AppointmentResponse createAppointment(Long userId, AppointmentRequest request) {
    // 1. Find customer
    Customer customer = customerRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
    
    // 2. Find barber
    Barber barber = barberRepository.findById(request.getBarberProfileId())
            .orElseThrow(() -> new RuntimeException("Barber not found"));
    
    // 3. Find service
    Service service = serviceRepository.findById(request.getServiceId())
            .orElseThrow(() -> new RuntimeException("Service not found"));
    
    // 4. Create appointment
    Appointment appointment = new Appointment();
    appointment.setCustomerProfile(customer);
    appointment.setBarberProfile(barber);
    appointment.setService(service);
    appointment.setAppointmentTime(request.getDesiredTime());
    appointment.setStatus("PENDING_PAYMENT");
    
    // 5. Save to database
    Appointment saved = appointmentRepository.save(appointment);
    
    // 6. Convert to DTO
    return toResponse(saved);
}
```

**Step 5: Repository (AppointmentRepository)**
```java
// JPA automatically generates SQL:
INSERT INTO appointments (
    customer_profile_id, 
    barber_profile_id, 
    service_id, 
    shop_id,
    appointment_time, 
    status, 
    created_at
) VALUES (?, ?, ?, ?, ?, ?, ?);
```

**Step 6: Response sent back**
```json
{
  "id": 123,
  "customerProfileId": 10,
  "customerName": "John Doe",
  "barberProfileId": 5,
  "barberName": "Ahmed Hassan",
  "serviceId": 2,
  "serviceName": "Classic Haircut",
  "servicePrice": 150.00,
  "shopId": 1,
  "appointmentTime": "2024-05-15T10:00:00",
  "status": "PENDING_PAYMENT",
  "createdAt": "2024-05-10T14:30:00"
}
```

---

## SUMMARY

### Key Takeaways:

1. **Controllers**: Handle HTTP requests, validate input, call services
2. **Services**: Contain business logic, orchestrate operations
3. **Repositories**: Provide database access
4. **Entities**: Represent database tables
5. **DTOs**: Transfer data between layers
6. **Security**: JWT authentication, role-based authorization

### Layered Architecture:
```
Frontend  Controller  Service  Repository  Database
                           
              DTO       Entity
```

This architecture provides:
- **Separation of Concerns**: Each layer has specific responsibility
- **Testability**: Each layer can be tested independently
- **Maintainability**: Changes in one layer don't affect others
- **Security**: Multiple layers of validation and authorization

---

**Created by**: Suleyman Abdu Mohammed  
**Contact**: suleymanabdu0931@gmail.com | +251 931 798 929
