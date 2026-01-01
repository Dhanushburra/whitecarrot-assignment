# Deployment Guide

This guide will help you deploy both the backend (Django) and frontend (React) to production using GitHub.

## Deployment Architecture

- **Backend**: Deploy to Render.com (free tier available, but requires credit card)
- **Frontend**: Deploy to Vercel (free tier available, no credit card required)
- **Database**: Supabase (already configured - you're using cloud database)

## ⚠️ Important Note

**Render requires a credit card** even for the free tier (they won't charge unless you upgrade).

**If you don't want to add a credit card**, see **[DEPLOYMENT_ALTERNATIVES.md](DEPLOYMENT_ALTERNATIVES.md)** for alternative platforms like:
- Railway.app (no credit card required)
- Fly.io (no credit card required)
- PythonAnywhere (free tier available)

## Prerequisites

1. GitHub account
2. Render.com account (sign up at https://render.com)
3. Vercel account (sign up at https://vercel.com)
4. Your code pushed to GitHub repository

---

## Step 1: Push Code to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - ready for deployment"

# Add your GitHub repository as remote
git remote add origin https://github.com/your-username/your-repo-name.git

# Push to GitHub
git push -u origin main
```

---

## Step 2: Deploy Backend to Render.com

### 2.1 Get Your Supabase Database URL

Since you're already using Supabase, you just need to construct your connection string:

**Option 1: Get from Supabase Dashboard**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **Database**
4. Scroll down to **Connection string** section
5. Copy the **Connection string** (URI format)
6. Replace `[YOUR-PASSWORD]` with your actual Supabase database password

**Option 2: Construct from Your Existing Credentials**

Based on your existing setup, your Supabase connection string should be:

```
postgresql://postgres:dhanushBurra!123@db.acycjxupzymbgwabxsad.supabase.co:5432/postgres
```

**Important**: 
- Make sure to URL-encode special characters in your password if needed
- The password `dhanushBurra!123` should work as-is
- Save this connection string - you'll use it as `DATABASE_URL` in Render

**Note**: You can also use the **Connection pooling** string from Supabase dashboard if available (recommended for production with better performance).

### 2.2 Create Web Service (Backend)

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `careers-builder-api`
   - **Region**: Choose closest to you
   - **Branch**: `main` (or your main branch)
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Python Version**: `3.11.9` (you can set this manually in Render settings, or use `runtime.txt` file)
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt && python manage.py collectstatic --noinput
     ```
   - **Start Command**: 
     ```bash
     bash start.sh
     ```
   
   **Note**: Migrations run automatically on startup (via `start.sh` script), not during build. This avoids database connection issues during the build phase.

**Important - Python Version Issue**: 

Render is using Python 3.13.4 by default, which has compatibility issues with Pillow 10.1.0. You have two solutions:

**⚠️ IMPORTANT: Python 3.13 Compatibility Issues**

Python 3.13.4 has compatibility issues with `psycopg2-binary==2.9.9`. You **MUST** set Python version to 3.11.9:

1. After creating the service, go to **Settings** tab
2. Scroll down to **Python Version** section  
3. **Set it to `3.11.9`** (this is required!)
4. Save changes (Render will redeploy automatically)

**Why?** 
- `psycopg2-binary==2.9.9` doesn't fully support Python 3.13
- Python 3.11.9 is stable and compatible with all your packages
- The `runtime.txt` file may not be detected, so manually setting it is more reliable

### 2.3 Configure Environment Variables

In the Render dashboard, go to your web service → **"Environment"** tab and add:

```
SECRET_KEY=your-secret-key-here-generate-a-random-string
DEBUG=False
DATABASE_URL=<paste-your-supabase-connection-string-from-step-2.1>
ALLOWED_HOSTS=careers-builder-api.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
DATABASE_SSLMODE=require
```

**Important Notes:**
- Generate a secure `SECRET_KEY` (you can use: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)
- Replace `your-frontend-url.vercel.app` with your actual Vercel URL (you'll get this after deploying frontend)
- The `DATABASE_URL` should be your Supabase connection string from step 2.1
- Format: `postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres`
- **Your Supabase host**: `db.acycjxupzymbgwabxsad.supabase.co` (from your existing setup)
- **Example connection string**: `postgresql://postgres:dhanushBurra!123@db.acycjxupzymbgwabxsad.supabase.co:5432/postgres`

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Run migrations
   - Start the server
3. Wait for deployment to complete (usually 5-10 minutes)
4. Your backend will be available at: `https://careers-builder-api.onrender.com`

### 2.5 Database Migrations

**✅ Migrations run automatically on startup!**

Migrations are handled by the `start.sh` script, which runs `python manage.py migrate --noinput` before starting the server. This ensures:
- Build completes successfully (no database connection needed during build)
- Migrations run automatically on every deployment when the service starts
- Works on free tier (no Shell access required)

**Optional: Create Sample Data**

If you want to create sample data, you'll need to use Render Shell (premium feature) or create it through the application UI after deployment.

The sample data command would be:
```bash
python manage.py create_sample_data
```

This creates:
- Demo user: `demo` / `demo123`
- Sample company: "Tech Innovations Inc."
- Sample jobs and content sections

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Connect Repository

1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import your GitHub repository

### 3.2 Configure Project

1. **Framework Preset**: Vite
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build` (auto-detected)
4. **Output Directory**: `dist` (auto-detected)
5. **Install Command**: `npm install` (auto-detected)

### 3.3 Add Environment Variables

Click **"Environment Variables"** and add:

```
VITE_API_URL=https://careers-builder-api.onrender.com/api
```

**Important**: Replace `careers-builder-api.onrender.com` with your actual Render backend URL.

### 3.4 Deploy

1. Click **"Deploy"**
2. Vercel will automatically:
   - Install dependencies
   - Build the project
   - Deploy to production
3. Your frontend will be available at: `https://your-project-name.vercel.app`

---

## Step 4: Update CORS Settings

After you have your frontend URL, update the backend CORS settings:

1. Go to Render dashboard → Your web service → **"Environment"**
2. Update `CORS_ALLOWED_ORIGINS`:
   ```
   CORS_ALLOWED_ORIGINS=https://your-project-name.vercel.app
   ```
3. Click **"Save Changes"**
4. Render will automatically redeploy

---

## Step 5: Test Your Deployment

1. **Test Frontend**: Visit `https://your-project-name.vercel.app`
2. **Test Backend API**: Visit `https://careers-builder-api.onrender.com/api/`
3. **Test Registration**: Try creating a new account
4. **Test Public Page**: Visit `https://your-project-name.vercel.app/{company-slug}/careers`

---

## Step 6: Create Sample Data (Optional)

To populate your production database with sample data:

1. Go to Render dashboard → Your web service → **"Shell"**
2. Run:
   ```bash
   python manage.py create_sample_data
   ```
3. This creates:
   - Demo user: `demo` / `demo123`
   - Sample company: "Tech Innovations Inc."
   - Sample jobs and content sections

**Note**: Migrations run automatically on startup (via `start.sh` script), so you don't need to run them manually.

---

## Troubleshooting

### Backend Issues

**Problem**: Build fails
- **Solution**: Check build logs in Render dashboard. Ensure all dependencies are in `requirements.txt`

**Problem**: Database connection error
- **Solution**: Verify `DATABASE_URL` is correct and uses your Supabase connection string. Make sure password is included and `DATABASE_SSLMODE=require` is set

**Problem**: Static files not loading
- **Solution**: Ensure `collectstatic` runs in build command and `whitenoise` is in middleware

**Problem**: CORS errors
- **Solution**: Verify `CORS_ALLOWED_ORIGINS` includes your frontend URL (with `https://`)

### Frontend Issues

**Problem**: API calls failing
- **Solution**: Check `VITE_API_URL` environment variable is set correctly in Vercel

**Problem**: 404 errors on routes
- **Solution**: Ensure `vercel.json` has rewrites configured (already included)

**Problem**: Build fails
- **Solution**: Check build logs in Vercel dashboard. Ensure all dependencies are in `package.json`

---

## Production URLs

After deployment, you'll have:

- **Frontend**: `https://your-project-name.vercel.app`
- **Backend API**: `https://careers-builder-api.onrender.com/api`
- **Public Careers Page**: `https://your-project-name.vercel.app/{company-slug}/careers`

**Submit the frontend URL as your Production Live Link.**

---

## Additional Notes

### Media Files (Logos/Banners)

- Media files uploaded in production are stored on Render's filesystem
- For production, consider using cloud storage (AWS S3, Cloudinary) for better reliability
- Current setup works for demo purposes

### Database Backups

- You're using Supabase, which includes automatic backups
- Check your Supabase dashboard for backup settings

### Environment Variables

Keep these secure:
- `SECRET_KEY`: Never commit to GitHub
- `DATABASE_URL`: Contains database credentials
- Add `.env` to `.gitignore` (already done)

---

## Quick Reference

### Render.com Backend
- Dashboard: https://dashboard.render.com
- Service URL: `https://careers-builder-api.onrender.com`

### Vercel Frontend
- Dashboard: https://vercel.com/dashboard
- Project URL: `https://your-project-name.vercel.app`

### Update Environment Variables
- Backend: Render Dashboard → Service → Environment
- Frontend: Vercel Dashboard → Project → Settings → Environment Variables

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ✅ Update CORS settings
4. ✅ Test all features
5. ✅ Create sample data
6. ✅ Submit production URL

Good luck with your deployment! 🚀

