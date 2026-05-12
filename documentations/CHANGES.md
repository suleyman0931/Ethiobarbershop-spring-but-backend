# Changes Made to Get the Project Running

## Backend

### 1. `application.properties` (created)
`backend/src/main/resources/application.properties`

This file was missing entirely (gitignored). Created it with:
- Server port: `8443` with SSL enabled
- MySQL datasource config pointing to `barbershop_db`
- JPA/Hibernate config with `ddl-auto=update` (auto-creates tables)
- JWT secret and expiration config

### 2. SSL Configuration
Used the existing `keystore.p12` file in resources. The alias inside it is `barbershop` and the password is `password123`. Configured in `application.properties`:
```
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=password123
server.ssl.key-alias=barbershop
```
Backend runs on `https://localhost:8443`.

### 3. Missing `serviceImpl` package — Auth module
`backend/src/main/java/com/barbershop/modules/auth/serviceImpl/`

Three classes were missing that the entire codebase depended on:

- **`UserDetailsImpl`** — Wraps the `User` entity as a Spring Security `UserDetails` object. Used as the authenticated principal throughout all controllers.
- **`UserDetailsServiceImpl`** — Implements Spring's `UserDetailsService`. Loads a user from the DB by username during login.
- **`RefreshTokenService`** — Handles creating, verifying expiry, and deleting JWT refresh tokens.

### 4. Missing `serviceImpl` classes — All feature modules
Every module had a service interface but no implementation. Created:

- **`AppointmentServiceImpl`** — Books, confirms, approves, cancels, completes appointments. Maps between `Appointment` entity and `AppointmentResponse` DTO.
- **`BarberServiceImpl`** — CRUD for barber profiles. Looks up by userId or barberId.
- **`CustomerServiceImpl`** — CRUD for customer profiles. Linked to the auth `User` entity.
- **`OwnerServiceImpl`** — CRUD for owner profiles. Linked to the auth `User` entity.
- **`PaymentServiceImpl`** — Submits payments, verifies/rejects them, updates appointment status accordingly.
- **`RatingServiceImpl`** — Creates ratings for completed appointments, fetches barber ratings and summary.
- **`ServiceServiceImpl`** — CRUD for barbershop services (haircut types, prices, durations).
- **`ShopServiceImpl`** — CRUD for shops, scoped to owner.
- **`SeatServiceImpl`** — CRUD for seats within a shop, assigns seats to barber associations.
- **`ShopApplicationServiceImpl`** — Barbers apply to shops, owners approve/reject. Creates `BarberShopAssociation` on approval.
- **`BarberAssociationServiceImpl`** — Terminates a barber-shop association.
- **`ImageServiceImpl`** — Handles file uploads to disk, links images to owners/barbers/customers/shops.

### 5. Maven Wrapper fix
The `.mvn/wrapper/maven-wrapper.properties` file was missing. Fixed by setting `JAVA_HOME` to Java 21/23 so Maven uses the correct JDK.

---

## Frontend

### 6. `.env.local` (created)
`frontend/.env.local`

```
NEXT_PUBLIC_API_URL=https://localhost:8443/api
```

Points the frontend API client to the backend.

### 7. Missing `*.service.impl.ts` files — All frontend modules
Same pattern as the backend — interfaces existed but implementations were missing. Created:

- **`customer.service.impl.ts`** — Calls `/customers/me` endpoints (create, get, update, delete).
- **`barber.service.impl.ts`** — Calls `/barbers` and `/barbers/me` endpoints.
- **`owner.service.impl.ts`** — Calls `/owners/me` endpoints.
- **`shop.service.impl.ts`** — Calls `/shops` endpoints including owner-scoped shop listing.
- **`seat.service.impl.ts`** — Calls `/shops/{shopId}/seats` endpoints including barber assignment.
- **`image.service.impl.ts`** — Handles multipart file uploads to `/images/*` endpoints using `FormData`.
