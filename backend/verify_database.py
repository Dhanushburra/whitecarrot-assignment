#!/usr/bin/env python
"""
Script to verify database connection
Run: python verify_database.py
"""
import os
import sys
import django

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careers_builder.settings')
django.setup()

from django.db import connection
from django.conf import settings

def test_connection():
    print("=" * 60)
    print("Testing Database Connection")
    print("=" * 60)
    
    # Display connection info (without password)
    db_config = settings.DATABASES['default']
    print(f"\nDatabase Configuration:")
    print(f"  Host: {db_config['HOST']}")
    print(f"  Port: {db_config['PORT']}")
    print(f"  Database: {db_config['NAME']}")
    print(f"  User: {db_config['USER']}")
    print(f"  SSL Mode: {db_config.get('OPTIONS', {}).get('sslmode', 'not set')}")
    print(f"  Password: {'*' * len(db_config['PASSWORD']) if db_config['PASSWORD'] else 'Not set'}")
    
    # Test connection
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT version();")
            version = cursor.fetchone()
            print(f"\n✅ Connection Successful!")
            print(f"   PostgreSQL Version: {version[0]}")
            
            # Check if tables exist
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name;
            """)
            tables = cursor.fetchall()
            
            if tables:
                print(f"\n📊 Existing Tables ({len(tables)}):")
                for table in tables[:10]:  # Show first 10
                    print(f"   - {table[0]}")
                if len(tables) > 10:
                    print(f"   ... and {len(tables) - 10} more")
            else:
                print("\n⚠️  No tables found. Run migrations: python manage.py migrate")
                
    except Exception as e:
        print(f"\n❌ Connection Failed!")
        print(f"   Error: {str(e)}")
        print(f"\nTroubleshooting:")
        print(f"   1. Check your .env file has correct credentials")
        print(f"   2. Verify DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD")
        print(f"   3. For Supabase, ensure DATABASE_SSLMODE=require")
        print(f"   4. Check if your Supabase project is active")
        return False
    
    print("\n" + "=" * 60)
    return True

if __name__ == '__main__':
    success = test_connection()
    sys.exit(0 if success else 1)

