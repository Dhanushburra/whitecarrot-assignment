from rest_framework import serializers
from .models import ContentSection


class ContentSectionSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    company_slug = serializers.CharField(source='company.slug', read_only=True)
    company = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = ContentSection
        fields = [
            'id', 'company', 'company_name', 'company_slug',
            'section_type', 'title', 'content', 'order',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'company', 'created_at', 'updated_at']


class ContentSectionPublicSerializer(serializers.ModelSerializer):
    """Serializer for public careers page"""
    class Meta:
        model = ContentSection
        fields = ['id', 'section_type', 'title', 'content', 'order']
        read_only_fields = ['id']

