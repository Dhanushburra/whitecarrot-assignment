# Generated manually for adding new job fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0001_initial'),
    ]

    operations = [
        # Add new fields
        migrations.AddField(
            model_name='job',
            name='work_policy',
            field=models.CharField(
                choices=[('remote', 'Remote'), ('hybrid', 'Hybrid'), ('onsite', 'Onsite')],
                default='onsite',
                max_length=20
            ),
        ),
        migrations.AddField(
            model_name='job',
            name='employment_type',
            field=models.CharField(
                choices=[('full-time', 'Full Time'), ('part-time', 'Part Time'), ('contract', 'Contract')],
                default='full-time',
                max_length=20
            ),
        ),
        migrations.AddField(
            model_name='job',
            name='experience',
            field=models.CharField(
                blank=True,
                choices=[('junior', 'Junior'), ('mid-level', 'Mid Level'), ('senior', 'Senior')],
                max_length=20,
                null=True
            ),
        ),
        # Make job_type nullable for backward compatibility
        migrations.AlterField(
            model_name='job',
            name='job_type',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        # Data migration: Copy job_type to employment_type for existing records
        migrations.RunPython(
            code=lambda apps, schema_editor: migrate_job_type_to_employment_type(apps, schema_editor),
            reverse_code=lambda apps, schema_editor: reverse_migrate_job_type(apps, schema_editor),
        ),
    ]


def migrate_job_type_to_employment_type(apps, schema_editor):
    """Migrate existing job_type values to employment_type"""
    Job = apps.get_model('jobs', 'Job')
    
    # Map old job_type values to employment_type
    job_type_mapping = {
        'full-time': 'full-time',
        'part-time': 'part-time',
        'contract': 'contract',
        'internship': 'full-time',  # Map internship to full-time
    }
    
    for job in Job.objects.all():
        if job.job_type and not job.employment_type:
            job.employment_type = job_type_mapping.get(job.job_type, 'full-time')
            job.save(update_fields=['employment_type'])


def reverse_migrate_job_type(apps, schema_editor):
    """Reverse migration: copy employment_type back to job_type"""
    Job = apps.get_model('jobs', 'Job')
    
    for job in Job.objects.all():
        if job.employment_type and not job.job_type:
            job.job_type = job.employment_type
            job.save(update_fields=['job_type'])

