from django.urls import path
from . import views
from .views import csrf_token
 
urlpatterns = [
    path('', views.getRoutes, name="routes"),
    path('csrf_token/', csrf_token, name='csrf_token'),
    path('login/', views.user_login, name='login'),
]