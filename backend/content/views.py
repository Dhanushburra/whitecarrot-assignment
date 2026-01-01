from rest_framework import viewsets, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .models import ContentSection
from .serializers import ContentSectionSerializer, ContentSectionPublicSerializer
from companies.models import Company


class ContentSectionViewSet(viewsets.ModelViewSet):
    serializer_class = ContentSectionSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None  # Disable pagination for list view
    
    def get_queryset(self):
        """Recruiters can only see sections from their company"""
        company = Company.objects.filter(recruiter=self.request.user).first()
        if company:
            return ContentSection.objects.filter(company=company)
        return ContentSection.objects.none()
    
    def perform_create(self, serializer):
        """Automatically assign company when creating section"""
        company = Company.objects.filter(recruiter=self.request.user).first()
        if not company:
            raise serializers.ValidationError("You must create a company first")
        serializer.save(company=company)
    
    @action(detail=False, methods=['post'])
    def reorder(self, request):
        """Reorder sections by providing list of section IDs in new order"""
        section_ids = request.data.get('section_ids', [])
        
        if not section_ids:
            return Response(
                {'error': 'section_ids is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        company = Company.objects.filter(recruiter=request.user).first()
        if not company:
            return Response(
                {'error': 'Company not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Update order for each section
        for index, section_id in enumerate(section_ids):
            ContentSection.objects.filter(
                id=section_id,
                company=company
            ).update(order=index)
        
        # Return updated sections
        sections = ContentSection.objects.filter(company=company).order_by('order')
        serializer = self.get_serializer(sections, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public(self, request):
        """Public endpoint for content sections"""
        company_slug = request.query_params.get('company')
        
        if not company_slug:
            return Response(
                {'error': 'Company slug is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            company = Company.objects.get(slug=company_slug)
        except Company.DoesNotExist:
            return Response(
                {'error': 'Company not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        sections = ContentSection.objects.filter(
            company=company,
            is_active=True
        ).order_by('order')
        
        serializer = ContentSectionPublicSerializer(sections, many=True)
        return Response(serializer.data)

