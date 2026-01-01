# Fix 500 Internal Server Error

## Problem
Backend is returning `500 Internal Server Error` on login/register endpoints.

## Most Common Cause: Database Migrations Not Run

The database tables probably don't exist yet. You need to run migrations.

---

## Step 1: Run Database Migrations

### Option A: Using Render Shell (Recommended)

1. Go to Render Dashboard: https://dashboard.render.com
2. Select your service: `whitecarrot-assignment-tama`
3. Click on **"Shell"** tab (in the left sidebar)
4. Run these commands one by one:

```bash
python manage.py migrate
```

**Expected Output**:
```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions, accounts, companies, jobs, content
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  ...
  Applying companies.0001_initial... OK
  Applying jobs.0001_initial... OK
  ...
```

5. If successful, try login/register again from frontend

### Option B: Using Render Logs to Check

If Shell doesn't work, check the logs to see if there are database errors:

1. Go to Render Dashboard → Your Service → **Logs** tab
2. Look for errors like:
   - `relation "accounts_user" does not exist`
   - `relation "companies_company" does not exist`
   - `no such table`

If you see these, migrations definitely need to be run.

---

## Step 2: Verify Database Connection

Check if your database is connected:

1. Go to Render Dashboard → Your Service → **Environment** tab
2. Verify `DATABASE_URL` is set correctly:
   ```
   DATABASE_URL=postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres
   ```
3. Also check `DATABASE_SSLMODE=require` is set

---

## Step 3: Check Render Logs for Detailed Error

1. Go to Render Dashboard → Your Service → **Logs** tab
2. Scroll to the most recent error (around the time you tried to login)
3. Look for the full traceback/error message

**Common Errors**:

### Error: "relation does not exist"
**Fix**: Run migrations (Step 1)

### Error: "could not connect to server"
**Fix**: Check `DATABASE_URL` in environment variables

### Error: "password authentication failed"
**Fix**: Check database password in `DATABASE_URL`

### Error: "SSL connection required"
**Fix**: Add `DATABASE_SSLMODE=require` to environment variables

---

## Step 4: Create Sample Data (Optional)

After migrations are successful, you can create sample data:

1. Go to Render Shell
2. Run:
```bash
python manage.py create_sample_data
```

This creates:
- Demo user: `demo` / `demo123`
- Sample company: "Tech Innovations Inc."

---

## Step 5: Test Again

1. Go to your frontend: `https://whitecarrot-assignment-three.vercel.app`
2. Try to register a new user
3. Check browser DevTools → Network tab
4. Should see `201 Created` (not `500 Internal Server Error`)

---

## Quick Checklist

- [ ] Migrations run: `python manage.py migrate` in Render Shell
- [ ] `DATABASE_URL` is set correctly in Render Environment
- [ ] `DATABASE_SSLMODE=require` is set in Render Environment
- [ ] No database connection errors in Render Logs
- [ ] Test registration/login from frontend

---

## Still Getting 500 Error?

1. **Check Render Logs** for the full error traceback
2. **Copy the error message** and check:
   - Is it a database error?
   - Is it an import error?
   - Is it a missing environment variable?

3. **Common fixes**:
   - Database not connected → Check `DATABASE_URL`
   - Tables missing → Run migrations
   - Missing SECRET_KEY → Add to environment variables
   - Import error → Check dependencies in `requirements.txt`

---

## Need More Help?

If you're still stuck, provide:
1. Full error from Render Logs (last 50 lines)
2. Output of `python manage.py migrate` from Render Shell
3. Your `DATABASE_URL` format (without password)

