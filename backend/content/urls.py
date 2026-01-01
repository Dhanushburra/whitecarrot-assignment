from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContentSectionViewSet

router = DefaultRouter()
router.register(r'', ContentSectionViewSet, basename='content-section')

urlpatterns = [
    path('', include(router.urls)),
]

