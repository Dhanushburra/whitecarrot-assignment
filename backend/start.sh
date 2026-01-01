#!/bin/bash
set -e

echo "Running database migrations..."
python manage.py migrate --noinput

echo "Starting Gunicorn..."
exec gunicorn careers_builder.wsgi:application --bind 0.0.0.0:$PORT

