# How to Check if Migrations Ran

## Problem
You're getting 500 errors, but we need to verify if migrations actually ran on startup.

## Step 1: Check Render Logs for Startup Messages

1. Go to Render Dashboard → Your Service → **Logs** tab
2. Scroll to the **very beginning** of the logs (when the service last started)
3. Look for these messages in order:

```
==========================================
Starting application...
==========================================
Step 1: Running database migrations...
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions, accounts, companies, jobs, content
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  ...
Step 2: Migrations completed successfully!
Step 3: Starting Gunicorn server...
```

## Step 2: If You DON'T See Migration Messages

This means `start.sh` might not be executing. Check:

1. **Is Procfile being used?**
   - Check Render Settings → Start Command
   - Should be: `bash start.sh` (or just use Procfile)

2. **Is start.sh in the right location?**
   - Should be in: `backend/start.sh`
   - Check that it's committed to git

3. **Check for errors before migrations:**
   - Look for any errors in the logs before "Starting Gunicorn"
   - Common errors:
     - "bash: start.sh: No such file or directory"
     - "Permission denied"
     - Database connection errors

## Step 3: If Migrations Ran But Still Getting 500 Errors

Check the actual error message:

1. In Render Logs, scroll to the time you tried to login/register
2. Look for a full Python traceback
3. Common errors:

### Error: "relation does not exist"
**Meaning**: Migrations didn't actually create the tables
**Fix**: Check migration output - did it say "OK" for all migrations?

### Error: "could not connect to server"
**Meaning**: Database connection issue
**Fix**: Check `DATABASE_URL` in Render Environment variables

### Error: "password authentication failed"
**Meaning**: Wrong database password
**Fix**: Verify `DATABASE_URL` has correct password

## Step 4: Manual Verification (If Possible)

If you can access the database directly, check if tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see tables like:
- `auth_user`
- `companies_company`
- `jobs_job`
- `content_contentsection`
- etc.

## Quick Fix: Force Migrations to Run

If migrations didn't run, you can try:

1. **Redeploy the service** - This will trigger start.sh again
2. **Check the logs immediately after deployment** - Look for migration output
3. **If still not working**, the issue might be:
   - Database connection failing during startup
   - start.sh script not being executed
   - Procfile not being read correctly

## What to Share for Help

If you're still stuck, share:
1. **Startup logs** (first 50 lines after deployment)
2. **Error logs** (when you try to login/register)
3. **Render Settings** screenshot showing:
   - Build Command
   - Start Command
   - Environment Variables (DATABASE_URL format, without password)

