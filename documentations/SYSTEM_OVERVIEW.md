# EthioBarbershop — System Overview

## What the System Does

EthioBarbershop is a full-stack barbershop management platform built for the Ethiopian market (Addis Ababa). It allows barbershop owners to manage their branches, barbers, and services. Customers can browse shops, book appointments, submit payments, and get hairstyle recommendations. Barbers manage their own appointments and profiles.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Zustand, React Query |
| Backend | Spring Boot 3.2.5, Java 21, Spring Security, JWT |
| Database | MySQL |
| Auth | JWT (access token) + Refresh token |
| SSL | PKCS12 keystore (`keystore.p12`) |
| External APIs | Open-Meteo (weather), Unsplash (hairstyle images) |

---

## User Roles

There are 3 roles in the system. Each role has different permissions and access to different parts of the app.

| Role | How to get it | What they can do |
|---|---|---|
| `ROLE_CUSTOMER` | Public signup | Browse shops, book appointments, submit payments, rate barbers, get hairstyle recommendations |
| `ROLE_BARBER` | Assigned by owner via register-barber | Manage own profile, manage appointments, apply to shops |
| `ROLE_OWNER` | Seeded in DB manually | Manage shops/branches, manage barbers, verify payments, view all appointments per branch |

> Public signup always creates a CUSTOMER. Owners and Barbers are created differently (see below).

---

## Seed Data (First Run)

On first startup, `DataSeeder.java` automatically populates the database with:

- 3 roles: OWNER, BARBER, CUSTOMER
- 1 owner account: `owner1` / `owner123`
- 3 barber accounts: `barber1`, `barber2`, `barber3` / `barber123`
- 5 customer accounts: `customer1`–`customer5` / `customer123`
- 3 shop branches: Downtown, Piazza, Megenagna
- 6 seats (2 per branch)
- 7 services: Haircut, Haircut+Beard, Beard Trim, Hair Coloring, Kids Haircut, Shave, Hair Treatment

---

## System Architecture

```
Browser (Next.js :3000)
        │
        │  HTTPS requests to /api/*
        ▼
Spring Boot Backend (:8443)
        │
        ├── Spring Security (JWT filter on every request)
        │
        ├── Controllers → Services → Repositories
        │
        └── MySQL Database
```

The frontend and backend are separate applications. The frontend calls the backend REST API using `NEXT_PUBLIC_API_URL=https://localhost:8443/api`.

---

## Authentication Flow

```
1. User submits username + password to POST /api/auth/login
2. Backend validates credentials, returns:
   - accessToken  (JWT, expires in 24h)
   - refreshToken (UUID, expires in 7 days)
3. Frontend stores both tokens in localStorage
4. Every API request includes: Authorization: Bearer <accessToken>
5. If a request returns 401, frontend auto-calls POST /api/auth/refresh-token
6. If refresh fails, user is redirected to /login
7. Logout calls POST /api/auth/logout which deletes the refresh token from DB
```

---

## Core Workflows

### 1. Customer Books an Appointment

```
Customer → Browse shops (GET /api/shops)
         → Pick a barber (GET /api/barbers/shop/{shopId})
         → Pick a service (GET /api/services/active)
         → Book (POST /api/appointments/book)
              → Appointment created with status: PENDING_PAYMENT
         → Submit payment (POST /api/payments/submit)
              → Payment created with status: PENDING
              → Appointment status → PAYMENT_SUBMITTED
```

### 2. Owner Verifies Payment

```
Owner → View pending payments (GET /api/payments/pending)
      → Verify (PUT /api/payments/{id}/verify)
           → Payment status → VERIFIED
           → Appointment status → CONFIRMED
      OR
      → Reject (PUT /api/payments/{id}/reject)
           → Payment status → REJECTED
           → Appointment status → PAYMENT_REJECTED
```

### 3. Barber Manages Appointment

```
Barber → View appointments (GET /api/appointments/my)
       → Approve (PUT /api/appointments/{id}/approve)
            → Appointment status → ASSIGNED_TO_BARBER
       → Complete (PUT /api/appointments/{id}/complete)
            → Appointment status → COMPLETED
       → Cancel (PUT /api/appointments/{id}/cancel)
            → Appointment status → CANCELED
```

### 4. Customer Rates a Barber

```
Customer → After appointment is COMPLETED
         → Submit rating (POST /api/ratings)
              → Rating score (1–5) + optional review text
              → Linked to the specific appointment (one rating per appointment)
```

### 5. Barber Applies to a Shop

```
Barber → Browse shops (GET /api/shops)
       → Apply (POST /api/shops/{shopId}/applications)
            → Application created with status: PENDING
Owner  → View applications (GET /api/shops/{shopId}/applications)
       → Approve (POST /api/shops/{shopId}/applications/{id}/approve)
            → BarberShopAssociation created
            → Application status → APPROVED
       OR
       → Reject (POST /api/shops/{shopId}/applications/{id}/reject)
            → Application status → REJECTED
```

