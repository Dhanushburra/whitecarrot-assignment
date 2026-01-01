"""
Management command to create sample data for testing
Usage: python manage.py create_sample_data
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from companies.models import Company
from content.models import ContentSection
from jobs.models import Job


class Command(BaseCommand):
    help = 'Creates sample data for testing'

    def handle(self, *args, **options):
        # Create sample user if doesn't exist
        user, created = User.objects.get_or_create(
            username='demo',
            defaults={
                'email': 'demo@example.com',
                'first_name': 'Demo',
                'last_name': 'User',
            }
        )
        if created:
            user.set_password('demo123')
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Created user: {user.username}'))
        else:
            self.stdout.write(self.style.WARNING(f'User {user.username} already exists'))

        # Create sample company
        company, created = Company.objects.get_or_create(
            recruiter=user,
            defaults={
                'name': 'Tech Innovations Inc.',
                'slug': 'tech-innovations',
                'primary_color': '#2563eb',
                'secondary_color': '#ffffff',
                'culture_video_url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created company: {company.name}'))
        else:
            self.stdout.write(self.style.WARNING(f'Company {company.name} already exists'))

        # Create sample content sections
        sections_data = [
            {
                'section_type': 'about',
                'title': 'About Us',
                'content': 'We are a forward-thinking technology company dedicated to innovation and excellence. Our team of passionate professionals works together to create solutions that make a difference.',
                'order': 0,
            },
            {
                'section_type': 'values',
                'title': 'Our Values',
                'content': '• Innovation: We embrace new ideas and technologies\n• Integrity: We do the right thing, always\n• Collaboration: We work together to achieve greatness\n• Growth: We invest in our people and their development',
                'order': 1,
            },
            {
                'section_type': 'benefits',
                'title': 'Benefits & Perks',
                'content': '• Competitive salary and equity\n• Comprehensive health insurance\n• Flexible working hours and remote options\n• Professional development budget\n• Generous vacation time\n• Team building events and activities',
                'order': 2,
            },
        ]

        for section_data in sections_data:
            section, created = ContentSection.objects.get_or_create(
                company=company,
                section_type=section_data['section_type'],
                defaults=section_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created section: {section.title}'))

        # Create sample jobs
        jobs_data = [
            {
                'title': 'Senior Software Engineer',
                'description': 'We are looking for an experienced software engineer to join our team. You will work on cutting-edge projects and collaborate with a talented team.',
                'location': 'San Francisco, CA',
                'employment_type': 'full-time',
                'department': 'Engineering',
                'salary_range': '$120k - $180k',
            },
            {
                'title': 'Product Designer',
                'description': 'Join our design team to create beautiful and intuitive user experiences. You will work closely with product managers and engineers.',
                'location': 'Remote',
                'employment_type': 'full-time',
                'department': 'Design',
                'salary_range': '$90k - $130k',
            },
            {
                'title': 'Marketing Intern',
                'description': 'Great opportunity for students to gain real-world marketing experience. You will assist with campaigns and content creation.',
                'location': 'New York, NY',
                'employment_type': 'full-time',
                'department': 'Marketing',
            },
        ]

        for job_data in jobs_data:
            # Set default posted_date if not provided
            if 'posted_date' not in job_data:
                job_data['posted_date'] = '2 days ago'
            
            job, created = Job.objects.get_or_create(
                company=company,
                title=job_data['title'],
                defaults=job_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created job: {job.title}'))

        self.stdout.write(self.style.SUCCESS('\nSample data created successfully!'))
        self.stdout.write(self.style.SUCCESS(f'\nLogin credentials:'))
        self.stdout.write(self.style.SUCCESS(f'  Username: demo'))
        self.stdout.write(self.style.SUCCESS(f'  Password: demo123'))
        self.stdout.write(self.style.SUCCESS(f'\nPublic careers page: http://localhost:5173/{company.slug}/careers'))

