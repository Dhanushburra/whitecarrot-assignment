# Deployment Checklist

Use this checklist to ensure everything is set up correctly before deploying.

## Pre-Deployment Checklist

### Code Preparation
- [ ] All code is committed to GitHub
- [ ] `.env` file is in `.gitignore` (not committed)
- [ ] `requirements.txt` includes all dependencies
- [ ] `package.json` includes all dependencies
- [ ] No hardcoded API URLs in frontend code
- [ ] Environment variables are properly configured

### Backend Files
- [ ] `backend/Procfile` exists
- [ ] `backend/render.yaml` exists (optional, for Render)
- [ ] `backend/requirements.txt` includes `gunicorn`, `whitenoise`, `dj-database-url`
- [ ] `backend/careers_builder/settings.py` has production settings

### Frontend Files
- [ ] `frontend/vercel.json` exists
- [ ] `frontend/.env` is not committed (use `.env.production` or Vercel env vars)

---

## Deployment Steps

### Step 1: GitHub
- [ ] Repository is created on GitHub
- [ ] Code is pushed to main/master branch
- [ ] Repository is public (or you have access to connect to Render/Vercel)

### Step 2: Render.com (Backend)
- [ ] Account created at https://render.com
- [ ] GitHub account connected
- [ ] PostgreSQL database created
- [ ] Database Internal URL copied
- [ ] Web service created
- [ ] Environment variables set:
  - [ ] `SECRET_KEY` (generated)
  - [ ] `DEBUG=False`
  - [ ] `DATABASE_URL` (from PostgreSQL service)
  - [ ] `ALLOWED_HOSTS` (your Render URL)
  - [ ] `CORS_ALLOWED_ORIGINS` (will update after frontend deploy)
  - [ ] `DATABASE_SSLMODE=require`
- [ ] Build command: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
- [ ] Start command: `gunicorn careers_builder.wsgi:application --bind 0.0.0.0:$PORT`
- [ ] Root directory: `backend`
- [ ] Deployment successful
- [ ] Backend URL noted: `https://________________.onrender.com`

### Step 3: Vercel (Frontend)
- [ ] Account created at https://vercel.com
- [ ] GitHub account connected
- [ ] Project imported from GitHub
- [ ] Root directory: `frontend`
- [ ] Framework: Vite (auto-detected)
- [ ] Environment variable set:
  - [ ] `VITE_API_URL=https://your-backend-url.onrender.com/api`
- [ ] Deployment successful
- [ ] Frontend URL noted: `https://________________.vercel.app`

### Step 4: Update CORS
- [ ] Go back to Render dashboard
- [ ] Update `CORS_ALLOWED_ORIGINS` with frontend URL
- [ ] Save and wait for redeploy

### Step 5: Database Setup
- [ ] Open Render Shell
- [ ] Run: `python manage.py migrate`
- [ ] (Optional) Run: `python manage.py create_sample_data`

### Step 6: Testing
- [ ] Frontend loads: `https://________________.vercel.app`
- [ ] Backend API accessible: `https://________________.onrender.com/api/`
- [ ] Registration works
- [ ] Login works
- [ ] Company creation works
- [ ] Job creation works
- [ ] Public careers page loads: `https://________________.vercel.app/{slug}/careers`
- [ ] Filters work on public page
- [ ] Images upload correctly

---

## Production URLs

**Frontend (Production Live Link):**
```
https://________________.vercel.app
```

**Backend API:**
```
https://________________.onrender.com/api
```

**Example Public Careers Page:**
```
https://________________.vercel.app/accenture/careers
```

---

## Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Build fails | Check build logs, verify dependencies |
| CORS errors | Update `CORS_ALLOWED_ORIGINS` in Render |
| Database errors | Verify `DATABASE_URL` is Internal URL |
| 404 on routes | Check `vercel.json` rewrites |
| API calls fail | Verify `VITE_API_URL` in Vercel |
| Static files 404 | Ensure `collectstatic` in build command |

---

## Environment Variables Reference

### Render (Backend)
```
SECRET_KEY=<generate-random-string>
DEBUG=False
DATABASE_URL=<internal-database-url>
ALLOWED_HOSTS=your-app.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
DATABASE_SSLMODE=require
```

### Vercel (Frontend)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Final Steps

- [ ] All tests pass
- [ ] Sample data created (optional)
- [ ] Production URLs documented
- [ ] Ready to submit!

**Production Live Link to Submit:**
```
https://________________.vercel.app
```

