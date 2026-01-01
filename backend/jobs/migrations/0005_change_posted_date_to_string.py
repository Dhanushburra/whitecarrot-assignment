# Generated manually for changing posted_date from DateTimeField to CharField
from django.db import migrations, models
from django.db import connection


def migrate_datetime_to_string(apps, schema_editor):
    """Convert existing datetime values to string format using raw SQL"""
    from datetime import datetime
    
    with connection.cursor() as cursor:
        # First, add a temporary text column
        cursor.execute("""
            ALTER TABLE jobs_job 
            ADD COLUMN posted_date_temp VARCHAR(100) DEFAULT 'Just now';
        """)
        
        # Update the temp column with converted datetime values
        cursor.execute("""
            UPDATE jobs_job 
            SET posted_date_temp = CASE
                WHEN posted_date IS NULL THEN 'Just now'
                WHEN posted_date > NOW() - INTERVAL '1 minute' THEN 'Just now'
                WHEN posted_date > NOW() - INTERVAL '1 hour' THEN 
                    EXTRACT(EPOCH FROM (NOW() - posted_date))::int / 60 || ' minutes ago'
                WHEN posted_date > NOW() - INTERVAL '1 day' THEN 
                    EXTRACT(EPOCH FROM (NOW() - posted_date))::int / 3600 || ' hours ago'
                WHEN posted_date > NOW() - INTERVAL '2 days' THEN '1 day ago'
                WHEN posted_date > NOW() - INTERVAL '30 days' THEN 
                    EXTRACT(EPOCH FROM (NOW() - posted_date))::int / 86400 || ' days ago'
                WHEN posted_date > NOW() - INTERVAL '365 days' THEN 
                    EXTRACT(EPOCH FROM (NOW() - posted_date))::int / 2592000 || ' months ago'
                ELSE EXTRACT(EPOCH FROM (NOW() - posted_date))::int / 31536000 || ' years ago'
            END;
        """)
        
        # Drop the old column
        cursor.execute("ALTER TABLE jobs_job DROP COLUMN posted_date;")
        
        # Rename the temp column to posted_date
        cursor.execute("ALTER TABLE jobs_job RENAME COLUMN posted_date_temp TO posted_date;")


