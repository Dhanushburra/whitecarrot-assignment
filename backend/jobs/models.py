from django.db import models
from companies.models import Company


class Job(models.Model):
    EMPLOYMENT_TYPES = [
        ('full-time', 'Full Time'),
        ('part-time', 'Part Time'),
        ('contract', 'Contract'),
    ]
    
    WORK_POLICIES = [
        ('remote', 'Remote'),
        ('hybrid', 'Hybrid'),
        ('onsite', 'Onsite'),
    ]
    
    EXPERIENCE_LEVELS = [
        ('senior', 'Senior'),
        ('junior', 'Junior'),
        ('mid-level', 'Mid-level'),
    ]
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    location = models.CharField(max_length=200)
    work_policy = models.CharField(max_length=20, choices=WORK_POLICIES, default='onsite')
    department = models.CharField(max_length=100, null=True, blank=True)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPES, default='full-time')
    experience = models.CharField(max_length=20, choices=EXPERIENCE_LEVELS, null=True, blank=True)
    salary_range = models.CharField(max_length=100, null=True, blank=True)
    posted_date = models.CharField(max_length=100, default='Just now')
    
    # Legacy field - kept for backward compatibility during migration
    job_type = models.CharField(max_length=20, null=True, blank=True)
    
    def save(self, *args, **kwargs):
        # Auto-populate employment_type from job_type if job_type exists and employment_type is default
        if self.job_type and not self.employment_type:
            # Map old job_type values to employment_type
            job_type_mapping = {
                'full-time': 'full-time',
                'part-time': 'part-time',
                'contract': 'contract',
                'internship': 'full-time',  # Map internship to full-time
            }
            self.employment_type = job_type_mapping.get(self.job_type, 'full-time')
        super().save(*args, **kwargs)
    
    class Meta:
        ordering = ['-id']  # Order by ID since posted_date is now a string
    
    def __str__(self):
        return f"{self.title} - {self.company.name}"

