from django.contrib import admin
from .models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['title', 'company', 'location', 'employment_type', 'work_policy', 'posted_date']
    list_filter = ['employment_type', 'work_policy', 'experience', 'posted_date', 'company']
    search_fields = ['title', 'description', 'location', 'company__name']

