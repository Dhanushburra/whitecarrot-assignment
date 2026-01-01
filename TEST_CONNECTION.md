# Testing Frontend-Backend Connection

## Your URLs
- **Backend**: `https://whitecarrot-assignment-tama.onrender.com`
- **Frontend**: `https://whitecarrot-assignment-three.vercel.app`

---

## Step 1: Test Backend Directly

### Test 1: Check if backend is running
Open in browser:
```
https://whitecarrot-assignment-tama.onrender.com/admin/
```

**Expected**: Should show Django admin login page (or redirect)

### Test 2: Test Login Endpoint (POST request)

**Option A: Using Browser DevTools Console**

1. Open your frontend: `https://whitecarrot-assignment-three.vercel.app`
2. Press F12 to open DevTools
3. Go to **Console** tab
4. Paste and run:

```javascript
fetch('https://whitecarrot-assignment-tama.onrender.com/api/auth/login/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'test',
    password: 'test'
  })
})
.then(response => response.json())
.then(data => console.log('Response:', data))
.catch(error => console.error('Error:', error));
```

**Expected Results**:
- ✅ **200 OK**: Backend is working! (You'll get an error about invalid credentials, but that's fine - it means the endpoint is reachable)
- ❌ **400 Bad Request**: Check backend logs for errors
- ❌ **CORS Error**: Backend CORS not configured correctly
- ❌ **Network Error**: Backend might be down

**Option B: Using curl (Terminal)**

```bash
curl -X POST https://whitecarrot-assignment-tama.onrender.com/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

**Expected**: Should return JSON with error about invalid credentials (not a 400 Bad Request)

---

## Step 2: Configure Environment Variables

### Frontend (Vercel)

1. Go to: https://vercel.com/dashboard
2. Select your project: `whitecarrot-assignment-three`
3. Go to **Settings** → **Environment Variables**
4. Add/Update:

```
Name: VITE_API_URL
Value: https://whitecarrot-assignment-tama.onrender.com/api
```

**Important**:
- ✅ Include `/api` at the end
- ✅ Use `https://` (not `http://`)
- ❌ No trailing slash after `/api`

5. Click **Save**
6. **Redeploy**: Go to **Deployments** → Click 3 dots on latest deployment → **Redeploy**

### Backend (Render)

1. Go to: https://dashboard.render.com
2. Select your service: `whitecarrot-assignment-tama`
3. Go to **Environment** tab
4. Add/Update these variables:

```
ALLOWED_HOSTS=whitecarrot-assignment-tama.onrender.com
CORS_ALLOWED_ORIGINS=https://whitecarrot-assignment-three.vercel.app
```

**Important**:
- ✅ Use `https://` for CORS_ALLOWED_ORIGINS
- ✅ No trailing slash
- ✅ Include the full domain

5. Click **Save Changes**
6. Render will automatically redeploy

---

## Step 3: Test from Frontend

1. Open your frontend: `https://whitecarrot-assignment-three.vercel.app`
2. Open DevTools (F12) → **Network** tab
3. Try to login/signup
4. Check the Network tab:

**What to look for**:

✅ **Success**:
- Request URL: `https://whitecarrot-assignment-tama.onrender.com/api/auth/login/`
- Status: `200` or `201`
- Response: JSON with `access`, `refresh`, `user`

❌ **CORS Error**:
- Error: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`
- **Fix**: Check `CORS_ALLOWED_ORIGINS` in Render includes your frontend URL

❌ **400 Bad Request**:
- Status: `400`
- **Check Response tab** for error message
- Common causes:
  - Missing required fields (username, password)
  - Invalid data format
  - Backend validation error

❌ **404 Not Found**:
- Status: `404`
- **Fix**: Check that `VITE_API_URL` ends with `/api` (not just `/`)

❌ **Network Error**:
- Request fails completely
- **Fix**: Check if backend is running (check Render logs)

---

## Step 4: Verify Configuration

### Check Frontend API Configuration

1. Open frontend: `https://whitecarrot-assignment-three.vercel.app`
2. Open DevTools (F12) → **Console** tab
3. Run:

