from django.urls import path
from . import views
from .views import csrf_token

urlpatterns = [
    path('csrf_token/', csrf_token, name='csrf_token'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('signup/', views.sign_up, name='signup'),
    path('auth/onboarding/', views.onboarding_user, name='onboarding'),
    # path('auth/home-feed/', views.logout_view, name='home-feed'),
    # path('auth/coach/<int:pk>/', views.logout_view, name='home-feed'),
    # path('auth/calendar/', views.logout_view, name='calendar'),
    # path('auth/profile/', views.logout_view, name='profile'),
    # path('auth/profile/settings/account-information/', views.logout_view, name='account-information'),
    # path('auth/profile/settings/payments/', views.logout_view, name='payments'),
    # path('auth/profile/settings/notifications/', views.logout_view, name='notifications'),
    # path('auth/profile/settings/faqs/', views.logout_view, name='faqs'),
    # path('auth/profile/settings/report-issue/', views.logout_view, name='report-issue')
]   