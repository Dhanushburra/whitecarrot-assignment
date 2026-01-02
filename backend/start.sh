#!/bin/bash
set -e

echo "=========================================="
echo "Starting application..."
echo "=========================================="

echo "Step 1: Running database migrations..."
# Retry migrations up to 3 times with 5 second delays
for i in 1 2 3; do
    if python manage.py migrate --noinput; then
        echo "Step 2: Migrations completed successfully!"
        break
    else
        if [ $i -eq 3 ]; then
            echo "ERROR: Migrations failed after 3 attempts!"
            echo "This might be due to database connection issues."
            echo "Check your DATABASE_URL environment variable."
            echo "The application will still start, but migrations need to be run manually."
        else
            echo "Migration attempt $i failed, retrying in 5 seconds..."
            sleep 5
        fi
    fi
done

echo "Step 3: Starting Gunicorn server..."
exec gunicorn careers_builder.wsgi:application --bind 0.0.0.0:$PORT

