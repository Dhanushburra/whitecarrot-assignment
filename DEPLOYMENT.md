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
   - **Name**: `whitecarrot-assignment-tama` (or keep existing if already created)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3` (this is the only option - no version field)

   **Build & Deploy:**
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt && python manage.py collectstatic --noinput
     ```
   - **Start Command**: 
     ```bash
     bash start.sh
     ```

### Step 3: Python Version (Automatic)

✅ **Good News**: The `runtime.txt` file in your `backend/` folder already specifies `python-3.11.9`, so Render will automatically use Python 3.11.9.

**You don't need to set it manually** - just proceed to Step 4.

### Step 4: Configure Environment Variables

Go to **Environment** tab and add these variables (copy and paste exactly):

```
SECRET_KEY=PzVLXDlG_dyDmAv1Lwp36um589ZF23AA3d4475Qxuh-f17VV2l8DX7gCfqv81kaOu6k
DEBUG=False
DATABASE_URL=postgresql://postgres:dhanushBurra!123@db.acycjxupzymbgwabxsad.supabase.co:5432/postgres
ALLOWED_HOSTS=whitecarrot-assignment-tama.onrender.com
DATABASE_SSLMODE=require
CORS_ALLOWED_ORIGINS=https://whitecarrot-assignment-three.vercel.app
```

**Copy these exactly as shown above** - all values are already set correctly for your deployment.

### Step 5: Deploy

1. Click **"Create Web Service"** (or **"Save Changes"** if updating existing service)
2. Wait for deployment (5-10 minutes)
3. Your backend URL will be: `https://whitecarrot-assignment-tama.onrender.com`

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

Click **"Environment Variables"** and add (copy exactly):

```
VITE_API_URL=https://whitecarrot-assignment-tama.onrender.com/api
```

**Copy this exactly as shown** - the backend URL is already set correctly.

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. Your frontend URL will be: `https://whitecarrot-assignment-three.vercel.app`

---

## 🔗 Part 3: Connect Frontend and Backend

✅ **Already Configured!** 

The CORS and API URLs are already set correctly in the environment variables above:
- Backend CORS: `https://whitecarrot-assignment-three.vercel.app`
- Frontend API URL: `https://whitecarrot-assignment-tama.onrender.com/api`

**No additional steps needed** - they're already connected!

---

## ✅ Part 4: Verify Deployment

### Test Backend

1. Visit: `https://whitecarrot-assignment-tama.onrender.com/api/`
2. Should show API root or JSON response

### Test Frontend

1. Visit: `https://whitecarrot-assignment-three.vercel.app`
2. Try to register a new account
3. Check browser DevTools → Network tab:
   - Request should go to: `https://whitecarrot-assignment-tama.onrender.com/api/auth/register/`
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
- **Fix**: Verify `CORS_ALLOWED_ORIGINS` in Render is set to: `https://whitecarrot-assignment-three.vercel.app`

### Frontend Issues

**Problem: API calls failing**
- **Check**: `VITE_API_URL` in Vercel should be: `https://whitecarrot-assignment-tama.onrender.com/api`
- **Verify**: URL ends with `/api` (not `/api/`)

**Problem: 404 errors on routes**
- **Fix**: `vercel.json` should have rewrites (already configured)

---

## 📝 Environment Variables Summary

### Backend (Render) - Copy These Exactly

```
SECRET_KEY=PzVLXDlG_dyDmAv1Lwp36um589ZF23AA3d4475Qxuh-f17VV2l8DX7gCfqv81kaOu6k
DEBUG=False
DATABASE_URL=postgresql://postgres:dhanushBurra!123@db.acycjxupzymbgwabxsad.supabase.co:5432/postgres
ALLOWED_HOSTS=whitecarrot-assignment-tama.onrender.com
DATABASE_SSLMODE=require
CORS_ALLOWED_ORIGINS=https://whitecarrot-assignment-three.vercel.app
```

### Frontend (Vercel) - Copy This Exactly

```
VITE_API_URL=https://whitecarrot-assignment-tama.onrender.com/api
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

- **Frontend URL**: `https://whitecarrot-assignment-three.vercel.app`
- **Backend URL**: `https://whitecarrot-assignment-tama.onrender.com/api`
- **Public Careers Page**: `https://whitecarrot-assignment-three.vercel.app/{company-slug}/careers`

**Submit this as your production live link**: `https://whitecarrot-assignment-three.vercel.app`