def reverse_migrate_string_to_datetime(apps, schema_editor):
    """Reverse migration - convert string back to datetime (approximate)"""
    from datetime import datetime, timedelta
    
    with connection.cursor() as cursor:
        # Add a temporary datetime column
        cursor.execute("""
            ALTER TABLE jobs_job 
            ADD COLUMN posted_date_temp TIMESTAMP DEFAULT NOW();
        """)
        
        # Update with approximate datetime values based on string
        cursor.execute("""
            UPDATE jobs_job 
            SET posted_date_temp = CASE
                WHEN posted_date ILIKE '%just now%' THEN NOW()
                WHEN posted_date ILIKE '%minute%' THEN 
                    NOW() - (CAST(REGEXP_REPLACE(posted_date, '[^0-9]', '', 'g') AS INTEGER) || ' minutes')::INTERVAL
                WHEN posted_date ILIKE '%hour%' THEN 
                    NOW() - (CAST(REGEXP_REPLACE(posted_date, '[^0-9]', '', 'g') AS INTEGER) || ' hours')::INTERVAL
                WHEN posted_date ILIKE '%day%' THEN 
                    NOW() - (CAST(REGEXP_REPLACE(posted_date, '[^0-9]', '', 'g') AS INTEGER) || ' days')::INTERVAL
                WHEN posted_date ILIKE '%month%' THEN 
                    NOW() - (CAST(REGEXP_REPLACE(posted_date, '[^0-9]', '', 'g') AS INTEGER) || ' months')::INTERVAL
                WHEN posted_date ILIKE '%year%' THEN 
                    NOW() - (CAST(REGEXP_REPLACE(posted_date, '[^0-9]', '', 'g') AS INTEGER) || ' years')::INTERVAL
                ELSE NOW()
            END;
        """)
        
        # Drop the old column
        cursor.execute("ALTER TABLE jobs_job DROP COLUMN posted_date;")
        
        # Rename the temp column to posted_date
        cursor.execute("ALTER TABLE jobs_job RENAME COLUMN posted_date_temp TO posted_date;")


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0004_remove_job_is_active'),
    ]

    operations = [
        # Migrate data and change field type in one operation using raw SQL
        migrations.RunSQL(
            sql="""
                -- Add temporary text column
                ALTER TABLE jobs_job ADD COLUMN posted_date_temp VARCHAR(100) DEFAULT 'Just now';
                
                -- Convert datetime to relative string
                UPDATE jobs_job 
                SET posted_date_temp = CASE
                    WHEN posted_date IS NULL THEN 'Just now'
                    WHEN posted_date > NOW() - INTERVAL '1 minute' THEN 'Just now'
                    WHEN posted_date > NOW() - INTERVAL '1 hour' THEN 
                        FLOOR(EXTRACT(EPOCH FROM (NOW() - posted_date)) / 60)::text || ' minutes ago'
                    WHEN posted_date > NOW() - INTERVAL '1 day' THEN 
                        FLOOR(EXTRACT(EPOCH FROM (NOW() - posted_date)) / 3600)::text || ' hours ago'
                    WHEN posted_date > NOW() - INTERVAL '2 days' THEN '1 day ago'
                    WHEN posted_date > NOW() - INTERVAL '30 days' THEN 
                        FLOOR(EXTRACT(EPOCH FROM (NOW() - posted_date)) / 86400)::text || ' days ago'
                    WHEN posted_date > NOW() - INTERVAL '365 days' THEN 
                        FLOOR(EXTRACT(EPOCH FROM (NOW() - posted_date)) / 2592000)::text || ' months ago'
                    ELSE FLOOR(EXTRACT(EPOCH FROM (NOW() - posted_date)) / 31536000)::text || ' years ago'
                END;
                
                -- Drop old column
                ALTER TABLE jobs_job DROP COLUMN posted_date;
                
                -- Rename temp column
                ALTER TABLE jobs_job RENAME COLUMN posted_date_temp TO posted_date;
            """,
            reverse_sql="""
                -- Add temporary datetime column
                ALTER TABLE jobs_job ADD COLUMN posted_date_temp TIMESTAMP DEFAULT NOW();
                
                -- Convert string back to approximate datetime
                UPDATE jobs_job 
                SET posted_date_temp = CASE
                    WHEN posted_date ILIKE '%just now%' THEN NOW()
                    WHEN posted_date ILIKE '%minute%' THEN 
                        NOW() - (CAST(REGEXP_REPLACE(posted_date, '[^0-9]', '', 'g') AS INTEGER) || ' minutes')::INTERVAL
                    WHEN posted_date ILIKE '%hour%' THEN 
                        NOW() - (CAST(REGEXP_REPLACE(posted_date, '[^0-9]', '', 'g') AS INTEGER) || ' hours')::INTERVAL
                    WHEN posted_date ILIKE '%day%' THEN 
                        NOW() - (CAST(REGEXP_REPLACE(posted_date, '[^0-9]', '', 'g') AS INTEGER) || ' days')::INTERVAL
                    WHEN posted_date ILIKE '%month%' THEN 
                        NOW() - (CAST(REGEXP_REPLACE(posted_date, '[^0-9]', '', 'g') AS INTEGER) || ' months')::INTERVAL
                    WHEN posted_date ILIKE '%year%' THEN 
                        NOW() - (CAST(REGEXP_REPLACE(posted_date, '[^0-9]', '', 'g') AS INTEGER) || ' years')::INTERVAL
                    ELSE NOW()
                END;
                
                -- Drop old column
                ALTER TABLE jobs_job DROP COLUMN posted_date;
                
                -- Rename temp column
                ALTER TABLE jobs_job RENAME COLUMN posted_date_temp TO posted_date;
            """,
        ),
        # Update the model state to reflect the field change
        migrations.AlterField(
            model_name='job',
            name='posted_date',
            field=models.CharField(default='Just now', max_length=100),
        ),
    ]

