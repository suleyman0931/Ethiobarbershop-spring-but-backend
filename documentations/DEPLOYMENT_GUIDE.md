# 🚀 Deployment Guide - Railway + Vercel

## Overview
- **Backend (Spring Boot):** Railway.app
- **Frontend (Next.js):** Vercel.com
- **Database (MySQL):** Railway.app

---

## 📋 Prerequisites

1. GitHub account (you already have this ✅)
2. Railway account (sign up with GitHub)
3. Vercel account (sign up with GitHub)

---

## Part 1: Deploy Backend to Railway

### Step 1: Sign Up for Railway

1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Sign in with your GitHub account
4. Authorize Railway to access your repositories

### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: **`Ethiobarbershop-spring-but-backend`**
4. Railway will automatically detect it's a Java/Maven project

### Step 3: Add MySQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add MySQL"**
3. Railway will create a MySQL database automatically
4. The database URL will be automatically set as `DATABASE_URL`

### Step 4: Configure Environment Variables

Railway should auto-configure most variables, but verify these:

Click on your backend service → **"Variables"** tab:

```
DATABASE_URL=mysql://... (auto-set by Railway)
DB_USERNAME=root (auto-set)
DB_PASSWORD=... (auto-set)
PORT=8080
JWT_SECRET=dGhpcyBpcyBhIHZlcnkgbG9uZyBzZWNyZXQga2V5IGZvciBiYXJiZXJzaG9wIGFwcA==
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000
```

### Step 5: Deploy

1. Railway will automatically build and deploy
2. Wait for deployment to complete (2-5 minutes)
3. Once deployed, click on your service
4. Click **"Settings"** → **"Generate Domain"**
5. Copy your backend URL (e.g., `https://ethiobarbershop-backend.up.railway.app`)

### Step 6: Test Backend

Open in browser:
```
https://your-backend-url.railway.app/api/barbers
https://your-backend-url.railway.app/api/services
```

You should see JSON responses!

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update Frontend Configuration

Before deploying, we need to update the API URL in your frontend.

**Update `frontend/next.config.ts`:**

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

### Step 2: Sign Up for Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Sign in with your GitHub account
4. Authorize Vercel to access your repositories

### Step 3: Import Project

1. Click **"Add New..."** → **"Project"**
2. Find and select: **`Ethiobarbershop-frontend-next.js`**
3. Click **"Import"**

### Step 4: Configure Project

Vercel will auto-detect Next.js settings:

- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `./` (leave as is)
- **Build Command:** `npm run build` (auto-set)
- **Output Directory:** `.next` (auto-set)

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. Once complete, you'll get a URL like: `https://ethiobarbershop.vercel.app`

### Step 6: Test Frontend

1. Open your Vercel URL in browser
2. You should see your barbershop homepage
3. Test features:
   - View barbers
   - View services
   - Weather widget
   - Image gallery
   - Book appointment (if logged in)

---

## Part 3: Configure CORS (If Needed)

If you get CORS errors, update your backend CORS configuration:

**File:** `backend/src/main/java/com/barbershop/modules/auth/security/CorsConfig.java`

Add your Vercel URL to allowed origins:

```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:3000",
    "https://ethiobarbershop.vercel.app",  // Add your Vercel URL
    "https://*.vercel.app"  // Allow all Vercel preview deployments
));
```

Commit and push:
```bash
cd backend
git add .
git commit -m "Update CORS for production"
git push origin master
```

Railway will auto-redeploy.

---

## 🎉 Your App is Live!

### URLs:
- **Frontend:** https://ethiobarbershop.vercel.app
- **Backend API:** https://your-backend-url.railway.app
- **Database:** Managed by Railway

### Test Everything:
1. ✅ Homepage loads
2. ✅ Barbers display
3. ✅ Services display
4. ✅ Weather widget works
5. ✅ Image gallery works
6. ✅ User registration
7. ✅ User login
8. ✅ Book appointment
9. ✅ Payment submission

---

## 📊 Monitoring & Logs

### Railway (Backend):
1. Go to your Railway project
2. Click on your backend service
3. Click **"Deployments"** to see build logs
4. Click **"Logs"** to see runtime logs

### Vercel (Frontend):
1. Go to your Vercel project
2. Click on your deployment
3. Click **"Logs"** to see build and runtime logs

---

## 💰 Cost

- **Railway:** $5/month free credit (enough for small apps)
- **Vercel:** Completely FREE for personal projects
- **Total:** $0/month (within free tier limits)

---

## 🔄 Automatic Deployments

Both Railway and Vercel are now connected to your GitHub repos:

- **Push to backend repo** → Railway auto-deploys
- **Push to frontend repo** → Vercel auto-deploys

No manual deployment needed!

---

## 🐛 Troubleshooting

### Backend won't start:
1. Check Railway logs for errors
2. Verify DATABASE_URL is set
3. Check Java version (should be 21)

### Frontend can't connect to backend:
1. Verify backend URL in `next.config.ts`
2. Check CORS configuration
3. Test backend URL directly in browser

### Database connection errors:
1. Verify MySQL service is running in Railway
2. Check DATABASE_URL format
3. Ensure database credentials are correct

### 500 errors:
1. Check Railway backend logs
2. Look for Java exceptions
3. Verify all environment variables are set

---

## 📝 Next Steps

1. **Custom Domain:** Add your own domain in Vercel settings
2. **SSL Certificate:** Vercel provides free SSL automatically
3. **Environment Variables:** Add production-specific configs
4. **Monitoring:** Set up error tracking (Sentry, etc.)
5. **Backups:** Configure database backups in Railway

---

## 🎓 For Your Teacher

Show both deployment methods:

1. **Local Tomcat** (Traditional Enterprise)
   - Demonstrates WAR deployment
   - Shows SSL configuration
   - Enterprise-grade setup

2. **Railway + Vercel** (Modern Cloud)
   - Demonstrates microservices architecture
   - Shows CI/CD pipeline
   - Cloud-native deployment
   - Automatic scaling

This shows you understand both traditional and modern deployment strategies!

---

## 📞 Support

- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **Railway Discord:** https://discord.gg/railway
- **Vercel Discord:** https://discord.gg/vercel

---

Good luck with your deployment! 🚀
