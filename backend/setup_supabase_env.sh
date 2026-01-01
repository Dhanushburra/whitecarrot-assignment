#!/bin/bash
# Script to set up Supabase database connection

echo "=========================================="
echo "Setting up Supabase Database Connection"
echo "=========================================="
echo ""

# Supabase credentials
DB_NAME="postgres"
DB_USER="postgres"
DB_PASSWORD="dhanushBurra!123"
DB_HOST="db.acycjxupzymbgwabxsad.supabase.co"
DB_PORT="5432"
DB_SSLMODE="require"

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists."
    read -p "Do you want to overwrite it? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Keeping existing .env file."
        exit 0
    fi
fi

# Create .env file
cat > .env << EOF
SECRET_KEY=django-insecure-change-this-in-production-$(openssl rand -hex 32)
DEBUG=True

# Supabase Database Configuration
DATABASE_NAME=${DB_NAME}
DATABASE_USER=${DB_USER}
DATABASE_PASSWORD=${DB_PASSWORD}
DATABASE_HOST=${DB_HOST}
DATABASE_PORT=${DB_PORT}
DATABASE_SSLMODE=${DB_SSLMODE}
EOF

echo "✅ Created .env file with Supabase credentials"
echo ""
echo "Configuration:"
echo "  Database: ${DB_NAME}"
echo "  Host: ${DB_HOST}"
echo "  User: ${DB_USER}"
echo "  SSL Mode: ${DB_SSLMODE}"
echo ""
echo "Next steps:"
echo "  1. Activate virtual environment: source venv/bin/activate"
echo "  2. Test connection: python verify_database.py"
echo "  3. Run migrations: python manage.py migrate"
echo "  4. (Optional) Create sample data: python manage.py create_sample_data"

