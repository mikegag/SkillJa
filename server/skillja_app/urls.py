from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('signup/', views.logout_view, name='signup'),
    path('auth/home-feed', views.logout_view, name='home-feed'),
]