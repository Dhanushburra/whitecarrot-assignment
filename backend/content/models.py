from django.db import models
from companies.models import Company


class ContentSection(models.Model):
    SECTION_TYPES = [
        ('about', 'About Us'),
        ('life', 'Life at Company'),
        ('benefits', 'Benefits'),
        ('values', 'Values'),
        ('mission', 'Mission'),
        ('custom', 'Custom'),
    ]
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='content_sections')
    section_type = models.CharField(max_length=20, choices=SECTION_TYPES)
    title = models.CharField(max_length=200)
    content = models.TextField()
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return f"{self.title} - {self.company.name}"

