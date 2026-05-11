# 🚀 Quick Fix Steps for Screenshot 404 Error

## ⚡ Immediate Action Required

### Step 1: Add Environment Variable in Railway (2 minutes)

1. Open Railway dashboard: https://railway.app
2. Select project: **ethiobarbershop-spring-but-backend-production**
3. Click on **Variables** tab
4. Click **+ New Variable**
5. Add:
   ```
   Variable Name: APP_BASE_URL
   Value: https://ethiobarbershop-spring-but-backend-production.up.railway.app
   ```
6. Click **Add** or **Save**

### Step 2: Deploy the Code Changes (5 minutes)

From your terminal in the project root:

```bash
# Make sure you're in the project root
cd /path/to/your/project

# Add the changes
git add backend/src/main/resources/application.properties
git add backend/src/main/java/com/barbershop/modules/image/service/ImageServiceImpl.java

# Commit
git commit -m "Fix: Generate absolute URLs for image uploads to resolve 404 errors"

# Push to trigger Railway deployment
git push origin main
```

### Step 3: Wait for Deployment (2-3 minutes)

- Railway will automatically detect the push and redeploy
- Watch the deployment logs in Railway dashboard
- Wait for "Deployment successful" message

### Step 4: Test the Fix (2 minutes)

1. **Test New Screenshot Upload**:
   - Go to your frontend: https://ethiobarbershop.vercel.app
   - Book a new appointment
   - Upload a payment screenshot
   - Login as owner
   - Go to payment verification dashboard
   - Click "View Screenshot" - it should work now! ✅

2. **Check the URL**:
   - The screenshot URL should now look like:
     ```
     https://ethiobarbershop-spring-but-backend-production.up.railway.app/api/images/files/abc-123.jpg
     ```
   - Instead of just:
     ```
     /api/images/files/abc-123.jpg
     ```

## 🔧 Optional: Fix Old Screenshots

If you have existing screenshots that are broken, run this SQL in Railway:

```sql
UPDATE images 
SET file_url = CONCAT('https://ethiobarbershop-spring-but-backend-production.up.railway.app', file_url)
WHERE file_url LIKE '/api/images/files/%';
```

**How to run:**
1. Railway Dashboard → Select MySQL Database
2. Click **Query** tab
3. Paste SQL above
4. Click **Execute**

## 📊 Memory Issue (Separate Concern)

You mentioned: `JAVA_TOOL_OPTIONS = -Xmx256m -Xms128m -XX:+UseSerialGC`

This is **very low memory** (256MB). Consider:

### Option 1: Increase Memory (Recommended)
```
JAVA_TOOL_OPTIONS = -Xmx512m -Xms256m -XX:+UseSerialGC
```

### Option 2: Upgrade Railway Plan
- Check if your current plan has memory limits
- Consider upgrading if you hit limits frequently

### Option 3: Monitor Usage
- Go to Railway Dashboard → Metrics
- Check memory usage over time
- If consistently hitting 256MB, increase allocation

## ✅ Success Checklist

- [ ] Added `APP_BASE_URL` environment variable
- [ ] Pushed code changes to repository
- [ ] Railway deployment completed successfully
- [ ] Tested new screenshot upload
- [ ] Screenshot displays correctly in owner dashboard
- [ ] No more 404 errors

## 🆘 Still Having Issues?

If screenshots still show 404:

1. **Verify environment variable**:
   - Railway Dashboard → Variables
   - Confirm `APP_BASE_URL` is set correctly

2. **Check deployment logs**:
   - Railway Dashboard → Deployments
   - Look for any errors during startup

3. **Clear browser cache**:
   - Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

4. **Check backend logs**:
   - Railway Dashboard → Logs
   - Look for image upload errors

## 📝 What Changed?

**Before**: Images stored with relative URLs → `/api/images/files/abc.jpg`
**After**: Images stored with absolute URLs → `https://your-backend.railway.app/api/images/files/abc.jpg`

This ensures the browser knows where to fetch the images from!
