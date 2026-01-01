from django.contrib import admin
from .models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'recruiter', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'slug', 'recruiter__username']

