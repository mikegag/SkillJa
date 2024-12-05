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
    path('random_profiles/', views.random_profiles, name='random_profiles'),
    path('auth_status/', views.auth_status, name='auth_status'),
    path('auth/onboarding/', views.onboarding_user, name='onboarding'),
    path('auth/profile/', views.get_user_profile, name='profile'),
    path('auth/coach/<int:coach_id>/', views.get_coach_profile, name='coach_profile'),
    path('auth/profile/services/', views.get_coach_services, name='coach_services'),
    path('auth/profile/update_athlete_profile/', views.update_athlete_profile, name='update_athlete_profile'),
    path('auth/profile/update_coach_profile/', views.update_coach_profile, name='update_coach_profile'),
    path('auth/profile/create_service/', views.create_coach_service, name='create_coach_service'),
    path('auth/profile/delete_service/', views.delete_coach_service, name='delete_coach_service'),
    path('stripe/config/', views.stripe_config, name='stripe_config'),
    path('stripe/create_stripe_checkout/', views.create_stripe_checkout, name='create_stripe_checkout'),
    path('stripe/get_order_details/', views.get_order_details, name='get_order_details')
]   