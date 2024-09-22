from django.urls import path
from . import views
from .views import csrf_token
from django.views.generic import TemplateView

urlpatterns = [
    path('', views.index, name='index'),
    path('csrf_token/', csrf_token, name='csrf_token'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('signup/', views.sign_up, name='signup'),
    path('search/', views.search, name='search'),
    path('auth_status/', views.auth_status, name='auth_status'),
    path('auth/onboarding/', views.onboarding_user, name='onboarding'),
    path('auth/profile/', views.get_user_profile, name='profile'),
    path('auth/coach/', views.get_coach_profile, name='coach'),
    path('auth/profile/services', views.get_coach_services, name='services'),
    path('random_profiles/', views.random_profiles, name='random_profiles')
]   