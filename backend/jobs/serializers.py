from rest_framework import serializers
from .models import Job
from companies.serializers import CompanyPublicSerializer


class JobSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    company_slug = serializers.CharField(source='company.slug', read_only=True)
    company = serializers.PrimaryKeyRelatedField(read_only=True)
    job_type = serializers.CharField(source='employment_type', read_only=True)  # Backward compatibility
    
    class Meta:
        model = Job
        fields = [
            'id', 'company', 'company_name', 'company_slug',
            'title', 'description', 'location', 'work_policy',
            'department', 'employment_type', 'job_type', 'experience',
            'salary_range', 'posted_date'
        ]
        read_only_fields = ['id', 'company']


class JobPublicSerializer(serializers.ModelSerializer):
    """Serializer for public job listings"""
    company = CompanyPublicSerializer(read_only=True)
    job_type = serializers.CharField(source='employment_type', read_only=True)  # Backward compatibility
    
    class Meta:
        model = Job
        fields = [
            'id', 'company', 'title', 'description', 'location',
            'work_policy', 'department', 'employment_type', 'job_type',
            'experience', 'salary_range', 'posted_date'
        ]

