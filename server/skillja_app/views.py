import json
from django.shortcuts import redirect, get_object_or_404, render
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login as auth_login, authenticate
from django.contrib.auth import logout
from django.http import JsonResponse, HttpResponseRedirect
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import User, CoachPreferences, AthletePreferences, CoachProfile, AthleteProfile, Service, Review
from django.middleware.csrf import get_token, rotate_token
from django.shortcuts import redirect
from urllib.parse import urlparse, parse_qs
from django.views.decorators.http import require_POST, require_GET

def index(request):
    return render(request, 'index.html')
    
def csrf_token(request):
    if request.method == 'GET':
        token = get_token(request)
        return JsonResponse({'csrfToken': token})
    else:
        logger.error('Bad request method--')
        return JsonResponse({'error': '-Bad request'}, status=400)
    
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

@require_GET
def get_user_profile(request):
    try:
        # Extract the email from the cookie
        email = request.COOKIES.get('user_email')
        if not email:
            return JsonResponse({'error': 'Email not found in cookies'}, status=400)

        user = User.objects.get(email=email)
        data = {
            'name': user.fullname,
            'email': user.email,
            'iscoach': user.iscoach,
            'isathlete': user.isathlete,
        }

        if user.isathlete:
            athlete_profile = AthleteProfile.objects.get(user=user)
            athlete_preferences = AthletePreferences.objects.get(user=user)

            data.update({
                'profile': {
                    'location': athlete_profile.location,
                    'biography': athlete_profile.biography,
                    'picture': athlete_profile.picture.url if athlete_profile.picture else None,
                    'reviews': [review.id for review in athlete_profile.reviews.all()],
                },
                'preferences': {
                    'experience_level': athlete_preferences.experience_level,
                    'goals': athlete_preferences.goals.split(',') if athlete_preferences.goals else [],
                    'sport_interests': athlete_preferences.sport_interests.split(',') if athlete_preferences.sport_interests else [],
                }
            })
        
        elif user.iscoach:
            coach_profile = CoachProfile.objects.get(user=user)
            coach_preferences = CoachPreferences.objects.get(user=user)

            data.update({
                'profile': {
                    'location': coach_profile.location,
                    'biography': coach_profile.biography,
                    'picture': coach_profile.picture.url if coach_profile.picture else None,
                    'reviews': [review.id for review in coach_profile.reviews.all()],
                },
                'preferences': {
                    'experience_level': coach_preferences.experience_level,
                    'age_groups': coach_preferences.age_groups.split(',') if coach_preferences.age_groups else [],
                    'specialization': coach_preferences.specialization.split(',') if coach_preferences.specialization else [],
                }
            })
        
        else:
            return JsonResponse({'error': 'User is neither an athlete nor a coach'}, status=400)

        return JsonResponse({'user_profile': data}, status=200)

    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except (AthleteProfile.DoesNotExist, CoachProfile.DoesNotExist, AthletePreferences.DoesNotExist, CoachPreferences.DoesNotExist) as e:
        return JsonResponse({'error': f'Related profile or preferences not found: {str(e)}'}, status=404)


@api_view(['GET'])
def getRoutes(request):

    routes = [
        {
            'Endpoint': '/',
            'method': 'GET',
            'description': 'Renders the index page (usually for frontend or landing page).'
        },
        {
            'Endpoint': '/csrf_token/',
            'method': 'GET',
            'description': 'Provides a CSRF token for client-side operations.'
        },
        {
            'Endpoint': '/login/',
            'method': 'POST',
            'body': {
                'email': 'string',
                'password': 'string'
            },
            'description': 'Authenticates a user and logs them in. Sets a cookie for user email.'
        },
        {
            'Endpoint': '/logout/',
            'method': 'POST',
            'description': 'Logs out the user and deletes the email cookie.'
        },
        {
            'Endpoint': '/signup/',
            'method': 'POST',
            'body': {
                'fullname': 'string',
                'email': 'string',
                'password': 'string',
                'birthdate': 'YYYY-MM-DD',
                'phonenumber': 'string',
                'gender': 'string'
            },
            'description': 'Creates a new user and sets a cookie for user email upon successful registration.'
        },
        {
            'Endpoint': '/auth/onboarding/',
            'method': 'POST',
            'body': {
                'experience_level': 'string',
                'age_groups': 'string (comma-separated for coaches) or null',
                'specialization': 'string (comma-separated for coaches) or null',
                'goals': 'string (comma-separated for athletes) or null',
                'sport_interests': 'string (comma-separated for athletes) or null'
            },
            'description': 'Saves onboarding preferences for the logged-in user, either as a coach or athlete.'
        },
        {
            'Endpoint': '/auth/profile/',
            'method': 'GET',
            'description': 'Retrieves the profile details of the logged-in user.'
        },
        {
            'Endpoint': '/api/routes/',
            'method': 'GET',
            'description': 'Provides a list of API endpoints and their descriptions. Useful for documentation.'
        }
    ]
    return Response(routes)