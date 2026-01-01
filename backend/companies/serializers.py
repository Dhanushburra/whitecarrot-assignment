from rest_framework import serializers
from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    recruiter_username = serializers.CharField(source='recruiter.username', read_only=True)
    logo_url = serializers.SerializerMethodField()
    banner_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = [
            'id', 'slug', 'name', 'recruiter', 'recruiter_username',
            'primary_color', 'secondary_color',
            'logo', 'logo_url', 'banner', 'banner_url', 'culture_video_url',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'recruiter', 'created_at', 'updated_at']
    
    def get_logo_url(self, obj):
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url
        return None
    
    def get_banner_url(self, obj):
        if obj.banner:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.banner.url)
            return obj.banner.url
        return None


class CompanyPublicSerializer(serializers.ModelSerializer):
    """Serializer for public careers page (no sensitive data)"""
    logo_url = serializers.SerializerMethodField()
    banner_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = [
            'id', 'slug', 'name',
            'primary_color', 'secondary_color',
            'logo_url', 'banner_url', 'culture_video_url',
        ]
    
    def get_logo_url(self, obj):
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url
        return None
    
    def get_banner_url(self, obj):
        if obj.banner:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.banner.url)
            return obj.banner.url
        return None

