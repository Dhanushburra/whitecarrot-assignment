# Deployment Guide

This guide will help you deploy both the backend (Django) and frontend (React) to production using GitHub.

## Deployment Architecture

- **Backend**: Deploy to Render.com (free tier available)
- **Frontend**: Deploy to Vercel (free tier available)
- **Database**: PostgreSQL (included with Render.com free tier)

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

### 2.1 Create PostgreSQL Database

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `careers-builder-db`
   - **Database**: `careers_builder`
   - **User**: `careers_builder_user`
   - **Region**: Choose closest to you
   - **Plan**: Free
4. Click **"Create Database"**
5. Wait for database to be created
6. Copy the **Internal Database URL** (you'll need this later)

### 2.2 Create Web Service (Backend)

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `careers-builder-api`
   - **Region**: Same as database
   - **Branch**: `main` (or your main branch)
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt && python manage.py collectstatic --noinput
     ```
   - **Start Command**: 
     ```bash
     gunicorn careers_builder.wsgi:application --bind 0.0.0.0:$PORT
     ```

### 2.3 Configure Environment Variables

In the Render dashboard, go to your web service → **"Environment"** tab and add:

```
SECRET_KEY=your-secret-key-here-generate-a-random-string
DEBUG=False
DATABASE_URL=<paste-internal-database-url-from-step-2.1>
ALLOWED_HOSTS=careers-builder-api.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
DATABASE_SSLMODE=require
```

**Important Notes:**
- Generate a secure `SECRET_KEY` (you can use: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)
- Replace `your-frontend-url.vercel.app` with your actual Vercel URL (you'll get this after deploying frontend)
- The `DATABASE_URL` should be the Internal Database URL from your PostgreSQL service

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Run migrations
   - Start the server
3. Wait for deployment to complete (usually 5-10 minutes)
4. Your backend will be available at: `https://careers-builder-api.onrender.com`

### 2.5 Run Database Migrations

After first deployment, you need to run migrations:

1. Go to your web service in Render
2. Click **"Shell"** tab
3. Run:
   ```bash
   python manage.py migrate
   ```
4. (Optional) Create sample data:
   ```bash
   python manage.py create_sample_data
   ```

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

---

## Troubleshooting

### Backend Issues

**Problem**: Build fails
- **Solution**: Check build logs in Render dashboard. Ensure all dependencies are in `requirements.txt`

**Problem**: Database connection error
- **Solution**: Verify `DATABASE_URL` is correct and uses Internal Database URL (not External)

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

- Render free tier doesn't include automatic backups
- Consider upgrading or setting up manual backups for production use

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

