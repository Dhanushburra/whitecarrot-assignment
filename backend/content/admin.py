from django.contrib import admin
from .models import ContentSection


@admin.register(ContentSection)
class ContentSectionAdmin(admin.ModelAdmin):
    list_display = ['title', 'company', 'section_type', 'order', 'is_active', 'created_at']
    list_filter = ['section_type', 'is_active', 'created_at', 'company']
    search_fields = ['title', 'content', 'company__name']
    ordering = ['company', 'order']

