# Railway Environment Variables Configuration

## Backend Service Environment Variables

Your backend service should have these environment variables configured in Railway:

### Required Variables

| Variable Name | Value | Purpose |
|--------------|-------|---------|
| `APP_BASE_URL` | `https://ethiobarbershop-spring-but-backend-production.up.railway.app` | **NEW** - Base URL for generating absolute image URLs |
| `JWT_SECRET` | `[your-secret-key]` | JWT token signing secret |
| `JWT_EXPIRATION` | `86400000` | JWT token expiration (24 hours) |
| `JWT_REFRESH_EXPIRATION` | `604800000` | Refresh token expiration (7 days) |
| `JAVA_TOOL_OPTIONS` | `-Xmx256m -Xms128m -XX:+UseSerialGC` | Java memory settings (consider increasing) |

### Database Variables (Auto-configured by Railway)

These are automatically set when you connect a MySQL database:

| Variable Name | Auto-Set by Railway |
|--------------|---------------------|
| `MYSQLHOST` | ✅ Yes |
| `MYSQLPORT` | ✅ Yes |
| `MYSQL_DATABASE` | ✅ Yes |
| `MYSQLUSER` | ✅ Yes |
| `MYSQLPASSWORD` | ✅ Yes |

### Optional Variables

| Variable Name | Default Value | Purpose |
|--------------|---------------|---------|
| `PORT` | `8080` | Server port (Railway sets this automatically) |
| `UPLOAD_DIR` | `uploads/images` | Directory for storing uploaded images |

## How to Add the New Variable

### Via Railway Dashboard (Recommended)

1. Go to: https://railway.app/dashboard
2. Select your project
3. Click on the **backend service**
4. Click **Variables** tab
5. Click **+ New Variable**
6. Enter:
   - **Name**: `APP_BASE_URL`
   - **Value**: `https://ethiobarbershop-spring-but-backend-production.up.railway.app`
7. Click **Add**
8. Railway will automatically redeploy

### Via Railway CLI (Alternative)

```bash
# Install Railway CLI if not installed
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Add the variable
railway variables set APP_BASE_URL=https://ethiobarbershop-spring-but-backend-production.up.railway.app

# Redeploy
railway up
```

## Verification

After adding the variable and redeploying:

1. Check the variable is set:
   - Railway Dashboard → Service → Variables
   - You should see `APP_BASE_URL` in the list

2. Check deployment logs:
   - Railway Dashboard → Service → Deployments → Latest
   - Look for successful startup messages

3. Test image upload:
   - Upload a new payment screenshot
   - Check the returned URL includes the full domain

## Memory Optimization (Recommended)

Your current memory setting is very low:
```
JAVA_TOOL_OPTIONS = -Xmx256m -Xms128m -XX:+UseSerialGC
```

### Recommended Settings

If you have memory issues, try increasing:

```
JAVA_TOOL_OPTIONS = -Xmx512m -Xms256m -XX:+UseSerialGC
```

Or for better performance (if Railway plan allows):

```
JAVA_TOOL_OPTIONS = -Xmx1024m -Xms512m -XX:+UseG1GC
```

### How to Update

1. Railway Dashboard → Backend Service → Variables
2. Find `JAVA_TOOL_OPTIONS`
3. Click **Edit**
4. Update the value
5. Save and redeploy

## Troubleshooting

### Variable Not Taking Effect

1. **Check spelling**: Variable names are case-sensitive
2. **Redeploy**: Sometimes you need to manually trigger a redeploy
3. **Check logs**: Look for the variable being loaded in startup logs

### Still Getting 404 Errors

1. **Verify variable value**: Make sure there are no trailing slashes
   - ✅ Correct: `https://your-backend.railway.app`
   - ❌ Wrong: `https://your-backend.railway.app/`

2. **Check CORS**: Ensure your frontend domain is in the CORS allowed origins

3. **Clear cache**: Clear browser cache and try again

### Memory Issues Persist

1. **Monitor usage**: Railway Dashboard → Metrics
2. **Check logs**: Look for `OutOfMemoryError`
3. **Increase allocation**: Update `JAVA_TOOL_OPTIONS`
4. **Upgrade plan**: Consider Railway Pro plan for more resources

## Complete Variable List Template

Copy this for reference:

```env
# Application
APP_BASE_URL=https://ethiobarbershop-spring-but-backend-production.up.railway.app
PORT=8080

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# Java Memory
JAVA_TOOL_OPTIONS=-Xmx512m -Xms256m -XX:+UseSerialGC

# Database (Auto-configured by Railway)
# MYSQLHOST=auto
# MYSQLPORT=auto
# MYSQL_DATABASE=auto
# MYSQLUSER=auto
# MYSQLPASSWORD=auto

# Upload
UPLOAD_DIR=uploads/images
```