### 6. Appointment Status Lifecycle

```
PENDING_PAYMENT
      │
      ▼ (customer submits payment)
PAYMENT_SUBMITTED
      │
      ├──▶ CONFIRMED (owner verifies payment)
      │         │
      │         ▼ (barber approves)
      │    ASSIGNED_TO_BARBER
      │         │
      │         ▼ (barber completes)
      │       COMPLETED ──▶ (customer can now rate)
      │
      └──▶ PAYMENT_REJECTED (owner rejects payment)

Any status ──▶ CANCELED (barber or customer cancels)
```

---

## Payment Methods

The system supports two Ethiopian mobile payment methods:
- **TeleBirr** — Mobile money transfer
- **CBE Birr** — Commercial Bank of Ethiopia mobile banking

Customers submit a transaction ID and/or screenshot as proof. The owner manually verifies.

---

## External Features

### Weather Widget
- Endpoint: `GET /api/external/weather` (public, no auth)
- Uses the free Open-Meteo API — no API key needed
- Returns current weather for Addis Ababa (temperature, condition, wind, humidity)
- Displayed on the home page with a barbershop-relevant message (e.g. "Rainy day? Perfect time to book!")

### Hairstyle Recommendations
- Endpoint: `POST /api/external/hairstyle-recommendations` (requires CUSTOMER role)
- Customer uploads a photo
- Returns a curated gallery of 6 hairstyle recommendations with images from Unsplash
- Designed to be replaced with a real AI API (Replicate, AILabTools) in production

---

## Backend Module Structure

Each feature is a self-contained module under `com.barbershop.modules.*`:

```
modules/
├── auth/         — Login, signup, JWT, refresh tokens, roles
├── appointment/  — Booking and appointment lifecycle
├── barber/       — Barber profiles
├── customer/     — Customer profiles
├── owner/        — Owner profiles
├── shop/         — Shops, seats, barber applications, associations
├── service/      — Barbershop services (haircut types, prices)
├── payment/      — Payment submission and verification
├── rating/       — Customer ratings for barbers
├── image/        — File upload for profile/shop images
├── external/     — Weather and hairstyle recommendation APIs
└── shared/       — Common exceptions, utilities, base models
```

Each module follows the same pattern:
- `controller/` — HTTP endpoints
- `service/` — interface defining business logic
- `serviceImpl/` — actual implementation
- `repository/` — database access (Spring Data JPA)
- `model/entity/` — JPA database entities
- `model/enums/` — typed enumerations
- `dto/request/` — incoming request shapes
- `dto/response/` — outgoing response shapes

---

## Frontend Structure

```
src/
├── app/              — Next.js pages (App Router)
│   ├── (auth)/       — Login and signup pages
│   ├── appointments/ — Appointment list and booking
│   ├── barbers/      — Barber dashboard and profile
│   ├── customers/    — Customer profile and hairstyle recommendations
│   ├── owners/       — Owner dashboard, branches, barbers, payments, services
│   └── shops/        — Shop listing and detail pages
├── modules/          — Feature modules (services + types)
├── components/       — Shared UI components
├── hooks/            — React Query hooks for data fetching
├── stores/           — Zustand auth store (tokens, user info)
├── api/              — Raw API call functions
├── schemas/          — Zod validation schemas
└── lib/              — API client with auto token refresh
```

---

## API Security Summary

| Endpoint pattern | Who can access |
|---|---|
| `POST /api/auth/**` | Public |
| `GET /api/shops`, `GET /api/shops/*` | Public |
| `GET /api/services`, `GET /api/services/active` | Public |
| `GET /api/barbers`, `GET /api/barbers/shop/*` | Public |
| `GET /api/external/weather` | Public |
| `/api/customers/**` | CUSTOMER only |
| `/api/barbers/me`, `/api/barbers/**` | BARBER only |
| `/api/owners/**` | OWNER only |
| `/api/appointments/book` | CUSTOMER |
| `/api/appointments/{id}/confirm,complete` | BARBER |
| `/api/payments/submit` | CUSTOMER |
| `/api/payments/pending`, `verify`, `reject` | OWNER |
| `/api/external/hairstyle-recommendations` | CUSTOMER |
| `/api/admin/**` | ADMIN (not yet implemented) |

---

## Running the System

### Backend
```powershell
cd backend
mvn spring-boot:run
# Runs on https://localhost:8443
```

### Frontend
```powershell
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### Health check
```
https://localhost:8443/actuator/health  →  {"status":"UP"}
```

> Note: The backend uses a self-signed SSL certificate. Browsers will show a security warning on first visit — click "Advanced" and proceed. This is expected for local development.
