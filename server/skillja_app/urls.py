from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('signup/', views.logout_view, name='signup'),
    path('auth/onboarding/', views.logout_view, name='onboarding'),
    path('auth/home-feed/', views.logout_view, name='home-feed'),
    path('auth/coach/<int:pk>/', views.logout_view, name='home-feed'),
    path('auth/calendar/', views.logout_view, name='calendar'),
    path('auth/profile/', views.logout_view, name='profile'),
    path('auth/profile/settings/account-information/', views.logout_view, name='account-information'),
    path('auth/profile/settings/payments/', views.logout_view, name='payments'),
    path('auth/profile/settings/notifications/', views.logout_view, name='notifications'),
    path('auth/profile/settings/faqs/', views.logout_view, name='faqs'),
    path('auth/profile/settings/report-issue/', views.logout_view, name='report-issue')
]   