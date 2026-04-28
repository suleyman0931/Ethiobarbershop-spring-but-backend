# EthioBarber — Barbershop Booking System

A full-stack barbershop management platform built for Ethiopian barbershops. Customers can browse barbers, book appointments, and submit payments. Owners manage branches, barbers, and verify payments. Barbers track their schedule and mark appointments complete.

---

## What It Does

### For Customers
- Browse barbers and services on the home page
- Book an appointment by selecting a branch, barber, service, date, and time
- Submit payment proof (transaction ID or screenshot) as part of booking
- Track booking status in real time — Pending Payment → Payment Under Review → Payment Approved
- Rate and review barbers after completed appointments
- Get AI-powered hairstyle recommendations from a photo

### For Owners
- Manage multiple barbershop branches
- Register barbers and assign them to specific branches
- Verify or reject customer payments
- Manage services (name, price, duration)
- View all appointments per branch

### For Barbers
- View their appointment schedule filtered by status
- Mark confirmed appointments as completed
- Manage their profile (skills, experience, summary)

---

## Booking Flow

```
Customer books → PENDING_PAYMENT
Customer submits payment → PAYMENT_SUBMITTED
Owner verifies payment → CONFIRMED  ✓ (customer sees "Payment Approved")
Barber marks done → COMPLETED
```

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Java 17 | Core language |
| Spring Boot 3 | REST API framework |
| Spring Security + JWT | Authentication & role-based access |
| Spring Data JPA / Hibernate | Database ORM |
| MySQL | Relational database |
| Maven | Build tool |

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 15 (App Router) | React framework with SSR |
| TypeScript | Type-safe JavaScript |
| Tailwind CSS | Utility-first styling |
| TanStack Query | Server state management & caching |
| Zustand | Client auth state |
| React Hook Form | Form handling & validation |
| Zod | Schema validation |
| Lucide React | Icons |

---

## Project Structure

```
barbershop/
├── backend/                  # Spring Boot API
│   └── src/main/java/com/barbershop/modules/
│       ├── auth/             # JWT login, signup, refresh tokens
│       ├── appointment/      # Booking lifecycle management
│       ├── barber/           # Barber profiles & branch assignment
│       ├── customer/         # Customer profiles
│       ├── owner/            # Owner profiles & barber registration
│       ├── payment/          # Payment submission & verification
│       ├── rating/           # Star ratings after appointments
│       ├── service/          # Haircut services (name, price, duration)
│       ├── shop/             # Branches, seats, associations
│       ├── image/            # Image upload for profiles
│       └── external/         # AI hairstyle recommendation service
│
└── frontend/                 # Next.js application
    └── src/
        ├── app/              # Pages (Next.js App Router)
        │   ├── (auth)/       # Login & signup
        │   ├── appointments/ # Customer bookings
        │   ├── barbers/      # Barber dashboard & profile
        │   ├── owners/       # Owner dashboard, branches, payments
        │   └── customers/    # Customer profile & hairstyle AI
        ├── components/       # Reusable UI components
        ├── modules/          # Feature modules (services, types)
        ├── hooks/            # React Query hooks
        ├── stores/           # Zustand auth store
        └── api/              # API client functions
```

---

## Roles & Permissions

| Role | Capabilities |
|---|---|
| `CUSTOMER` | Book appointments, submit payments, rate barbers |
| `BARBER` | View schedule, complete appointments, manage profile |
| `OWNER` | Manage branches, register barbers, verify payments, manage services |

---

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+

### Backend
```bash
cd backend
# Configure database in src/main/resources/application.properties
./mvnw spring-boot:run
```

The backend auto-seeds the database on first run with 1 owner, 3 barbers, 5 customers, 3 branches, and 7 services.

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## SSL / HTTPS

SSL is **disabled by default** for local development. The backend runs on `http://localhost:8080`.

To enable HTTPS for production:

1. Generate a keystore:
```bash
keytool -genkeypair -alias barbershop -keyalg RSA -keysize 2048 \
        -storetype PKCS12 -keystore keystore.p12 -validity 3650
```

2. Place `keystore.p12` in `backend/src/main/resources/`

3. Uncomment and configure in `application.properties`:
```properties
server.port=8443
server.ssl.enabled=true
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=YOUR_PASSWORD
server.ssl.key-store-type=PKCS12
server.ssl.key-alias=barbershop
```

For production, use a real certificate from **Let's Encrypt** (free) or a CA-signed certificate instead of a self-signed keystore.

---

## Test Credentials

| Role | Username | Password |
|---|---|---|
| Owner | `owner1` | `owner123` |
| Barber 1 | `barber1` | `barber123` |
| Barber 2 | `barber2` | `barber123` |
| Barber 3 | `barber3` | `barber123` |
| Customer | `customer1` | `customer123` |

---

## Payment Methods (Test)

| Method | Account |
|---|---|
| TeleBirr | 0931798929 |
| CBE Birr | 1000747483047 |

---

## API Overview

| Endpoint | Description |
|---|---|
| `POST /api/auth/signup` | Register new user |
| `POST /api/auth/login` | Login, returns JWT |
| `GET /api/barbers` | List all barbers (public) |
| `GET /api/barbers/shop/{shopId}` | Barbers by branch |
| `GET /api/shops` | List all branches (public) |
| `GET /api/services/active` | Active services (public) |
| `POST /api/appointments/book` | Book appointment |
| `POST /api/payments/submit` | Submit payment proof |
| `GET /api/payments/pending` | Pending payments (owner) |
| `PUT /api/payments/{id}/verify` | Approve payment (owner) |
| `PUT /api/payments/{id}/reject` | Reject payment (owner) |
| `PUT /api/appointments/{id}/complete` | Mark complete (barber) |
| `POST /api/ratings` | Submit rating (customer) |

---

