from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
import os


class Company(models.Model):
    slug = models.SlugField(unique=True, max_length=200)
    name = models.CharField(max_length=200)
    recruiter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='companies')
    
    # Brand Theme
    primary_color = models.CharField(max_length=7, default='#000000', help_text='Hex color code')
    secondary_color = models.CharField(max_length=7, default='#FFFFFF', help_text='Hex color code')
    logo = models.ImageField(upload_to='logos/', null=True, blank=True)
    banner = models.ImageField(upload_to='banners/', null=True, blank=True)
    culture_video_url = models.URLField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = 'Companies'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        # Delete old logo/banner files if being updated
        if self.pk:
            try:
                old_instance = Company.objects.get(pk=self.pk)
                # Delete old logo if new one is uploaded
                if old_instance.logo and self.logo != old_instance.logo:
                    try:
                        if old_instance.logo and os.path.isfile(old_instance.logo.path):
                            os.remove(old_instance.logo.path)
                    except (ValueError, OSError):
                        # File might not exist or already deleted
                        pass
                # Delete old banner if new one is uploaded
                if old_instance.banner and self.banner != old_instance.banner:
                    try:
                        if old_instance.banner and os.path.isfile(old_instance.banner.path):
                            os.remove(old_instance.banner.path)
                    except (ValueError, OSError):
                        # File might not exist or already deleted
                        pass
            except Company.DoesNotExist:
                pass
        
        if not self.slug:
            self.slug = slugify(self.name)
            # Ensure uniqueness
            original_slug = self.slug
            counter = 1
            while Company.objects.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)

