# Render Deployment Checklist ✅

## Pre-Deployment Setup

- [ ] Render account created at https://render.com
- [ ] GitHub repository connected: `ianandhu7/Ecommerce-WebApp`
- [ ] PostgreSQL database (Neon) accessible
- [ ] Razorpay test credentials ready

## Backend Deployment (Web Service)

- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Set Root Directory: `backend`
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `npm start`
- [ ] Add environment variables:
  - [ ] `DATABASE_URL`
  - [ ] `JWT_SECRET`
  - [ ] `RAZORPAY_KEY_ID`
  - [ ] `RAZORPAY_KEY_SECRET`
  - [ ] `NODE_ENV=production`
  - [ ] `FRONTEND_URL` (update after frontend deployment)
- [ ] Deploy backend service
- [ ] Test health endpoint: `/api/health`
- [ ] Note backend URL: `https://ecommerce-backend-xxxx.onrender.com`

## Frontend Deployment (Static Site)

- [ ] Create new Static Site on Render
- [ ] Connect same GitHub repository
- [ ] Set Root Directory: `frontend`
- [ ] Set Build Command: `npm install && npm run build`
- [ ] Set Publish Directory: `dist`
- [ ] Add environment variables:
  - [ ] `VITE_API_URL` (use backend URL from above)
  - [ ] `VITE_RAZORPAY_KEY_ID`
- [ ] Deploy frontend static site
- [ ] Note frontend URL: `https://ecommerce-frontend-xxxx.onrender.com`

## Post-Deployment Configuration

- [ ] Update backend `FRONTEND_URL` with actual frontend URL
- [ ] Redeploy backend service
- [ ] Test frontend application
- [ ] Test API connectivity from frontend
- [ ] Test Razorpay payment integration
- [ ] Verify user registration/login works
- [ ] Test product catalog loading
- [ ] Test shopping cart functionality

## Verification Tests

- [ ] Backend health check: `GET /api/health`
- [ ] Frontend loads without errors
- [ ] API calls work (check browser network tab)
- [ ] Database operations function correctly
- [ ] Payment flow works with Razorpay
- [ ] No CORS errors in browser console

## Environment Variables Summary

### Backend Environment Variables:
```
DATABASE_URL=postgresql://neondb_owner:npg_WRLD6ponM8rw@ep-twilight-pond-a7tg72k4-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=render_production_jwt_secret_key_minimum_32_characters_long_secure_random_string_2025
RAZORPAY_KEY_ID=rzp_test_S70nWJUtFYoyam
RAZORPAY_KEY_SECRET=aJZsw1U32syKOwu4lirlmARQ
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.onrender.com
```

### Frontend Environment Variables:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_RAZORPAY_KEY_ID=rzp_test_S70nWJUtFYoyam
```

## Troubleshooting

If something doesn't work:
- [ ] Check Render service logs
- [ ] Verify all environment variables are set correctly
- [ ] Ensure no typos in URLs
- [ ] Check database connectivity
- [ ] Verify CORS configuration
- [ ] Test API endpoints individually

## Success Criteria

✅ **Deployment is successful when:**
- Backend health endpoint returns 200 OK
- Frontend loads the ecommerce homepage
- Users can register/login
- Products display correctly
- Shopping cart functions work
- Payment integration with Razorpay works
- No console errors in browser

## Next Steps After Deployment

- [ ] Set up custom domain (optional)
- [ ] Configure SSL certificate (automatic on Render)
- [ ] Set up monitoring and alerts
- [ ] Plan for production database backup
- [ ] Consider upgrading to paid tier for better performance
- [ ] Set up CI/CD for automatic deployments

---

**Estimated Deployment Time:** 15-30 minutes
**Cost:** Free tier available for both services