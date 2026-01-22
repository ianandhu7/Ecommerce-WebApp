# Render Deployment Guide - Ecommerce Web Application

## 🚀 Deploying to Render

Render is an excellent platform for hosting full-stack applications. This guide will walk you through deploying both your backend API and frontend React app.

## 📋 Prerequisites

1. ✅ GitHub repository ready: https://github.com/ianandhu7/Ecommerce-WebApp.git
2. ✅ Render account: Sign up at https://render.com
3. ✅ PostgreSQL database (Neon) configured
4. ✅ Razorpay credentials ready

## 🔧 Step 1: Backend Deployment (Web Service)

### 1.1 Create Web Service on Render

1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `ianandhu7/Ecommerce-WebApp`
4. Configure the service:

**Basic Settings:**
- **Name**: `ecommerce-backend`
- **Region**: Choose closest to your users (e.g., Oregon US West)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free`

### 1.2 Environment Variables for Backend

Add these in Render Dashboard → Your Service → Environment:

```env
DATABASE_URL=postgresql://neondb_owner:npg_WRLD6ponM8rw@ep-twilight-pond-a7tg72k4-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=render_production_jwt_secret_key_minimum_32_characters_long_secure_random_string_2025
RAZORPAY_KEY_ID=rzp_test_S70nWJUtFYoyam
RAZORPAY_KEY_SECRET=aJZsw1U32syKOwu4lirlmARQ
NODE_ENV=production
FRONTEND_URL=https://ecommerce-frontend-xxxx.onrender.com
```

**Important Notes:**
- Replace `ecommerce-frontend-xxxx` with your actual frontend URL after Step 2
- Render automatically assigns PORT (usually 10000)
- The health check endpoint is available at `/api/health`

## 🎨 Step 2: Frontend Deployment (Static Site)

### 2.1 Create Static Site on Render

1. In Render Dashboard, click "New +" → "Static Site"
2. Connect the same GitHub repository: `ianandhu7/Ecommerce-WebApp`
3. Configure the static site:

**Basic Settings:**
- **Name**: `ecommerce-frontend`
- **Branch**: `main`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### 2.2 Environment Variables for Frontend

Add these in Render Dashboard → Your Static Site → Environment:

```env
VITE_API_URL=https://ecommerce-backend-xxxx.onrender.com/api
VITE_RAZORPAY_KEY_ID=rzp_test_S70nWJUtFYoyam
```

**Important**: Replace `ecommerce-backend-xxxx` with your actual backend service URL from Step 1.

## 🔄 Step 3: Update Environment Variables

After both services are deployed:

1. **Update Backend FRONTEND_URL**: 
   - Go to backend service → Environment
   - Update `FRONTEND_URL` with your frontend URL

2. **Update Frontend VITE_API_URL**:
   - Go to frontend static site → Environment  
   - Update `VITE_API_URL` with your backend URL

3. **Redeploy both services** after updating environment variables

## 📝 Step 4: Deployment Process

### 4.1 Automatic Deployment
- Both services will automatically deploy when you push to the `main` branch
- Render will rebuild and redeploy on every commit

### 4.2 Manual Deployment
- Go to your service dashboard
- Click "Manual Deploy" → "Deploy latest commit"

## 🔍 Step 5: Verify Deployment

### Backend Health Check
Visit: `https://your-backend-url.onrender.com/api/health`

Expected response:
```json
{
  "status": "OK",
  "message": "Ecommerce Backend API is running",
  "timestamp": "2025-01-23T00:00:00.000Z"
}
```

### Frontend Check
Visit: `https://your-frontend-url.onrender.com`
- Should load the ecommerce homepage
- Check browser console for any API connection errors

## 🚨 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **Environment Variables**:
   - Double-check all environment variables are set
   - Ensure no typos in variable names
   - Redeploy after changing environment variables

3. **CORS Errors**:
   - Verify FRONTEND_URL is correctly set in backend
   - Check that frontend is making requests to correct backend URL

4. **Database Connection**:
   - Verify DATABASE_URL is correct
   - Check Neon database is accessible
   - Review backend logs for connection errors

## 📊 Render Service URLs

After deployment, your URLs will be:
- **Backend API**: `https://ecommerce-backend-xxxx.onrender.com`
- **Frontend App**: `https://ecommerce-frontend-xxxx.onrender.com`

## 💡 Performance Tips

1. **Free Tier Limitations**:
   - Services sleep after 15 minutes of inactivity
   - First request after sleep takes ~30 seconds to wake up
   - Consider upgrading to paid tier for production

2. **Optimization**:
   - Enable build caching in Render settings
   - Optimize frontend bundle size
   - Use environment-specific configurations

## 🔐 Security Considerations

1. **Environment Variables**:
   - Never commit sensitive data to Git
   - Use Render's environment variable system
   - Rotate secrets regularly

2. **CORS Configuration**:
   - Backend is configured to only allow requests from your frontend domain
   - Update FRONTEND_URL when domain changes

## 📞 Support

If you encounter issues:
1. Check Render service logs
2. Verify environment variables
3. Test API endpoints individually
4. Check database connectivity

Your ecommerce application is now ready for production on Render! 🎉