```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
```

**Expected**: Should show `https://whitecarrot-assignment-tama.onrender.com/api`

If it shows `undefined` or `http://localhost:8000/api`:
- Environment variable not set correctly in Vercel
- Frontend not redeployed after setting variable

### Check Backend Logs

1. Go to Render Dashboard → Your Service → **Logs** tab
2. Look for:
   - ✅ "Application startup complete"
   - ✅ No database connection errors
   - ❌ Any CORS errors
   - ❌ Any import errors

---

## Step 5: Test Complete Flow

### Test Registration

1. Open frontend: `https://whitecarrot-assignment-three.vercel.app`
2. Go to Register page
3. Fill in:
   - Username: `testuser123`
   - Email: `test@example.com`
   - Password: `testpass123`
   - Company Name: `Test Company`
4. Click Register
5. Check DevTools → Network tab

**Expected**:
- POST request to `/api/auth/register/`
- Status: `201 Created`
- Response: JSON with `access`, `refresh`, `user`

### Test Login

1. Use the credentials you just created
2. Click Login
3. Check DevTools → Network tab

**Expected**:
- POST request to `/api/auth/login/`
- Status: `200 OK`
- Response: JSON with `access`, `refresh`, `user`
- Should redirect to dashboard

---

## Troubleshooting

### Issue: CORS Error

**Error Message**:
```
Access to fetch at 'https://whitecarrot-assignment-tama.onrender.com/api/auth/login/' 
from origin 'https://whitecarrot-assignment-three.vercel.app' 
has been blocked by CORS policy
```

**Fix**:
1. Go to Render → Environment tab
2. Check `CORS_ALLOWED_ORIGINS` includes: `https://whitecarrot-assignment-three.vercel.app`
3. Make sure it starts with `https://` (not `http://`)
4. No trailing slash
5. Save and wait for redeploy

### Issue: 400 Bad Request

**Check**:
1. Open DevTools → Network tab → Click on failed request → **Response** tab
2. Look for error message from backend
3. Common errors:
   - `"Username and password are required"` → Frontend not sending data correctly
   - `"Invalid credentials"` → Wrong username/password (this is OK for testing)
   - `"Username already exists"` → User already registered

### Issue: 404 Not Found

**Check**:
1. Verify `VITE_API_URL` in Vercel is: `https://whitecarrot-assignment-tama.onrender.com/api`
2. Make sure it ends with `/api` (not `/api/` or just `/`)
3. Redeploy frontend after changing

### Issue: Backend Not Responding

**Check Render Logs**:
1. Go to Render Dashboard → Your Service → **Logs**
2. Look for errors:
   - Database connection errors → Check `DATABASE_URL`
   - Import errors → Check dependencies
   - Port binding errors → Check Procfile

---

## Quick Checklist

- [ ] Backend URL accessible: `https://whitecarrot-assignment-tama.onrender.com/admin/`
- [ ] Frontend `VITE_API_URL` set to: `https://whitecarrot-assignment-tama.onrender.com/api`
- [ ] Frontend redeployed after setting environment variable
- [ ] Backend `ALLOWED_HOSTS` includes: `whitecarrot-assignment-tama.onrender.com`
- [ ] Backend `CORS_ALLOWED_ORIGINS` includes: `https://whitecarrot-assignment-three.vercel.app`
- [ ] Backend redeployed after setting environment variables
- [ ] Test POST request works (using curl or browser console)
- [ ] Frontend can make requests (check Network tab)

---

## Still Not Working?

1. **Check Browser Console** (F12 → Console tab) for JavaScript errors
2. **Check Network Tab** (F12 → Network tab) for failed requests
3. **Check Render Logs** for backend errors
4. **Verify Environment Variables** are set correctly in both platforms

