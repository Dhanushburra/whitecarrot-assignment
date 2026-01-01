from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .models import Company
from .serializers import CompanySerializer, CompanyPublicSerializer


class CompanyViewSet(viewsets.ModelViewSet):
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'
    
    def get_queryset(self):
        """Recruiters can only see their own company"""
        return Company.objects.filter(recruiter=self.request.user)
    
    def perform_create(self, serializer):
        """Automatically assign recruiter when creating company"""
        serializer.save(recruiter=self.request.user)
    
    @action(detail=False, methods=['get', 'put', 'patch', 'post'])
    def me(self, request):
        """Get, create, or update current user's company"""
        company = Company.objects.filter(recruiter=request.user).first()
        
        if request.method == 'GET':
            if not company:
                return Response(
                    {'error': 'No company found. Please create one first.'},
                    status=status.HTTP_404_NOT_FOUND
                )
            serializer = self.get_serializer(company)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            # Create new company
            if company:
                return Response(
                    {'error': 'You already have a company. Use PUT to update it.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            name = request.data.get('name')
            if not name:
                return Response(
                    {'error': 'Company name is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            company = Company.objects.create(
                recruiter=request.user,
                name=name
            )
            serializer = self.get_serializer(company)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        elif request.method in ['PUT', 'PATCH']:
            if not company:
                # Create company if it doesn't exist
                company = Company.objects.create(
                    recruiter=request.user,
                    name=request.data.get('name', f"{request.user.username}'s Company")
                )
            
            # Store old file paths before update
            old_logo_path = None
            old_banner_path = None
            try:
                if company.logo:
                    old_logo_path = company.logo.path
                if company.banner:
                    old_banner_path = company.banner.path
            except (ValueError, AttributeError):
                # Files might not exist
                pass
            
            serializer = self.get_serializer(company, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
            # Delete old files if new ones were uploaded (handled in model.save, but double-check here)
            import os
            updated_company = Company.objects.get(pk=company.pk)
            try:
                if old_logo_path and updated_company.logo:
                    new_logo_path = updated_company.logo.path
                    if old_logo_path != new_logo_path and os.path.isfile(old_logo_path):
                        os.remove(old_logo_path)
            except (ValueError, OSError, AttributeError):
                pass
            
            try:
                if old_banner_path and updated_company.banner:
                    new_banner_path = updated_company.banner.path
                    if old_banner_path != new_banner_path and os.path.isfile(old_banner_path):
                        os.remove(old_banner_path)
            except (ValueError, OSError, AttributeError):
                pass
            
            return Response(serializer.data)
    
    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def public(self, request, slug=None):
        """Public endpoint for careers page (no auth required)"""
        company = get_object_or_404(Company, slug=slug)
        serializer = CompanyPublicSerializer(company, context={'request': request})
        return Response(serializer.data)

