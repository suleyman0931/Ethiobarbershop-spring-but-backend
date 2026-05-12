# Barbershop Application - Test Credentials

## Database Information
- **Database Name**: Check your `application.properties` file
- **Host**: localhost
- **Port**: 3306

---

## Owner Account (1)

### Owner 1
- **Username**: `owner1`
- **Password**: `owner123`
- **Email**: owner@barbershop.com
- **Phone**: 0911111111
- **Business Name**: Premium Barbershop
- **Business License**: BL-2024-001
- **Role**: OWNER

**Capabilities**:
- Manage all 3 shops
- View and verify payments
- Manage services
- Register barbers
- View all appointments

---

## Barber Accounts (3)

### Barber 1 - Ahmed Hassan
- **Username**: `barber1`
- **Password**: `barber123`
- **Email**: barber1@barbershop.com
- **Phone**: 0922111111
- **Full Name**: Ahmed Hassan
- **Experience**: 5 years
- **Specialization**: Classic Cuts & Beard Styling
- **Bio**: Expert in traditional and modern haircuts
- **Shop**: Downtown Branch
- **Seat**: Seat 1
- **Role**: BARBER

### Barber 2 - Dawit Tesfaye
- **Username**: `barber2`
- **Password**: `barber123`
- **Email**: barber2@barbershop.com
- **Phone**: 0922222222
- **Full Name**: Dawit Tesfaye
- **Experience**: 7 years
- **Specialization**: Hair Coloring & Styling
- **Bio**: Specialist in modern styles and hair coloring
- **Shop**: Piazza Branch
- **Seat**: Seat 1
- **Role**: BARBER

### Barber 3 - Samuel Bekele
- **Username**: `barber3`
- **Password**: `barber123`
- **Email**: barber3@barbershop.com
- **Phone**: 0922333333
- **Full Name**: Samuel Bekele
- **Experience**: 4 years
- **Specialization**: Kids Haircuts & Shaving
- **Bio**: Friendly barber specializing in kids and family cuts
- **Shop**: Megenagna Branch
- **Seat**: Seat 1
- **Role**: BARBER

---

## Customer Accounts (5)

### Customer 1 - Abebe Kebede
- **Username**: `customer1`
- **Password**: `customer123`
- **Email**: customer1@email.com
- **Phone**: 0933111111
- **Full Name**: Abebe Kebede
- **Date of Birth**: May 15, 1990
- **Role**: CUSTOMER

### Customer 2 - Meron Tadesse
- **Username**: `customer2`
- **Password**: `customer123`
- **Email**: customer2@email.com
- **Phone**: 0933222222
- **Full Name**: Meron Tadesse
- **Date of Birth**: August 22, 1995
- **Role**: CUSTOMER

### Customer 3 - Yohannes Alemu
- **Username**: `customer3`
- **Password**: `customer123`
- **Email**: customer3@email.com
- **Phone**: 0933333333
- **Full Name**: Yohannes Alemu
- **Date of Birth**: December 10, 1988
- **Role**: CUSTOMER

### Customer 4 - Hanna Girma
- **Username**: `customer4`
- **Password**: `customer123`
- **Email**: customer4@email.com
- **Phone**: 0933444444
- **Full Name**: Hanna Girma
- **Date of Birth**: March 18, 1992
- **Role**: CUSTOMER

### Customer 5 - Tigist Haile
- **Username**: `customer5`
- **Password**: `customer123`
- **Email**: customer5@email.com
- **Phone**: 0933555555
- **Full Name**: Tigist Haile
- **Date of Birth**: July 25, 1993
- **Role**: CUSTOMER

---

## Shop/Branch Information (3)

### Shop 1 - Downtown Branch
- **Name**: Downtown Branch
- **Address**: Bole Road, Addis Ababa
- **Phone**: 0911222222
- **Seats**: 2 seats
- **Assigned Barber**: Ahmed Hassan (Seat 1)

### Shop 2 - Piazza Branch
- **Name**: Piazza Branch
- **Address**: Piazza Area, Addis Ababa
- **Phone**: 0911333333
- **Seats**: 2 seats
- **Assigned Barber**: Dawit Tesfaye (Seat 1)

### Shop 3 - Megenagna Branch
- **Name**: Megenagna Branch
- **Address**: Megenagna, Addis Ababa
- **Phone**: 0911444444
- **Seats**: 2 seats
- **Assigned Barber**: Samuel Bekele (Seat 1)

---

## Available Services

1. **Haircut** - 150 ETB (30 minutes) - Standard men's haircut with styling
2. **Haircut + Beard Trim** - 200 ETB (45 minutes) - Complete haircut with professional beard styling
3. **Beard Trim Only** - 80 ETB (20 minutes) - Professional beard shaping and trimming
4. **Hair Coloring** - 300 ETB (60 minutes) - Professional hair coloring service
5. **Kids Haircut** - 100 ETB (25 minutes) - Haircut for children under 12 years
6. **Shave** - 120 ETB (30 minutes) - Traditional straight razor shave
7. **Hair Treatment** - 250 ETB (45 minutes) - Deep conditioning and hair treatment

---

## Payment Methods

### TeleBirr
- **Account Number**: 0931798929

### CBE Birr
- **Account Number**: 1000747483047

---

## How the Data Seeder Works

The `DataSeeder.java` file automatically seeds the database when you start the backend application **for the first time**. 

### Automatic Seeding Process:

1. **First Run**: When you start the backend with a fresh database, `DataSeeder` checks if roles exist
2. **If no roles found**: It seeds all the test data (users, shops, services, etc.)
3. **If roles exist**: It skips seeding and prints "Data already exists, skipping seed."

### To Reset and Re-seed:

If you want to reset the database and re-seed with fresh data:

1. **Stop the backend application**

2. **Drop and recreate the database**:
   ```sql
   DROP DATABASE barbershop;
   CREATE DATABASE barbershop;
   ```

3. **Start the backend application** - It will:
   - Create all tables using JPA/Hibernate (ddl-auto=update)
   - Run DataSeeder to populate test data automatically

4. **Login with the credentials above**

### Alternative: Manual SQL Script

You can also use the `cleanup_and_seed_data.sql` script to manually seed data:

```bash
mysql -u root -p barbershop < backend/cleanup_and_seed_data.sql
```

---

## Quick Test Workflow

1. **Login as Customer** (customer1 / customer123)
   - Browse barbers on home page
   - Book an appointment
   - Submit payment with transaction ID or screenshot

2. **Login as Owner** (owner1 / owner123)
   - View pending payments
   - Verify or reject payments
   - Manage services
   - View all appointments
   - Manage shops

3. **Login as Barber** (barber1 / barber123)
   - View assigned appointments
   - Update appointment status

---

## Notes

- All passwords are simple for development: owner123, barber123, customer123
- The DataSeeder runs automatically on first startup
- All 7 services are created automatically
- 3 shops with 6 total seats are created
- Barbers are pre-assigned to specific seats
- Database will auto-seed when backend starts with empty database!

---

## Security Reminder

⚠️ **These are test credentials for development only!**

Do not use these credentials in production. Always:
- Use strong, unique passwords
- Enable proper authentication mechanisms
- Implement rate limiting
- Use HTTPS in production
- Regularly rotate credentials
