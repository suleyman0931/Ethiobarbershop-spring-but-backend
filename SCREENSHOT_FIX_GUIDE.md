# Screenshot 404 Error Fix Guide

## Problem
When viewing payment screenshots in the owner dashboard, you're getting a 404 error with the message:
```
404: NOT_FOUND
Code: DNS_HOSTNAME_RESOLVED_PRIVATE
```

This happens because the backend was storing image URLs as **relative paths** (e.g., `/api/images/files/abc-123.jpg`) instead of **absolute URLs** with the full backend domain.

## What Was Changed

### 1. Backend Code Changes
- **File**: `backend/src/main/resources/application.properties`
  - Added `app.base-url` configuration property
  
- **File**: `backend/src/main/java/com/barbershop/modules/image/service/ImageServiceImpl.java`
  - Modified to inject the base URL
  - Updated `storeFile()` method to generate absolute URLs

### 2. What You Need to Do

#### Step 1: Set Environment Variable in Railway

You need to add the `APP_BASE_URL` environment variable to your Railway backend deployment:

1. Go to your Railway dashboard
2. Select your backend service: **ethiobarbershop-spring-but-backend-production**
3. Go to the **Variables** tab
4. Add a new variable:
   - **Name**: `APP_BASE_URL`
   - **Value**: `https://ethiobarbershop-spring-but-backend-production.up.railway.app`

5. Click **Save** or **Deploy** to apply the changes

#### Step 2: Redeploy the Backend

After setting the environment variable:

1. Commit and push the code changes to your repository
2. Railway will automatically redeploy your backend
3. Or manually trigger a redeploy from the Railway dashboard

#### Step 3: Test the Fix

1. **For New Screenshots**: 
   - Book a new appointment and upload a payment screenshot
   - Login as owner and check if the screenshot displays correctly

2. **For Existing Screenshots** (Optional):
   - Existing screenshots in the database still have relative URLs
   - They won't work until customers re-upload them
   - OR you can run a database migration to update existing URLs (see below)

## Optional: Fix Existing Screenshots in Database

If you want to fix existing screenshots without requiring customers to re-upload, you can run this SQL query:

```sql
-- Update existing image URLs to include the full base URL
UPDATE images 
SET file_url = CONCAT('https://ethiobarbershop-spring-but-backend-production.up.railway.app', file_url)
WHERE file_url LIKE '/api/images/files/%';
```

**To run this query:**
1. Go to Railway dashboard
2. Select your MySQL database
3. Go to the **Query** tab
4. Paste and execute the SQL above

## Memory Issue Note

You mentioned the backend had memory issues and you set:
```
JAVA_TOOL_OPTIONS = -Xmx256m -Xms128m -XX:+UseSerialGC
```

This is a very low memory allocation (256MB max). If you continue to have memory issues:

1. **Increase memory allocation** (if Railway plan allows):
   ```
   JAVA_TOOL_OPTIONS = -Xmx512m -Xms256m -XX:+UseSerialGC
   ```

2. **Or optimize your Railway plan** to get more memory

3. **Monitor memory usage** in Railway dashboard to see if 256MB is sufficient

## Verification Checklist

- [ ] Added `APP_BASE_URL` environment variable in Railway
- [ ] Redeployed the backend
- [ ] Tested new screenshot upload
- [ ] Verified screenshot displays in owner dashboard
- [ ] (Optional) Updated existing screenshots in database

## Support

If you still see 404 errors after following these steps:

1. Check that the environment variable is correctly set in Railway
2. Verify the backend redeployed successfully
3. Check the backend logs for any errors
4. Ensure CORS is properly configured (already done in your CorsConfig.java)
