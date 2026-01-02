# Complete Deployment Guide

This guide will help you deploy the Careers Page Builder application to production.

## 📋 Prerequisites

- GitHub account with your code pushed
- Render.com account (for backend)
- Vercel account (for frontend)
- Supabase database (already configured)

---

## 🗄️ Database Information

Your Supabase database credentials:

```
Host: db.acycjxupzymbgwabxsad.supabase.co
Port: 5432
Database: postgres
User: postgres
Password: dhanushBurra!123
SSL Mode: require
```

**Connection String:**
```
postgresql://postgres:dhanushBurra!123@db.acycjxupzymbgwabxsad.supabase.co:5432/postgres
```

---

## 🚀 Part 1: Deploy Backend to Render.com

### Step 1: Create Render Account

1. Go to https://render.com
2. Sign up/login with GitHub
3. Connect your GitHub account

### Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `Dhanushburra/whitecarrot-assignment`
3. Configure the service:

   **Basic Settings:**
   - **Name**: `careers-builder-api` (or any name you prefer)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Python Version**: `3.11.9` ⚠️ **IMPORTANT: Set this manually in Settings after creation**

   **Build & Deploy:**
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt && python manage.py collectstatic --noinput
     ```
   - **Start Command**: 
     ```bash
     bash start.sh
     ```

### Step 3: Set Python Version

⚠️ **CRITICAL**: Render defaults to Python 3.13, which has compatibility issues.

1. After creating the service, go to **Settings** tab
2. Scroll to **Python Version**
3. Set to: `3.11.9`
4. Save (will trigger redeploy)

### Step 4: Configure Environment Variables

Go to **Environment** tab and add these variables:

```
SECRET_KEY=PzVLXDlG_dyDmAv1Lwp36um589ZF23AA3d4475Qxuh-f17VV2l8DX7gCfqv81kaOu6k
DEBUG=False
DATABASE_URL=postgresql://postgres:dhanushBurra!123@db.acycjxupzymbgwabxsad.supabase.co:5432/postgres
ALLOWED_HOSTS=your-service-name.onrender.com
DATABASE_SSLMODE=require
CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
```

**Important Notes:**
- **SECRET_KEY**: This is for Django (not the database). Use the key above, or generate a new one using: `python3 -c "import secrets; print(secrets.token_urlsafe(50))"`
- **DATABASE_URL**: Contains the database password `dhanushBurra!123` - this is your database password
- **ALLOWED_HOSTS**: Replace with your actual Render service URL (e.g., `careers-builder-api.onrender.com`)
- **CORS_ALLOWED_ORIGINS**: You'll update this after deploying frontend (for now, use a placeholder)

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Your backend URL will be: `https://your-service-name.onrender.com`

### Step 6: Verify Backend

1. Check logs for:
   ```
   ==========================================
   Starting application...
   ==========================================
   Step 1: Running database migrations...
   ```
2. If you see migration output, migrations ran successfully
3. Test the API: Visit `https://your-service-name.onrender.com/api/` (should show API root or JSON)

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Connect your GitHub account

### Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Import your repository: `Dhanushburra/whitecarrot-assignment`
3. Configure:

   **Project Settings:**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

**Replace `your-backend-url.onrender.com` with your actual Render backend URL**

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. Your frontend URL will be: `https://your-project-name.vercel.app`

---

## 🔗 Part 3: Connect Frontend and Backend

### Step 1: Update Backend CORS

1. Go to Render Dashboard → Your Service → **Environment** tab
2. Update `CORS_ALLOWED_ORIGINS`:
   ```
   CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
   ```
3. Click **Save Changes** (will auto-redeploy)

### Step 2: Update Frontend API URL (if needed)

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Verify `VITE_API_URL` is correct
3. If you changed it, redeploy the frontend

---

## ✅ Part 4: Verify Deployment

### Test Backend

1. Visit: `https://your-backend-url.onrender.com/api/`
2. Should show API root or JSON response

### Test Frontend

1. Visit: `https://your-frontend-url.vercel.app`
2. Try to register a new account
3. Check browser DevTools → Network tab:
   - Request should go to: `https://your-backend-url.onrender.com/api/auth/register/`
   - Status should be `201 Created` (not `500`)

### Test Login

1. Use the credentials you just created
2. Should successfully login and redirect to dashboard

---

## 🔧 Troubleshooting

### Backend Issues

**Problem: Build fails with Python 3.13**
- **Fix**: Set Python version to `3.11.9` in Render Settings

**Problem: 500 errors on login/register**
- **Check**: Render logs for migration output
- **Fix**: If migrations didn't run, check `start.sh` is executing

**Problem: Database connection error**
- **Check**: `DATABASE_URL` is correct in Render Environment
- **Verify**: Password is correct: `dhanushBurra!123`
- **Ensure**: `DATABASE_SSLMODE=require` is set

**Problem: CORS errors**
- **Fix**: Update `CORS_ALLOWED_ORIGINS` in Render with your Vercel URL (include `https://`)

### Frontend Issues

**Problem: API calls failing**
- **Check**: `VITE_API_URL` in Vercel Environment Variables
- **Verify**: URL ends with `/api` (not `/api/`)
- **Ensure**: Backend URL is correct

**Problem: 404 errors on routes**
- **Fix**: `vercel.json` should have rewrites (already configured)

---

## 📝 Environment Variables Summary

### Backend (Render)

```
SECRET_KEY=PzVLXDlG_dyDmAv1Lwp36um589ZF23AA3d4475Qxuh-f17VV2l8DX7gCfqv81kaOu6k
DEBUG=False
DATABASE_URL=postgresql://postgres:dhanushBurra!123@db.acycjxupzymbgwabxsad.supabase.co:5432/postgres
ALLOWED_HOSTS=your-service-name.onrender.com
DATABASE_SSLMODE=require
CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
```

**Note**: 
- `SECRET_KEY` is for Django (use the key above)
- Database password is `dhanushBurra!123` (already in DATABASE_URL)

### Frontend (Vercel)

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

---

## 🎯 Quick Checklist

- [ ] Backend deployed to Render
- [ ] Python version set to `3.11.9` in Render
- [ ] All environment variables set in Render
- [ ] Backend migrations ran (check logs)
- [ ] Frontend deployed to Vercel
- [ ] `VITE_API_URL` set in Vercel
- [ ] CORS updated in Render with frontend URL
- [ ] Tested registration - works
- [ ] Tested login - works

---

## 📚 Important Files

- **Backend Start Script**: `backend/start.sh` (runs migrations on startup)
- **Backend Procfile**: `backend/Procfile` (defines start command)
- **Frontend Config**: `frontend/vercel.json` (Vercel configuration)

---

## 🆘 Need Help?

If you encounter issues:

1. **Check Render Logs**: Dashboard → Service → Logs tab
2. **Check Vercel Logs**: Dashboard → Project → Deployments → Click deployment → View logs
3. **Check Browser Console**: F12 → Console tab for frontend errors
4. **Check Network Tab**: F12 → Network tab to see API requests/responses

---

## 🎉 Success!

Once everything is working:

- **Frontend URL**: `https://your-frontend-url.vercel.app`
- **Backend URL**: `https://your-backend-url.onrender.com/api`
- **Public Careers Page**: `https://your-frontend-url.vercel.app/{company-slug}/careers`

Submit your frontend URL as the production live link!
