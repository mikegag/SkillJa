import json
from django.shortcuts import redirect, get_object_or_404, render
from django.contrib.auth import login as auth_login, authenticate
from django.contrib.auth import logout
from django.http import JsonResponse, HttpResponseRedirect
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import User
from django.middleware.csrf import get_token, rotate_token
from django.shortcuts import redirect
from urllib.parse import urlparse, parse_qs
from django.views.decorators.http import require_POST, require_GET


def csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})
    
@require_POST
def user_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        user = authenticate(request, username=email, password=password)
        if user is not None:
            auth_login(request,user)
            response = JsonResponse({'message': 'Login Successful'}, status = 200)
            response.set_cookie ('user_email', email, httponly=True, secure = False)
            return response
        else:
            return JsonResponse({'error': 'Invalid email or password'}, status = 400)
 
@require_POST
def user_logout(request):
    if request.method == 'POST':
        logout(request)
        request.session.flush()
        rotate_token(request)
        response = JsonResponse({'message':'Logout Successful'}, status=200)
        response.delete_cookie('user_email')
        return response
    return JsonResponse({'error': 'Invalid request'}, status = 400)

@require_POST
def sign_up(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            user = User.objects.create_user(
                fullname=data['fullname'],
                email=data['email'],
                password=data['password'],
                birthdate = data['birthdate'],
                phonenumber = data['phonenumber'],
                gender = data['gender']
            )
            response = JsonResponse({'message': 'User created successfully'}, status=201)
            # signup is followed by onboarding process which needs user email
            response.set_cookie ('user_email', user.email, httponly=True, secure = False)
            return response

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)

@require_POST
def onboarding_user(request):
    try:
        # Extract the email from the cookie set when user logs in
        email = request.COOKIES.get('user_email')

        if not email:
            # If email is not found in cookies, return error
            return JsonResponse({'error': 'Email not found in cookies'}, status=400)

        user = User.objects.get(email=email)
 
        if request.method == 'POST':
            data = json.loads(request.body)

            # Check if user is setting coach preferences
            if 'experience_level' in data and 'age_groups' in data and 'specialization' in data:
                coach_preferences = CoachPreferences.objects.create(
                    user=user,
                    experience_level=data['experience_level'],
                    age_groups=data['age_groups'],
                    specialization=data['specialization']
                )
                return JsonResponse({'message': 'Coach preferences saved successfully'}, status=201)

            # Check if user is setting athlete preferences
            elif 'experience_level' in data and 'goals' in data and 'sport_interests' in data:
                athlete_preferences = AthletePreferences.objects.create(
                    user=user,
                    experience_level=data['experience_level'],
                    goals=data['goals'],
                    sport_interests=data['sport_interests']
                )
                return JsonResponse({'message': 'Athlete preferences saved successfully'}, status=201)

            else:
                return JsonResponse({'error': 'Invalid preferences data provided'}, status=400)

    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

# @require_GET
# def get_home_feed(request):
#     if request.method == 'GET':
        # returns current user's fullname using email = request.COOKIES.get('user_email')
        # returns 5 random coach objects containing their fullname, reviews, picture, specializations



@api_view(['GET'])
def getRoutes(request):

    routes = [
        {
            'Endpoint': '/login',
            'method': 'POST',
            'body': {
                'email': 'string',
                'password': 'string'
            },
            'description': 'Logs in an existing user'
        },
        {
            'Endpoint': '/signup',
            'method': 'POST',
            'body': {
                'fullname': 'string',
                'email': 'string',
                'username': 'string',
                'password': 'string'
            },
            'description': 'Creates a new user'
        }
    ]
    return Response(routes)