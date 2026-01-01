from rest_framework import viewsets, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from .models import Job
from .serializers import JobSerializer, JobPublicSerializer
from companies.models import Company


class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None  # Disable pagination for list view
    
    def get_queryset(self):
        """Recruiters can only see jobs from their company"""
        company = Company.objects.filter(recruiter=self.request.user).first()
        if company:
            return Job.objects.filter(company=company)
        return Job.objects.none()
    
    def perform_create(self, serializer):
        """Automatically assign company when creating job"""
        company = Company.objects.filter(recruiter=self.request.user).first()
        if not company:
            raise serializers.ValidationError("You must create a company first")
        serializer.save(company=company)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public(self, request):
        """Public endpoint for job listings with filters"""
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
        
        # Get jobs for the company
        jobs = Job.objects.filter(company=company)
        
        # Apply filters - all filters use AND logic (all must match)
        # Each filter is applied independently and correctly
        
        location = request.query_params.get('location')
        if location and location.strip():
            jobs = jobs.filter(location__icontains=location.strip())
        
        # Employment Type - normalize and use exact match (case-insensitive)
        employment_type = request.query_params.get('employment_type')
        if employment_type and employment_type.strip():
            emp_type = employment_type.strip().lower()
            # Normalize to match model choices
            emp_type_mapping = {
                'full-time': 'full-time',
                'fulltime': 'full-time',
                'full time': 'full-time',
                'part-time': 'part-time',
                'parttime': 'part-time',
                'part time': 'part-time',
                'contract': 'contract',
            }
            normalized_emp_type = emp_type_mapping.get(emp_type, emp_type)
            jobs = jobs.filter(employment_type__iexact=normalized_emp_type)
        
        # Work Policy - normalize and use exact match (case-insensitive)
        work_policy = request.query_params.get('work_policy')
        if work_policy and work_policy.strip():
            policy = work_policy.strip().lower()
            # Normalize to match model choices
            policy_mapping = {
                'remote': 'remote',
                'hybrid': 'hybrid',
                'onsite': 'onsite',
                'on-site': 'onsite',
                'on site': 'onsite',
                'office': 'onsite',
            }
            normalized_policy = policy_mapping.get(policy, policy)
            jobs = jobs.filter(work_policy__iexact=normalized_policy)
        
        # Experience - normalize and use exact match (case-insensitive)
        # Note: experience can be NULL, so we need to handle that
        experience = request.query_params.get('experience')
        if experience and experience.strip():
            exp = experience.strip().lower()
            # Normalize to match model choices
            exp_mapping = {
                'senior': 'senior',
                'junior': 'junior',
                'mid-level': 'mid-level',
                'mid level': 'mid-level',
                'midlevel': 'mid-level',
                'mid': 'mid-level',
            }
            normalized_exp = exp_mapping.get(exp, exp)
            # Use exact match (case-insensitive) for experience filter
            # This will only match jobs where experience is not NULL and matches
            jobs = jobs.filter(experience__iexact=normalized_exp)
        
        department = request.query_params.get('department')
        if department and department.strip():
            jobs = jobs.filter(department__icontains=department.strip())
        
        # Search by title or description
        search = request.query_params.get('search')
        if search and search.strip():
            search_term = search.strip()
            jobs = jobs.filter(
                Q(title__icontains=search_term) | 
                Q(description__icontains=search_term)
            )
        
        serializer = JobPublicSerializer(jobs, many=True, context={'request': request})
        return Response(serializer.data)

