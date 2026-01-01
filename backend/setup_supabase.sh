#!/bin/bash
# Setup script for Supabase database

echo "Setting up Supabase database connection..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    cat > .env << EOF
SECRET_KEY=django-insecure-change-this-in-production-use-random-string
DEBUG=True

# Supabase Database Configuration
DATABASE_NAME=postgres
DATABASE_USER=postgres
DATABASE_PASSWORD=dhanushBurra!123
DATABASE_HOST=db.acycjxupzymbgwabxsad.supabase.co
DATABASE_PORT=5432
DATABASE_SSLMODE=require
EOF
    echo "✅ Created .env file with Supabase credentials"
else
    echo "⚠️  .env file already exists. Please update it manually with Supabase credentials."
fi

# Activate virtual environment and run migrations
echo "Running migrations..."
source venv/bin/activate
python manage.py makemigrations
python manage.py migrate

echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Create sample data: python manage.py create_sample_data"
echo "2. Start server: python manage.py runserver"

