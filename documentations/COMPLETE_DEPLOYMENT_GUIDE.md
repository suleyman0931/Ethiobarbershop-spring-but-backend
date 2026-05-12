# 📚 Complete Deployment Guide - Ethio Barbershop

## 🎯 Project Overview

**Ethio Barbershop** is a full-stack barbershop management system with:
- **Backend:** Spring Boot (Java 21) with MySQL
- **Frontend:** Next.js (React) with TypeScript
- **Deployment:** Railway (Backend + Database) + Vercel (Frontend)

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Railway Backend Deployment](#railway-backend-deployment)
4. [Vercel Frontend Deployment](#vercel-frontend-deployment)
5. [Database Configuration](#database-configuration)
6. [Environment Variables](#environment-variables)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

### Required Accounts:
- ✅ GitHub account
- ✅ Railway account (sign up at https://railway.app)
- ✅ Vercel account (sign up at https://vercel.com)

### Required Software (for local development):
- Java 21 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher (XAMPP recommended for Windows)
- Git
- Maven (included in project via mvnw)

---

## 2. Local Development Setup

### 2.1 Clone Repositories

```bash
# Backend
git clone https://github.com/suleyman0931/Ethiobarbershop-spring-but-backend.git
cd Ethiobarbershop-spring-but-backend

# Frontend (in a separate terminal)
git clone https://github.com/suleyman0931/Ethiobarbershop-frontend-next.js.git
cd Ethiobarbershop-frontend-next.js
```

### 2.2 Setup Local Database

1. **Start MySQL** (via XAMPP or standalone)
2. **Create Database:**
   ```sql
   CREATE DATABASE barbershop;
   ```

3. **Configure Backend:**
   
   Edit `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/barbershop
   spring.datasource.username=root
   spring.datasource.password=
   ```

### 2.3 Run Backend Locally

```bash
cd backend
./mvnw spring-boot:run
```

Backend will start on: `http://localhost:8080`

### 2.4 Run Frontend Locally

```bash
cd frontend
npm install
npm run dev
```

Frontend will start on: `http://localhost:3000`

---

## 3. Railway Backend Deployment

### 3.1 Sign Up for Railway

1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Sign in with **GitHub**
4. Authorize Railway to access your repositories

### 3.2 Deploy Backend

#### Step 1: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: **`Ethiobarbershop-spring-but-backend`**
4. Railway auto-detects Java/Maven project

#### Step 2: Wait for Build
- Build time: 3-5 minutes
- Railway will run: `mvn clean package -DskipTests`
- Watch the build logs for any errors

#### Step 3: Add MySQL Database
1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add MySQL"**
3. Railway creates database instantly
4. Database credentials are auto-configured

#### Step 4: Configure Environment Variables

Click on backend service → **"Variables"** tab:

**Required Variables:**
```
DATABASE_URL = ${{MySQL.DATABASE_URL}}
PORT = 8080
JWT_SECRET = dGhpcyBpcyBhIHZlcnkgbG9uZyBzZWNyZXQga2V5IGZvciBiYXJiZXJzaG9wIGFwcA==
JWT_EXPIRATION = 86400000
JWT_REFRESH_EXPIRATION = 604800000
```

**Note:** `DATABASE_URL` is automatically set when you add MySQL database.

#### Step 5: Generate Public Domain
1. Click on backend service
2. Go to **"Settings"** tab
3. Scroll to **"Networking"**
4. Click **"Generate Domain"**
5. Copy your URL (e.g., `https://ethiobarbershop-backend-production.up.railway.app`)

### 3.3 Backend Configuration Files

**File: `backend/src/main/resources/application.properties`**
```properties
# Server
server.port=${PORT:8080}

# Database (uses Railway environment variables)
spring.datasource.url=${DATABASE_URL:jdbc:mysql://localhost:3306/barbershop}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# JWT
app.jwt.secret=${JWT_SECRET:dGhpcyBpcyBhIHZlcnkgbG9uZyBzZWNyZXQga2V5IGZvciBiYXJiZXJzaG9wIGFwcA==}
app.jwt.expiration-ms=${JWT_EXPIRATION:86400000}
app.jwt.refresh-expiration-ms=${JWT_REFRESH_EXPIRATION:604800000}
```

**File: `backend/nixpacks.toml`**
```toml
[phases.setup]
nixPkgs = ["...", "maven"]

[phases.build]
cmds = ["mvn clean package -DskipTests"]

[start]
cmd = "java -jar target/barbershop-backend-0.0.1-SNAPSHOT.jar"
```

**File: `backend/pom.xml` (Key Configuration)**
```xml
<packaging>jar</packaging>

<properties>
    <java.version>21</java.version>
</properties>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>
    <!-- Other dependencies... -->
</dependencies>
```

---

## 4. Vercel Frontend Deployment

### 4.1 Update Frontend Configuration

**IMPORTANT:** Before deploying, update the API URL with your Railway backend URL.

**File: `frontend/next.config.ts`**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // Replace with your actual Railway backend URL
        destination: "https://your-backend-url.railway.app/api/:path*",
      },
    ];
  },
  experimental: {
    proxyTimeout: 120_000,
  },
};

export default nextConfig;
```

**Commit and push this change:**
```bash
cd frontend
git add next.config.ts
git commit -m "Update API URL for production"
git push origin master
```

### 4.2 Deploy to Vercel

#### Step 1: Sign Up
1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Sign in with **GitHub**
4. Authorize Vercel

#### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Find: **`Ethiobarbershop-frontend-next.js`**
3. Click **"Import"**

#### Step 3: Configure Project Settings

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `frontend` (IMPORTANT!)
- Click **"Edit"** next to Root Directory
- Enter: `frontend`
- Click **"Continue"**

**Build Settings:**
- Build Command: `npm run build` (auto-set)
- Output Directory: `.next` (auto-set)
- Install Command: `npm install` (auto-set)

#### Step 4: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. You'll get a URL like: `https://ethiobarbershop.vercel.app`

### 4.3 Frontend Configuration Files

**File: `frontend/package.json`**
```json
{
  "name": "barbershop-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@tanstack/react-query": "^5.59.0",
    // ... other dependencies
  }
}
```

**File: `frontend/.env.local` (for local development)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## 5. Database Configuration

### 5.1 Railway MySQL Database

**Automatic Configuration:**
When you add MySQL in Railway, it automatically creates:

```
MYSQL_URL = mysql://root:password@host:port/railway
DATABASE_URL = mysql://root:password@host:port/railway
MYSQL_USER = root
MYSQL_PASSWORD = [auto-generated]
MYSQL_DATABASE = railway
MYSQL_HOST = [auto-generated]
MYSQL_PORT = 3306
```

### 5.2 Database Schema

The application uses **JPA/Hibernate** with `ddl-auto=update`, which means:
- ✅ Tables are created automatically on first run
- ✅ Schema updates are applied automatically
- ✅ No manual SQL scripts needed for basic setup

**Main Tables:**
- `users` - User accounts (customers, barbers, owners)
- `role_types` - User roles
- `barbers` - Barber profiles
- `customers` - Customer profiles
- `shops` - Barbershop locations
- `services` - Available services
- `appointments` - Booking records
- `payments` - Payment records
- `ratings` - Customer reviews
- `seats` - Barber seats/stations

### 5.3 Seed Data (Optional)

To add initial data, you can:

1. **Use DataSeeder class** (runs automatically on startup):
   - Located at: `backend/src/main/java/com/barbershop/DataSeeder.java`
   - Seeds roles, sample shops, services, and barbers

2. **Manual SQL scripts:**
   ```sql
   -- Example: Add a service
   INSERT INTO services (name, description, price, duration_minutes, active) 
   VALUES ('Haircut', 'Professional haircut', 150, 30, true);
   ```

### 5.4 Database Access

**Railway MySQL Access:**

1. **Via Railway Dashboard:**
   - Click on MySQL service
   - Go to **"Data"** tab
   - Use built-in database browser

2. **Via MySQL Client:**
   - Get credentials from Railway Variables tab
   - Use MySQL Workbench or command line:
   ```bash
   mysql -h [MYSQL_HOST] -P [MYSQL_PORT] -u root -p[MYSQL_PASSWORD] railway
   ```

3. **Via Application:**
   - Backend automatically connects using `DATABASE_URL`

---

## 6. Environment Variables

### 6.1 Backend Environment Variables (Railway)

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `DATABASE_URL` | MySQL connection string | `mysql://root:pass@host:3306/railway` |
| `PORT` | Server port | `8080` |
| `JWT_SECRET` | JWT signing secret | `dGhpcyBpcyBhIHZlcnkgbG9uZyBzZWNyZXQga2V5...` |
| `JWT_EXPIRATION` | Access token expiration (ms) | `86400000` (24 hours) |
| `JWT_REFRESH_EXPIRATION` | Refresh token expiration (ms) | `604800000` (7 days) |

**How to Set:**
1. Click on backend service in Railway
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Add name and value
5. Click **"Add"**

### 6.2 Frontend Environment Variables (Vercel)

Vercel doesn't need environment variables if you use `next.config.ts` rewrites.

**Optional (if using direct API calls):**

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://your-backend.railway.app` |

**How to Set:**
1. Go to Vercel project
2. Click **"Settings"**
3. Click **"Environment Variables"**
4. Add variable name and value
5. Select environments (Production, Preview, Development)
6. Click **"Save"**

---

## 7. Testing

### 7.1 Test Backend API

**Health Check:**
```bash
curl https://your-backend-url.railway.app/actuator/health
```

**Expected Response:**
```json
{"status":"UP"}
```

**Test Endpoints:**

1. **Get Barbers:**
   ```
   GET https://your-backend-url.railway.app/api/barbers
   ```

2. **Get Services:**
   ```
   GET https://your-backend-url.railway.app/api/services
   ```

3. **Get Shops:**
   ```
   GET https://your-backend-url.railway.app/api/shops
   ```

4. **Weather (Public):**
   ```
   GET https://your-backend-url.railway.app/api/external/weather
   ```

### 7.2 Test Frontend

1. **Open Frontend URL:**
   ```
   https://your-frontend.vercel.app
   ```

2. **Test Features:**
   - ✅ Homepage loads
   - ✅ Barbers display
   - ✅ Services display
   - ✅ Weather widget shows
   - ✅ Image gallery works
   - ✅ User registration
   - ✅ User login
   - ✅ Book appointment

### 7.3 Test Database Connection

**Check Railway Logs:**
1. Click on backend service
2. Click **"Deployments"**
3. Click on active deployment
4. Check logs for:
   ```
   HikariPool-1 - Start completed
   Started BarbershopBackendApplication in X seconds
   ```

**Check Database Tables:**
1. Click on MySQL service
2. Go to **"Data"** tab
3. Verify tables exist:
   - users
   - barbers
   - services
   - appointments
   - etc.

---

## 8. Troubleshooting

### 8.1 Backend Issues

#### Build Fails on Railway

**Error:** `BUILD FAILURE`

**Solutions:**
1. Check Java version in `pom.xml` (should be 21)
2. Check build logs for specific errors
3. Verify `nixpacks.toml` exists
4. Try rebuilding: Click **"Redeploy"**

#### Database Connection Error

**Error:** `Communications link failure`

**Solutions:**
1. Verify MySQL service is running in Railway
2. Check `DATABASE_URL` variable is set
3. Verify database credentials
4. Check Railway logs for connection errors

#### Application Won't Start

**Error:** `Application run failed`

**Solutions:**
1. Check for missing environment variables
2. Verify `PORT` variable is set
3. Check for Java exceptions in logs
4. Verify all dependencies in `pom.xml`

### 8.2 Frontend Issues

#### Build Fails on Vercel

**Error:** `No Next.js version detected`

**Solution:**
- Set **Root Directory** to `frontend` in Vercel settings

**Error:** `Module not found`

**Solutions:**
1. Check all imports are correct
2. Verify all files are committed to Git
3. Try clean rebuild (uncheck "Use existing Build Cache")

#### Can't Connect to Backend

**Error:** `Failed to fetch` or `Network error`

**Solutions:**
1. Verify backend URL in `next.config.ts`
2. Check CORS configuration in backend
3. Verify backend is running (check Railway)
4. Test backend URL directly in browser

#### CORS Errors

**Error:** `Access-Control-Allow-Origin`

**Solution:**
Update `backend/src/main/java/com/barbershop/modules/auth/security/CorsConfig.java`:

```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:3000",
    "https://your-frontend.vercel.app",
    "https://*.vercel.app"
));
```

### 8.3 Database Issues

#### Tables Not Created

**Solution:**
1. Check `spring.jpa.hibernate.ddl-auto=update` in application.properties
2. Check Railway logs for Hibernate errors
3. Verify database exists
4. Check MySQL service is running

#### Data Not Persisting

**Solution:**
1. Check transaction annotations (`@Transactional`)
2. Verify database connection is stable
3. Check for constraint violations in logs

---

## 9. Deployment Checklist

### Before Deployment:

- [ ] Backend code pushed to GitHub
- [ ] Frontend code pushed to GitHub
- [ ] Backend `application.properties` uses environment variables
- [ ] Frontend `next.config.ts` updated with backend URL
- [ ] All tests passing locally
- [ ] Database schema is correct

### Railway Backend:

- [ ] Project created
- [ ] Repository connected
- [ ] MySQL database added
- [ ] Environment variables set
- [ ] Build successful
- [ ] Application started
- [ ] Public domain generated
- [ ] API endpoints tested

### Vercel Frontend:

- [ ] Project imported
- [ ] Root directory set to `frontend`
- [ ] Build successful
- [ ] Deployment successful
- [ ] Frontend loads correctly
- [ ] API calls working

### Post-Deployment:

- [ ] Test all features end-to-end
- [ ] Verify database connections
- [ ] Check error logs
- [ ] Test user registration/login
- [ ] Test booking flow
- [ ] Verify payment submission

---

## 10. Monitoring & Maintenance

### Railway Monitoring

**View Logs:**
1. Click on service
2. Click **"Deployments"**
3. Click on deployment
4. View real-time logs

**Metrics:**
1. Click on service
2. Go to **"Metrics"** tab
3. View CPU, Memory, Network usage

### Vercel Monitoring

**View Logs:**
1. Go to project
2. Click **"Deployments"**
3. Click on deployment
4. Click **"Logs"**

**Analytics:**
1. Go to project
2. Click **"Analytics"** tab
3. View page views, performance

### Database Backups

**Railway MySQL:**
- Railway doesn't provide automatic backups on free tier
- Consider manual exports periodically
- Use `mysqldump` for backups

---

## 11. Cost Breakdown

| Service | Plan | Cost | Limits |
|---------|------|------|--------|
| **Railway** | Hobby | $5/month credit | 500 hours, 8GB RAM |
| **Vercel** | Hobby | FREE | 100GB bandwidth, unlimited deployments |
| **GitHub** | Free | FREE | Unlimited public repos |
| **Total** | | **$0/month** | (within free tier) |

---

## 12. URLs & Credentials

### Production URLs:

**Backend API:**
```
https://[your-project].up.railway.app
```

**Frontend:**
```
https://[your-project].vercel.app
```

**Database:**
```
Host: [from Railway]
Port: 3306
Database: railway
User: root
Password: [from Railway]
```

### GitHub Repositories:

**Backend:**
```
https://github.com/suleyman0931/Ethiobarbershop-spring-but-backend
```

**Frontend:**
```
https://github.com/suleyman0931/Ethiobarbershop-frontend-next.js
```

---

## 13. Support & Resources

### Documentation:
- **Spring Boot:** https://spring.io/projects/spring-boot
- **Next.js:** https://nextjs.org/docs
- **Railway:** https://docs.railway.app
- **Vercel:** https://vercel.com/docs

### Community:
- **Railway Discord:** https://discord.gg/railway
- **Vercel Discord:** https://discord.gg/vercel
- **Stack Overflow:** Tag questions with `spring-boot`, `next.js`

---

## 14. Next Steps

### Enhancements:
1. Add custom domain
2. Set up SSL certificates (Vercel provides free)
3. Implement error tracking (Sentry)
4. Add monitoring (New Relic, Datadog)
5. Set up CI/CD pipelines
6. Add automated tests
7. Implement database backups
8. Add caching (Redis)
9. Optimize images
10. Add analytics

### Security:
1. Rotate JWT secrets regularly
2. Implement rate limiting
3. Add input validation
4. Enable HTTPS only
5. Implement CSRF protection
6. Add security headers
7. Regular dependency updates
8. Security audits

---

## 📞 Contact

For issues or questions:
- **GitHub Issues:** Create issue in respective repository
- **Email:** suleymanabdu0931@gmail.com

---

**Last Updated:** May 9, 2026

**Version:** 1.0.0

---

## ✅ Deployment Complete!

Your Ethio Barbershop application is now live! 🎉

- **Backend:** Running on Railway with MySQL
- **Frontend:** Running on Vercel
- **Database:** MySQL on Railway

Enjoy your deployed application! 🚀
