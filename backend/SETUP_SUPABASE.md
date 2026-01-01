# Supabase Database Setup - Quick Guide

## Your Supabase Credentials

```
Host: db.acycjxupzymbgwabxsad.supabase.co
Port: 5432
Database: postgres
User: postgres
Password: dhanushBurra!123
SSL Mode: require
```

## Step 1: Create .env File

Create a file named `.env` in the `backend/` directory with this exact content:

```env
SECRET_KEY=django-insecure-change-this-in-production-use-random-string
DEBUG=True

# Supabase Database Configuration
DATABASE_NAME=postgres
DATABASE_USER=postgres
DATABASE_PASSWORD=dhanushBurra!123
DATABASE_HOST=db.acycjxupzymbgwabxsad.supabase.co
DATABASE_PORT=5432
DATABASE_SSLMODE=require
```

**Important:** Make sure there are no extra spaces or quotes around the values.

## Step 2: Run Setup Script (Alternative)

Or run the automated script:

```bash
cd backend
./setup_supabase_env.sh
```

## Step 3: Verify Connection

Test the database connection:

```bash
cd backend
source venv/bin/activate
python verify_database.py
```

This will:
- Show your database configuration
- Test the connection
- List existing tables
- Show any errors if connection fails

## Step 4: Run Migrations

If connection is successful, create tables:

```bash
python manage.py makemigrations
python manage.py migrate
```

## Step 5: Create Sample Data (Optional)

```bash
python manage.py create_sample_data
```

## Troubleshooting

### Connection Refused
- Check if `DATABASE_HOST` is correct: `db.acycjxupzymbgwabxsad.supabase.co`
- Verify `DATABASE_PORT` is `5432`

### Authentication Failed
- Double-check password: `dhanushBurra!123` (case-sensitive)
- Make sure there are no extra spaces in `.env` file

### SSL Required Error
- Ensure `DATABASE_SSLMODE=require` is set
- The settings.py automatically sets this for Supabase hosts

### Password with Special Characters
- The password `dhanushBurra!123` contains `!` which should work fine
- Make sure it's not wrapped in quotes in the .env file

## Verify It's Working

After setup, test with:

```bash
python manage.py dbshell
```

You should see: `postgres=#` prompt. Type `\q` to exit.

