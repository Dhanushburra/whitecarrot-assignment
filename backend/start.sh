#!/bin/bash
set -e

echo "=========================================="
echo "Starting application..."
echo "=========================================="

echo "Step 1: Running database migrations..."
python manage.py migrate --noinput || {
    echo "ERROR: Migrations failed!"
    echo "This might be due to database connection issues."
    echo "Check your DATABASE_URL environment variable."
    exit 1
}

echo "Step 2: Migrations completed successfully!"
echo "Step 3: Starting Gunicorn server..."
exec gunicorn careers_builder.wsgi:application --bind 0.0.0.0:$PORT

