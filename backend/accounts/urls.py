from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.urls import path
from .views import (
    customTokenObtainPairView, 
    CustomRefreshTokenView, 
    logout, 
    is_authenticated, 
    register)
    
urlpatterns = [
    path('api/token/', customTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', CustomRefreshTokenView.as_view(), name='token_refresh'),
    path('api/logout/', logout, name='logout'),
    path('api/is-authenticated/', is_authenticated, name='is_authenticated'),
    path('api/register/', register, name='register'),
]