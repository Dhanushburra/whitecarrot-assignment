"""
URL configuration for careers_builder project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.db import connection

def api_root(request):
    """API root endpoint"""
    # Test database connection
    db_status = "unknown"
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)[:100]}"
    
    return JsonResponse({
        'message': 'Careers Page Builder API',
        'version': '1.0',
        'database': db_status,
        'endpoints': {
            'auth': '/api/auth/',
            'companies': '/api/companies/',
            'jobs': '/api/jobs/',
            'content': '/api/content/',
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('api/', api_root, name='api-root-alt'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/companies/', include('companies.urls')),
    path('api/jobs/', include('jobs.urls')),
    path('api/content/', include('content.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

