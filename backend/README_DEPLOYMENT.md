# Backend Deployment Notes

## Build Process

The build command runs in this order:

1. **Install dependencies**: `pip install -r requirements.txt`
2. **Run migrations**: `python manage.py migrate --noinput`
3. **Collect static files**: `python manage.py collectstatic --noinput`
4. **Start server**: `gunicorn careers_builder.wsgi:application --bind 0.0.0.0:$PORT`

## Important Notes

### Migrations
- ✅ Migrations are **automatically run** during build
- ✅ No need to run `makemigrations` in production (migrations should be committed to git)
- ✅ No need to manually run `migrate` after deployment

### Development vs Production

**Development**:
```bash
python manage.py runserver
```

**Production**:
```bash
gunicorn careers_builder.wsgi:application --bind 0.0.0.0:$PORT
```

- ❌ **Never use `runserver` in production** - it's only for development
- ✅ **Use `gunicorn` in production** - it's a production-ready WSGI server

### Commands Explained

- `makemigrations`: Creates migration files (run locally, commit to git)
- `migrate`: Applies migrations to database (runs automatically during build)
- `collectstatic`: Collects static files for serving (runs automatically during build)
- `runserver`: Django development server (only for local development)

