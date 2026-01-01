# Deployment Troubleshooting Guide

## Issue: "Bad Request" when trying to login/signup

### Problem
Frontend is deployed but login/signup returns "Bad Request" error.

### Root Causes
1. **Frontend API URL not configured** - Frontend doesn't know where the backend is
2. **CORS not configured** - Backend is blocking requests from frontend
3. **ALLOWED_HOSTS not set** - Backend is rejecting requests

---

## Step-by-Step Fix

### Step 1: Get Your Frontend URL
1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Find your project
3. Copy the production URL (e.g., `https://your-project.vercel.app`)

### Step 2: Configure Frontend (Vercel)

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add the following:

```
Name: VITE_API_URL
Value: https://whitecarrot-assignment-tama.onrender.com/api
```

**Important**: 
- Make sure to include `/api` at the end
- Use `https://` (not `http://`)
- No trailing slash after `/api`

4. Click **Save**
5. **Redeploy** your frontend (go to Deployments → click the 3 dots → Redeploy)

### Step 3: Configure Backend (Render)

1. Go to Render Dashboard: https://dashboard.render.com
2. Find your web service (`whitecarrot-assignment-tama`)
3. Click on it → Go to **Environment** tab
4. Add/Update these environment variables:

```
ALLOWED_HOSTS=whitecarrot-assignment-tama.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
```

**Replace `your-frontend-url.vercel.app` with your actual Vercel URL from Step 1**

5. Click **Save Changes**
6. Render will automatically redeploy

### Step 4: Verify Backend is Working

1. Open your browser
2. Go to: `https://whitecarrot-assignment-tama.onrender.com/api/`
3. You should see a Django REST Framework API root page (or a JSON response)

If you see an error, check:
- Is the service running? (Check Render dashboard → Logs)
- Are migrations run? (Go to Shell tab and run `python manage.py migrate`)

### Step 5: Test the Connection

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try to login/signup from your frontend
4. Check the Network tab:
   - Is the request going to `https://whitecarrot-assignment-tama.onrender.com/api/auth/login/`?
   - What's the response status? (Should be 200, not 400)
   - What's the error message? (Check Response tab)

---

## Common Issues

### Issue 1: CORS Error
**Error**: `Access to XMLHttpRequest at '...' from origin '...' has been blocked by CORS policy`

**Fix**: 
- Make sure `CORS_ALLOWED_ORIGINS` in Render includes your frontend URL
- Make sure it starts with `https://` (not `http://`)
- No trailing slash
- Redeploy backend after changing

### Issue 2: 400 Bad Request
**Error**: `400 Bad Request` when trying to login/register

**Possible causes**:
1. **Backend URL wrong**: Check that `VITE_API_URL` in Vercel is `https://whitecarrot-assignment-tama.onrender.com/api`
2. **Request format wrong**: Check browser DevTools → Network tab → see what's being sent
3. **Backend not running**: Check Render logs

**Fix**:
- Check browser DevTools → Network tab → click on the failed request
- Look at the **Request Payload** - is it sending `username` and `password`?
- Look at the **Response** - what error message is the backend returning?

### Issue 3: 404 Not Found
**Error**: `404 Not Found` when trying to access API

**Fix**:
- Make sure backend URL ends with `/api` (not just `/`)
- Check that the endpoint exists: `/api/auth/login/` should work
- Verify in Render logs that the server started correctly

### Issue 4: Database Connection Error
**Error**: Database-related errors in Render logs

**Fix**:
1. Check `DATABASE_URL` in Render environment variables
2. Make sure it's your Supabase connection string
3. Format: `postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres`
4. Make sure `DATABASE_SSLMODE=require` is set

---

## Quick Checklist

- [ ] Frontend `VITE_API_URL` is set in Vercel to `https://whitecarrot-assignment-tama.onrender.com/api`
- [ ] Frontend is redeployed after setting environment variable
- [ ] Backend `ALLOWED_HOSTS` includes `whitecarrot-assignment-tama.onrender.com`
- [ ] Backend `CORS_ALLOWED_ORIGINS` includes your Vercel frontend URL (with `https://`)
- [ ] Backend is running (check Render logs)
- [ ] Database is connected (check Render logs for connection errors)
- [ ] Migrations are run (use Render Shell: `python manage.py migrate`)

---

## Testing the Fix

After making all changes:

1. **Test Backend Directly**:
   ```
   https://whitecarrot-assignment-tama.onrender.com/api/
   ```
   Should show API root or JSON response

2. **Test Login Endpoint**:
   Use curl or Postman:
   ```bash
   curl -X POST https://whitecarrot-assignment-tama.onrender.com/api/auth/login/ \
     -H "Content-Type: application/json" \
     -d '{"username":"test","password":"test"}'
   ```

3. **Test from Frontend**:
   - Open your Vercel frontend URL
   - Try to login/signup
   - Check browser DevTools → Network tab for errors

---

## Still Not Working?

1. **Check Render Logs**:
   - Go to Render Dashboard → Your Service → Logs
   - Look for errors, especially:
     - Database connection errors
     - Import errors
     - CORS errors

2. **Check Browser Console**:
   - Open DevTools (F12)
   - Go to Console tab
   - Look for JavaScript errors

3. **Check Network Tab**:
   - Open DevTools → Network tab
   - Try login/signup
   - Click on the failed request
   - Check:
     - Request URL (is it correct?)
     - Request Method (should be POST)
     - Request Payload (is data being sent?)
     - Response (what error is returned?)

4. **Verify Environment Variables**:
   - In Vercel: Check `VITE_API_URL` is set correctly
   - In Render: Check `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`

---

## Need More Help?

If you're still stuck, provide:
1. Browser DevTools → Network tab screenshot of the failed request
2. Render logs (last 50 lines)
3. Your frontend URL
4. Your backend URL

