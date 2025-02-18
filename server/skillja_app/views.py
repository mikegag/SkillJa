from django.forms import model_to_dict
import pytz
import json, os, stripe, requests, jwt, cloudinary, cloudinary.uploader, time
from venv import logger
from django.db import DatabaseError, IntegrityError, transaction
from django.db.models import Q
from django.shortcuts import render
from django.contrib.auth import login as auth_login, authenticate
from django.contrib.auth import logout
from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import User, CoachPreferences, AthletePreferences, CoachProfile, AthleteProfile, Service, Review, SocialMedia, Settings, Chat, Message, Calendar, Event, CoachAvailability, BlockedDay, WeeklySchedule, MonthSchedule, Location
from django.middleware.csrf import get_token, rotate_token
from django.views.decorators.http import require_POST, require_GET
from django.contrib.auth.decorators import login_required
from .utils import calculate_price_deviance, calculate_coach_cost, calculate_coach_review, calculate_distance
from django.core.exceptions import ObjectDoesNotExist
from django.template.loader import render_to_string
from datetime import datetime, timedelta, date, timezone
from django.utils.timezone import now, make_aware, get_current_timezone
from django.utils.dateparse import parse_date
from django.core.paginator import Paginator, EmptyPage


# Authentication methods ----------------------------------------
def index(request):
    return render(request, 'index.html')

@require_GET
def csrf_token(request):
    if request.method == 'GET':
        token = get_token(request)
        return JsonResponse({'csrfToken': token})
    else:
        logger.error('Bad request method--')
        return JsonResponse({'error': '-Bad request'}, status=400)
    
@require_POST
def user_login(request):
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        # check if user has a valid account
        user = authenticate(request, username=email, password=password)
        if user is not None:
            # check if user account has been email confirmed
            if user.is_active:
                auth_login(request,user)
                response = JsonResponse({'message': 'Login Successful'}, status = 200)
                response.set_cookie ('user_email', email, httponly=True, secure = True, samesite='Lax')
                return response
            else:
                return JsonResponse({"inactive": "user has not confirmed their account/is inactive"}, status=204)
        else:
            return JsonResponse({'error': 'Invalid email or password'}, status = 400)
    except Exception as e:
        return JsonResponse({"error": "An unexpected error occurred"}, status=500)
 
@require_POST
@login_required
def user_logout(request):
    if request.method == 'POST':
        logout(request)
        request.session.flush()
        rotate_token(request)
        response = JsonResponse({'message':'Logout Successful'}, status=200)
        response.delete_cookie('user_email')
        response.delete_cookie('profile_image_url')
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

            # Authenticate the user using the raw password
            user = authenticate(request, username=data['email'], password=data['password'])
            if user is not None:
                auth_login(request,user)
                response = JsonResponse({'message': 'User created successfully'}, status=201)
                # signup is followed by onboarding process which needs user email
                response.set_cookie ('user_email', user.email, httponly=True, secure = True)
                return response

        except IntegrityError:
            return JsonResponse({'error': 'User with this email already exists.'}, status=400)
        except KeyError as e:
            return JsonResponse({'error': f'Missing field: {str(e)}'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request'}, status=400)

@require_GET
def auth_status(request):
    if request.user.is_authenticated:
        return JsonResponse({
            'is_logged_in': True,
            'email': request.user.email,
            'id': request.user.id
        })
    else:
        return JsonResponse({
            'is_logged_in': False,
            'username': None
        })

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

@require_POST
def verify_captcha(request):
    #Verify reCAPTCHA token with Google's API.
    url = "https://www.google.com/recaptcha/api/siteverify"
    # Parse JSON data
    data = json.loads(request.body)
    token = data.get('token')
    secret_key = os.getenv('RECAPTCHA_SECRET_KEY')
    if not token:
        return JsonResponse({"success": False, "error": "Token missing"}, status=400)

    try:
        response = requests.post(url, data={"secret": secret_key, "response": token})
        response_data = response.json()

        if response_data.get("success"):
            return JsonResponse({"success": True}, status=200)
        else:
            return JsonResponse({"success": False, "error": response_data.get("error-codes")})
    except requests.RequestException as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)

@require_GET
def get_user_email(request):
    email = request.COOKIES.get('user_email', 'No email found')
    return JsonResponse({'user_email': email})

@require_POST
def does_user_exist(request):
    try:
        # Parse JSON data
        data = json.loads(request.body)
        email = data.get('email')
        
        if not email:
            return JsonResponse({"error": "Email field is required."}, status=400)
        
        # Check if user with given email exists
        User.objects.get(email=email)
        return JsonResponse({"exists": True}, status=200)
    
    except User.DoesNotExist:
        return JsonResponse({"exists": False}, status=200)
    
    except Exception as e:
        return JsonResponse({"error": "An unexpected error occurred."}, status=500)

@require_GET
@login_required
def is_user_coach(request):
    try:
        coach = request.user
        if not coach:
            return JsonResponse({"error": "User was not found"}, status=400)
        return JsonResponse({"coach": coach.iscoach})
    except Exception as e:
        return JsonResponse({"error": "An unexpected error occurred. Please try again later."}, status=500)

@require_POST
@login_required
def update_user_timezone(request):
    try:
        data = json.loads(request.body)
        timezone = data.get("timezone", "UTC")
        # Update the user's timezone in the database
        user = request.user
        user.timezone = timezone
        user.save()

        return JsonResponse({"status": "success", "timezone": timezone})
    except Exception as e:
        return JsonResponse({"error": "an unexpected error occurred"},status=500)


# Settings methods ----------------------------------------------
@require_POST
@login_required
def delete_account(request):
    try:
        # Get the logged-in user
        user = request.user
        user_settings, created = Settings.objects.get_or_create(user=user)

        # Parse the request body
        try:
            data = json.loads(request.body)
            reason = data.get("reason", "N/A")
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON in request body."}, status=400)

        # Deactivate user account
        user.is_active = False
        user.save()

        # Save the account deletion reason
        user_settings.account_deletion_reason = reason
        user_settings.save()

        # Log out the user
        user_logout(request)

        return JsonResponse({"message": "User account has been successfully deactivated."}, status=200)

    except User.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)

    except Exception as e:
        return JsonResponse({"error": "An unexpected error occurred. Please try again later."}, status=500)

@require_GET
@login_required
def get_notification_preferences(request):
    try:
        # Retrieve the logged-in user
        user = request.user
        user_settings, created = Settings.objects.get_or_create(user=user)

        data = {
            'messaging': user_settings.email_message_notifications or False,
            'appointments': user_settings.email_appointment_notifications or False,
            'marketing': user_settings.email_marketing_notifications or False
        }
        
        return JsonResponse({"preferences": data}, status = 200)
    
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": "An unexpected error occurred. Please try again later."}, status = 500)

@require_POST
@login_required
def update_notification_preferences(request):    
    try:
        # Retrieve logged in user
        user = request.user
        user_settings, created = Settings.objects.get_or_create(user=user)

        # Parse json data from body
        preferences = json.loads(request.body)

        if 'messaging' in preferences:
            user_settings.email_message_notifications = preferences['messaging']
        if 'marketing' in preferences:
            user_settings.email_marketing_notifications = preferences['marketing']
        if 'appointments' in preferences:
            user_settings.email_appointment_notifications = preferences['appointments']
        
        # Save user settings with new updates
        user_settings.save()
        return JsonResponse({"success":"user notification preferences successfully updated"}, status=201)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": "An unexpected error occurred. Please try again later."}, status=500)


# Profile (Athlete & Coach) methods -----------------------------
@require_GET
@login_required
def get_user_profile(request):
    try:
        # Extract the email from the cookie
        email = request.COOKIES.get('user_email')
        if not email:
            return JsonResponse({'error': 'Email not found in cookies'}, status=400)

        user = User.objects.get(email=email)
        data = {
            'fullname': user.fullname,
            'id': user.id,
            'email': user.email,
            'iscoach': user.iscoach,
            'isathlete': user.isathlete,
            'phonenumber': user.phonenumber
        }

        if user.isathlete:
            athlete_profile, created_profile = AthleteProfile.objects.get_or_create(user=user)
            athlete_preferences, created_preferences = AthletePreferences.objects.get_or_create(user=user)  
            average_rating = calculate_coach_review(data['id']) or 0

            data.update({
                'profile': {
                    'location': athlete_profile.location,
                    'biography': athlete_profile.biography,
                    'primary_sport': athlete_profile.primary_sport,
                    'picture': athlete_profile.picture if athlete_profile.picture else None,
                    'reviews': [review.id for review in athlete_profile.reviews.all()],
                    'rating': average_rating,
                },
                'preferences': {
                    'experience_level': athlete_preferences.experience_level,
                    'goals': athlete_preferences.goals if athlete_preferences.goals else [],
                    'sport_interests': athlete_preferences.sport_interests if athlete_preferences.sport_interests else [],
                }
            })
        
        elif user.iscoach:
            coach_profile, created_profile = CoachProfile.objects.get_or_create(user=user)
            coach_preferences, created_preferences = CoachPreferences.objects.get_or_create(user=user)
            coach_socialMedia, created_socialMedia = SocialMedia.objects.get_or_create(user=user)
            average_rating = calculate_coach_review(data['id']) or 0
            
            data.update({
                'profile': {
                    'location': coach_profile.location,
                    'biography': coach_profile.biography,
                    'primary_sport': coach_profile.primary_sport,
                    'picture': coach_profile.picture if coach_profile.picture else None,
                    'reviews': [model_to_dict(review) for review in coach_profile.reviews.all()],
                    'services': [model_to_dict(service) for service in coach_profile.services.all()],
                    'rating': average_rating,
                    'instagram': coach_socialMedia.instagram,
                    'facebook': coach_socialMedia.facebook,
                    'twitter': coach_socialMedia.twitter,
                    'tiktok': coach_socialMedia.tiktok
                },
                'preferences': {
                    'experience_level': coach_preferences.experience_level,
                    'age_groups': coach_preferences.age_groups if coach_preferences.age_groups else [],
                    'specialization': coach_preferences.specialization if coach_preferences.specialization else [],
                }
            })
        
        else:
            return JsonResponse({'error': 'User is neither an athlete nor a coach'}, status=400)

        return JsonResponse({'user_profile': data}, status=200)

    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except (AthleteProfile.DoesNotExist, CoachProfile.DoesNotExist, AthletePreferences.DoesNotExist, CoachPreferences.DoesNotExist) as e:
        return JsonResponse({'error': f'Related profile or preferences not found: {str(e)}'}, status=404)

@require_POST
@login_required
def update_athlete_profile(request):
    try:
        # Extract the email from the cookie set when user logs in
        email = request.COOKIES.get('user_email')

        if not email:
            # If email is not found in cookies, return error
            return JsonResponse({'error': 'Email not found in cookies'}, status=400)

        # Get the user object
        user = User.objects.get(email=email)
        athlete_preferences, created = AthletePreferences.objects.get_or_create(user=user)
        athlete_profile, created = AthleteProfile.objects.get_or_create(user=user)

        # Check if the request method is POST
        if request.method == 'POST':
            data = json.loads(request.body)

            # Update only fields that are not empty
            if 'fullname' in data and data['fullname']:
                user.fullname = data['fullname']

            if 'phonenumber' in data and data['phonenumber']:
                user.phonenumber = data['phonenumber']

            if 'location' in data and data['location']:
                athlete_profile.location = data['location']

            if 'biography' in data and data['biography']:
                athlete_profile.biography = data['biography']

            if 'goals' in data and data['goals']:
                athlete_preferences.goals = data['goals']

            if 'primarySport' in data and data['primarySport']:
                athlete_profile.primary_sport = data['primarySport']

            if 'sportInterests' in data and data['sportInterests']:
                athlete_preferences.sport_interests = data['sportInterests']

            if 'experienceLevel' in data and data['experienceLevel']:
                athlete_preferences.experience_level = data['experienceLevel']

            # Save the updated preferences
            user.save()
            athlete_preferences.save()
            athlete_profile.save()

            return JsonResponse({'message': 'Athlete preferences updated successfully'}, status=201)

    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@require_POST
@login_required
def update_coach_profile(request):
    try:
        # Extract the email from the cookie set when user logs in
        email = request.COOKIES.get('user_email')

        if not email:
            # If email is not found in cookies, return error
            return JsonResponse({'error': 'Email not found in cookies'}, status=400)

        # Get the user object
        user = User.objects.get(email=email)
        coach_preferences, created = CoachPreferences.objects.get_or_create(user=user)
        coach_profile, created = CoachProfile.objects.get_or_create(user=user)
        coach_social_media, created = SocialMedia.objects.get_or_create(user=user)

        # Check if the request method is POST
        if request.method == 'POST':
            data = json.loads(request.body)

            # Update only fields that are not empty
            if 'fullname' in data and data['fullname']:
                user.fullname = data['fullname']

            if 'phonenumber' in data and data['phonenumber']:
                user.phonenumber = data['phonenumber']

            if 'location' in data and data['location']:
                coach_profile.location = data['location']
            
            if 'biography' in data and data['biography']:
                coach_profile.biography = data['biography']

            if 'ageGroups' in data and data['ageGroups']:
                coach_preferences.age_groups = data['ageGroups']

            if 'primarySport' in data and data['primarySport']:
                coach_profile.primary_sport = data['primarySport']

            if 'sportInterests' in data and data['sportInterests']:
                coach_preferences.specialization = data['sportInterests']

            if 'experienceLevel' in data and data['experienceLevel']:
                coach_preferences.experience_level = data['experienceLevel']
            
            if 'instagram' in data and data['instagram']:
                coach_social_media.instagram = data['instagram']

            if 'facebook' in data and data['facebook']:
                coach_social_media.facebook = data['facebook']

            if 'twitter' in data and data['twitter']:
                coach_social_media.twitter = data['twitter']

            if 'tiktok' in data and data['tiktok']:
                coach_social_media.tiktok = data['tiktok']

            # Save the updated preferences
            user.save()
            coach_preferences.save()
            coach_profile.save()
            coach_social_media.save()

            return JsonResponse({'message': 'Coach preferences updated successfully'}, status=201)

    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@require_GET
@login_required
def get_coach_profile(request):
    try:
        # Retrieve coach instance and related models safely
        coach_id = request.GET.get('coach_id')
        if not coach_id:
            return JsonResponse({'error': 'Coach ID is required'}, status=400)

        # Retrieve the user object (ensure this is a coach)
        try:
            user = User.objects.get(id=coach_id)
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'Coach not found'}, status=404)

        # Retrieve related models, handle missing data gracefully
        try:
            coach_preferences = CoachPreferences.objects.get(user=user)
        except ObjectDoesNotExist:
            coach_preferences = None

        try:
            coach_profile = CoachProfile.objects.select_related('user').prefetch_related('reviews', 'services').get(user=user)
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'Coach profile not found'}, status=404)

        try:
            coach_social_media = SocialMedia.objects.get(user=user)
        except ObjectDoesNotExist:
            coach_social_media = None
        
        # Retrieve average review rating for coach
        average_rating = calculate_coach_review(coach_id) or 0
        
        # Format the data
        data = {
            'userId': user.id,
            'fullname': user.fullname,
            'profile': {
                'location': coach_profile.location or '',
                'biography': coach_profile.biography or '',
                'primarySport': coach_profile.primary_sport or '', 
                'picture': coach_profile.picture if coach_profile.picture else None,
                'reviews': [model_to_dict(review) for review in coach_profile.reviews.all()],
                'services': [model_to_dict(service) for service in coach_profile.services.all()],
                'rating': average_rating,
                'socialMedia': {
                    'instagram': coach_social_media.instagram or None,
                    'facebook': coach_social_media.facebook or None,
                    'twitter': coach_social_media.twitter or None, 
                    'tiktok': coach_social_media.tiktok or None,
                }
            },
            'preferences': {
                'experience_level': coach_preferences.experience_level or '',
                'specialization': coach_preferences.specialization or [],
            }
        }

        return JsonResponse(data)

    except Exception as e:
        # Logging the error for easier debugging
        logger.error(f"Error retrieving coach profile: {str(e)}")
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)

@require_GET
@login_required
def get_coach_services(request):
    try:
        # Extract the email from the cookie
        email = request.COOKIES.get('user_email')
        if not email:
            return JsonResponse({'error': 'Email not found in cookies'}, status=400)

        try:
            coach = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Coach not found'}, status=404)

        if coach.iscoach:
            # Access related services through the `coach_profile` related name
            coach_profile = coach.coach_profile
            services = coach_profile.services.all()

            # Generate response data with model_to_dict to include all fields of the service
            service_data = [model_to_dict(service) for service in services]

            return JsonResponse({'services': service_data}, safe=False)
        else:
            return JsonResponse({'error': 'User is not a coach'}, status=400)

    except Exception as e:
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)

@require_POST
@login_required
def create_coach_service(request):
    try:
        # Extract the email from the cookie
        email = request.COOKIES.get('user_email')
        if not email:
            return JsonResponse({'error': 'Email not found in cookies'}, status=400)

        try:
            # Retrieve the user using the email from the cookie
            coach = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found with the provided email'}, status=404)

        # Retrieve the CoachProfile for this user
        coach_profile = coach.coach_profile

        # Parse incoming JSON data
        data = json.loads(request.body)

        # Check if the service ID is provided and if the service exists
        service_id = data.get('id')
        if service_id:
            try:
                # Attempt to retrieve the existing service
                service = Service.objects.get(id=service_id, coach_profile=coach_profile)
                # Update the service fields
                service.title = data['title']
                service.description = data['description']
                service.duration = data.get('duration', service.duration)
                service.frequency = data.get('frequency', service.frequency)
                service.target_audience = data.get('targetAudience', service.target_audience)
                service.location = data.get('location', service.location)
                service.deliverable = data.get('deliverable', service.deliverable)
                service.session_length = data.get('sessionLength', service.session_length)
                service.price = data['price']
                service.save()

                return JsonResponse({'message': 'Service updated successfully', 'service_id': service.id}, status=201)
            except Service.DoesNotExist:
                # If no matching service is found, proceed to create a new one
                pass

        # Create a new Service entry
        new_service = Service.objects.create(
            coach_profile=coach_profile,
            type=data['type'],
            title=data['title'],
            description=data['description'],
            duration=data['duration'],
            frequency=data.get('frequency', ''),
            target_audience=data.get('targetAudience', ''),
            location=data.get('location', ''),
            deliverable=data.get('deliverable', ''), 
            session_length = data.get('sessionLength', ''),
            price=data['price']
        )

        # Add the service to the CoachProfile's services
        coach_profile.services.add(new_service)
        coach.save()
        new_service.save()

        # Return success response with new service data
        return JsonResponse({'message': 'Service created successfully', 'service_id': new_service.id}, status=201)

    except Exception as e:
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)

@require_POST
@login_required
def delete_coach_service(request):
    try:
        # Extract the email from the cookie
        email = request.COOKIES.get('user_email')
        if not email:
            return JsonResponse({'error': 'Email not found in cookies'}, status=400)

        try:
            # Retrieve the user using the email from the cookie
            coach = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found with the provided email'}, status=404)

        # Retrieve the CoachProfile for this user
        coach_profile = coach.coach_profile

        # Parse incoming JSON data
        data = json.loads(request.body)

        # Check if the service ID is provided
        service_id = data.get('id')
        if not service_id:
            return JsonResponse({'error': 'Service ID is required'}, status=400)

        try:
            # Attempt to retrieve the service for deletion
            service = Service.objects.get(id=service_id, coach_profile=coach_profile)
            service.delete()
            return JsonResponse({'message': 'Service deleted successfully'}, status=200)
        except Service.DoesNotExist:
            return JsonResponse({'error': 'Service not found or does not belong to this coach'}, status=404)

    except Exception as e:
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)


# Search methods ------------------------------------------------
@require_GET
def search(request): 
    try:
        # Set page results to a maximum of 6 profiles
        results_per_page = 6
        # Get query parameters or set default values
        sport = request.GET.get('sport', 'tennis') 
        location = request.GET.get('location', 'toronto')
        # Default to '$60'
        original_price = int(request.GET.get('priceValue', 60))
        # Default to 0%
        min_deviation = int(request.GET.get('priceMin', 0))
        # Default to 50%
        max_deviation = int(request.GET.get('priceMax', 50))
        # Default to 10km
        proximity = int(request.GET.get('proximity', 10))
        # Default to 1 if no page exists (first query from current user session)
        page = int(request.GET.get('page', 1))
        # Convert to integers, handling empty strings
        original_price = int(original_price) if original_price else 60
        min_deviation = int(min_deviation) if min_deviation else 0
        max_deviation = int(max_deviation) if max_deviation else 50


        # Extract city, province
        try:
            city, province_code = map(str.strip, location.split(','))
        except ValueError:
            return JsonResponse({'error': 'Invalid location format. Use "City, ProvinceCode".'}, status=400)

        # Validate city-province combination
        location_obj = Location.objects.filter(city__iexact=city, province_code__iexact=province_code).first()
        if not location_obj:
            return JsonResponse({'error': 'Invalid city or province code'}, status=400)

        latitude, longitude = location_obj.latitude, location_obj.longitude

        # Calculate price bounds
        price_min, price_max = calculate_price_deviance(original_price, min_deviation, max_deviation)

        
        # Fetch active coaches that match the sport and price range
        coaches = User.objects.filter(
            iscoach=True,
            is_active=True,
            coach_preferences__specialization__icontains=sport,
            coach_profile__services__price__gte=price_min,
            coach_profile__services__price__lte=price_max
        ).select_related('coach_profile').values(
            'id',
            'fullname',  
            'coach_profile__location', 
            'coach_preferences__specialization',
            'coach_preferences__experience_level',
            'coach_profile__biography'
        ).distinct()

        formatted_results = []
        for coach in coaches:
            try:
                coach_city, coach_province_code = map(str.strip, coach['coach_profile__location'].split(','))
                coach_location = Location.objects.filter(city__iexact=coach_city, province_code__iexact=coach_province_code).first()

                if coach_location:
                    coach_lat, coach_lon = coach_location.latitude, coach_location.longitude
                    distance = calculate_distance(latitude, longitude, coach_lat, coach_lon)
                    # Include coaches that fall within proximity range in results
                    if distance <= proximity:
                        formatted_results.append({
                            'id': coach['id'],
                            'fullname': coach['fullname'],
                            'location': coach['coach_profile__location'],
                            'specialization': coach['coach_preferences__specialization'],
                            'experience': coach['coach_preferences__experience_level'],
                            'biography': coach['coach_profile__biography'],
                            'cost': calculate_coach_cost(coach['id']) or 1,
                            'rating': calculate_coach_review(coach['id']) or 0
                        })
            # Skip invalid location formats
            except ValueError:
                continue  

        # Apply pagination after filtering by proximity
        paginator = Paginator(formatted_results, results_per_page)

        try:
            current_page = paginator.page(page)
        except EmptyPage:
            return JsonResponse({"error": "Invalid/Empty page number"}, status=400)

        return JsonResponse({
            "results": list(current_page.object_list),
            "totalResults": paginator.count,
            "totalPages": paginator.num_pages,
            "currentPage": current_page.number,
        })

    except ValueError as e:
        return JsonResponse({'error': 'Invalid input: {}'.format(str(e))}, status=400)
    except DatabaseError as e:
        return JsonResponse({'error': 'Database error: {}'.format(str(e))}, status=500)
    except Exception as e:
        return JsonResponse({'error': 'An unexpected error occurred: {}'.format(str(e))}, status=500)

@require_GET
def search_location(request):
    try:
        location = request.GET.get('search')
        if not location:
            return JsonResponse({'error': 'search parameter not provided in query url'}, status=400)
        
        # limit to four results
        results = Location.objects.filter(city__icontains=location)[:4]

        formatted_results = [
            {'name': f'{result.city}, {result.province_code}'}
            for result in results
        ]

        return JsonResponse({"locations": formatted_results}, status=200)
    except Exception as e:
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)
    
@require_GET
def random_profiles(request):
    try:
        if request.method == 'GET':
            search_terms = request.GET.get('q', '')
            # Assumes search_terms is a comma-separated string
            search_terms_list = [term.strip() for term in search_terms.split(',') if term.strip()]
            # Default to page 1 and 6 items per page if not provided
            page_number = int(request.GET.get('page', 1))
            page_size = int(request.GET.get('size', 6))

            # Calculate start and end indices for slicing
            start = (page_number - 1) * page_size
            end = start + page_size

            results = User.objects.filter(
                iscoach=True,
                coach_preferences__specialization__in=search_terms_list
            ).select_related('coach_profile').values(
                # Direct field from User model
                'fullname', 
                # Direct field from User model
                'email', 
                # Field from related CoachProfile model 
                'coach_profile__location', 
                # Field from related CoachPreferences model
                'coach_preferences__specialization' 
            )[start:end]

            # Rename fields for cleaner JSON output
            formatted_results = [
                {
                    'fullname': result['fullname'],
                    'email': result['email'],
                    'location': result['coach_profile__location'],
                    'specialization': result['coach_preferences__specialization']
                }
                for result in results
            ]

            data = {
                'results': formatted_results
            }
            return JsonResponse(data)
    except Exception as e:
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)


# Chat methods --------------------------------------------------
@require_GET
@login_required
def get_message_previews(request):
    try:
        user = request.user

        if not user:
            return JsonResponse({"error:" "User not found"}, status=404)
        
        # Filter chats where the user is either user1 or user2
        chats = Chat.objects.filter(Q(user1=user) | Q(user2=user)).prefetch_related('message')

        if not chats.exists():
            return JsonResponse({"messagePreviews": []}, status=204)

        # Format message previews
        message_previews = []
        for chat in chats:
            # Determine the other participant
            other_user = chat.user1 if chat.user2 == user else chat.user2
            
            # Retrieve the latest message from the current chat
            latest_message = chat.message.order_by('-sent_at').first()
            if latest_message:
                message_previews.append({
                    'chatId': chat.id,
                    'userId': user.id,
                    'senderId': other_user.id,
                    'sender': other_user.fullname,
                    'opened': latest_message.read if latest_message.sender == other_user else True,
                    'messagePreview': latest_message.content,
                    'sentAt': latest_message.sent_at,
                })

        return JsonResponse({"messagePreviews": message_previews}, status=200)

    except Exception as e:
        return JsonResponse({"error": "An unexpected error occurred", "details": str(e)}, status=500)

@require_GET
@login_required
def get_chat(request):
    try:
        user = request.user

        if not user:
            return JsonResponse({"error:" "User not found"}, status=404)
        
        # Get chat ID from request
        chat_id = request.GET.get('chat_id')
        if not chat_id:
            return JsonResponse({"error": "Chat ID is required"}, status=400)

        # Fetch the chat
        try:
            chat = Chat.objects.get(id=chat_id)
        except Chat.DoesNotExist:
            return JsonResponse({"error": "Chat not found"}, status=404)

        # Check if the user is part of the chat
        if user != chat.user1 and user != chat.user2:
            return JsonResponse({"error": "You are not a participant in this chat"}, status=403)

        # Fetch messages for the chat
        messages = Message.objects.filter(chat=chat).order_by('sent_at')

        # Determine the other participant
        other_user = chat.user1 if chat.user2 == user else chat.user2

        # Format the chat info and messages
        chat_info = {
            'chatId': chat.id,
            'userId': user.id,
            'senderId': other_user.id,
            'sender': other_user.fullname,
            'messages': [
                {
                    'messageId': message.id,
                    'content': message.content,
                    'senderId': message.sender.id,
                    'sentAt': message.sent_at,
                    'read': message.read,
                }
                for message in messages
            ]
        }

        return JsonResponse({"chat": chat_info}, status=200)

    except Chat.DoesNotExist:
        return JsonResponse({"error": "Chat not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": "An unexpected error occurred", "details": str(e)}, status=500)

@require_POST
@login_required
def update_message_read_status(request):
    try:
        user = request.user

        # Parse incoming JSON data
        data = json.loads(request.body)

        # Get chat ID from request body
        chat_id = data.get('chat_id')
        if not chat_id:
            return JsonResponse({"error": "Chat ID is required"}, status=400)

        # Fetch the chat
        try:
            chat = Chat.objects.get(id=chat_id)
        except Chat.DoesNotExist:
            return JsonResponse({"error": "Chat not found"}, status=404)

        # Check if the user is part of the chat
        if user != chat.user1 and user != chat.user2:
            return JsonResponse({"error": "You are not a participant in this chat"}, status=403)

        # Determine the other participant
        other_user = chat.user1 if chat.user2 == user else chat.user2

        # Update read status for messages from the other participant
        updated_count = Message.objects.filter(chat=chat, sender=other_user, read=False).update(read=True)

        return JsonResponse({"success": True}, status=200)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)
    except Exception as e:
        return JsonResponse({"error": "An unexpected error occurred", "details": str(e)}, status=500)

@require_POST
@login_required
def contact_coach(request):
    try:
        data = json.loads(request.body)
        user = request.user
        coach_id = data.get('coach_id')

        # Check if the coach exists
        try:
            coach = User.objects.get(id=coach_id)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid coach id"}, status=400)

        if user == coach:
            return JsonResponse({"error": "Cannot send message to yourself"}, status=400)

        # Check if a chat already exists between user and coach
        if Chat.objects.filter(Q(user1=user, user2=coach) | Q(user1=coach, user2=user)).exists():
            return JsonResponse({"error": "Chat already exists between user and coach"}, status=400)

        # Create a new chat
        new_chat = Chat.objects.create(user1=user, user2=coach)

        # Set default message if not provided
        message_content = data.get('message', 'Hi, I am interested in your profile')

        # Create a new message in the chat
        Message.objects.create(chat=new_chat, sender=user, content=message_content)

        return JsonResponse({"success": True, "message": "Chat and message created successfully"}, status=201)

    except Exception as e:
        return JsonResponse({"error": "An unexpected error occurred", "details": str(e)}, status=500)

@require_POST
@login_required
def send_chat_message(request):
    try:
        sender = request.user
        data = json.loads(request.body)

        # Validate request payload
        chat_id = data.get('chat_id')
        message = data.get('message')

        if not chat_id:
            return JsonResponse({"error": "chatId parameter is missing"}, status=400)
        if not message:
            return JsonResponse({"error": "message parameter is missing"}, status=400)

        # Verify the chat exists and the sender is a participant
        try:
            chat = Chat.objects.get(id=chat_id)
        except Chat.DoesNotExist:
            return JsonResponse({"error": "Chat does not exist"}, status=404)

        if sender != chat.user1 and sender != chat.user2:
            return JsonResponse({"error": "You are not authorized to send messages in this chat"}, status=403)

        # Create the new message
        new_message = Message.objects.create(
            chat=chat,
            sender=sender,
            content=message
        )

        return JsonResponse({
            "success": "Message sent!",
            "message": {
                "messageId": new_message.id,
                "senderId": sender.id,
                "content": new_message.content,
                "sentAt": new_message.sent_at,
                "read": new_message.read,
            }
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON in request body"}, status=400)

    except Exception as e:
        return JsonResponse({"error": "An unexpected error occurred", "details": str(e)}, status=500)
   
@require_POST
@login_required
def create_transaction_notification(request):
    try:
        sender = request.user
        data = json.loads(request.body)
        service_id = data.get('serviceId')
        date_time = data.get('dateTime')
        session_id = data.get('sessionId')

        if not service_id:
            return JsonResponse({"error": "serviceId parameter was not passed"}, status=400)
        if not session_id:
            return JsonResponse({"error": "sessionId parameter was not passed"}, status=400)

        try:
            service = Service.objects.get(id=service_id)
        except Service.DoesNotExist:
            return JsonResponse({"error": "Service not found"}, status=404)

        coach_profile = service.coach_profile
        try:
            coach = User.objects.get(id=coach_profile.user.id)
        except User.DoesNotExist:
            return JsonResponse({"error": "Coach not found"}, status=404)

        # Get or create chat between athlete and coach
        chat = Chat.objects.filter(
            Q(user1=sender, user2=coach) | Q(user1=coach, user2=sender)
        ).first()

        if not chat:
            chat = Chat.objects.create(user1=sender, user2=coach)
            created = True
        else:
            created = False

        Message.objects.create(
            chat=chat,
            sender=sender,
            content="\n".join([
                f"\n Alert!",
                f"\n Transaction ID: {session_id}",
                f"\n Details: {sender.fullname} has purchased the {service.title} service.",
                f"\n Deliverable: {service.deliverable if service.deliverable else 'N/A'}",
                f"\n Coach {coach.fullname} will provide further details about your purchase."
            ]),
        )

        # Schedule event if date_time provided
        if date_time:
            try:
                # Parse the date_time in 'yyyy-mm-dd-hh-mm' format
                parsed_date_time = datetime.strptime(date_time, "%Y-%m-%d-%H-%M")

                # Check for existing event
                existing_event = Event.objects.filter(
                    participants__in=[sender, coach],
                    date__gte=parsed_date_time,
                    date__lt=parsed_date_time + timedelta(minutes=1)
                ).first()

                if existing_event:
                    return JsonResponse({"error": "An event already exists at this time for the same participants."}, status=400)

                new_event = Event.objects.create(
                    date=parsed_date_time,
                    title=f"{service.title} between Coach: {coach.fullname} & Athlete: {sender.fullname}",
                    description=service.description,
                    location=service.location,
                    session_length=int(service.session_length)
                )
                # Add participants
                new_event.participants.add(coach, sender)
            except ValueError:
                return JsonResponse({"error": "Invalid dateTime format. Use 'yyyy-mm-dd-hh-mm'."}, status=400)

        return JsonResponse({"success": "Message sent!"}, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON in request body"}, status=400)

    except Exception as e:
        return JsonResponse({"error": "An unexpected error occurred", "details": str(e)}, status=500)


# Calendar methods ----------------------------------------------
@require_POST
@login_required
def create_calendar_event(request):
    try:
        user = request.user
        data = json.loads(request.body)

        # Extracting required fields from the request
        event_date = data.get('date')
        event_title = data.get('title')
        # Optional
        event_description = data.get('description', None)
        # Optional
        event_location = data.get('location', None)
         # List of user IDs
        event_participants = data.get('participants')

        # Validate required fields
        if not event_date or not event_title or not event_participants:
            return JsonResponse({"error": "Missing required parameters."}, status=400)

        # Convert date to datetime object
        try:
            naive_date = datetime.strptime(event_date, '%Y-%m-%d-%H-%M')
            user_timezone = timezone(user.timezone)
                # Transform date_time to conform with user's local timezone
            aware_date = make_aware(naive_date, user_timezone) 
        except ValueError:
            return JsonResponse({"error": "Invalid date format. Use YYYY-MM-DD-HH-MM."}, status=400)

        # Validate participants
        participant_users = User.objects.filter(id__in=event_participants)
        if not participant_users.exists():
            return JsonResponse({"error": "No valid participants found."}, status=400)

        # Ensure the user has a calendar, creating one if it doesn't exist
        user_calendar, _ = Calendar.objects.get_or_create(user=user)

        # Ensure each participant has a calendar
        for participant in participant_users:
            Calendar.objects.get_or_create(user=participant)

        # Create the event
        new_event = Event.objects.create(
            date=aware_date,
            title=event_title,
            location=event_location,
            description=event_description
        )

        # Add the creator and participants to the event
        new_event.participants.add(user, *participant_users)

        return JsonResponse({
            "success": "New event created!",
            "event": {
                "id": new_event.id,
                "title": new_event.title,
                "date": new_event.date.isoformat(),
                "location": new_event.location,
                "description": new_event.description,
                "participants": list(new_event.participants.values('id', 'username'))
            }
        }, status=201)

    except KeyError as e:
        return JsonResponse({"error": f"Missing key: {str(e)}"}, status=400)
    except Exception as e:
        return JsonResponse({"error": "An unexpected error occurred.", "details": str(e)}, status=500)

@require_GET
@login_required
def get_calendar_event(request):
    try:
        user = request.user
        event_date = request.GET.get('day')

        if not event_date:
            return JsonResponse({"error": "The 'day' query parameter is required."}, status=400)

        # Parse the date string into a proper date object
        event_date_parsed = parse_date(event_date)
        if not event_date_parsed:
            return JsonResponse({"error": "Invalid date format. Use 'YYYY-MM-DD'."}, status=400)

        # Filter events by comparing only the date part of the DateTimeField
        events = Event.objects.filter(
            participants=user,
            date__year=event_date_parsed.year,
            date__month=event_date_parsed.month,
            date__day=event_date_parsed.day
        )

        # Serialize the events into a list of dictionaries
        events_data = [
            {
                "id": event.id,
                "title": event.title,
                "description": event.description,
                "location": event.location,
                "date": event.date.strftime('%Y-%m-%d %H:%M:%S'),
            }
            for event in events
        ]

        return JsonResponse({"events": events_data}, status=200)

    except Exception as e:
        return JsonResponse({"error": "An unexpected error occurred.", "details": str(e)}, status=500)

@require_GET
@login_required
def get_coach_availability(request):
    try:
        coach_id = request.GET.get('coachId') or getattr(request.user, 'id', None)
        coach = User.objects.get(id=coach_id)

        if not coach_id:
            return JsonResponse({"error": "Coach Id was not provided or user account is invalid."}, status=400)

        coach_availability = CoachAvailability.objects.prefetch_related(
            "month_schedules__weekly_schedules",
            "month_schedules__blocked_days"
        ).filter(coach_id=coach_id).first()

        if not coach_availability:
            return JsonResponse({"error": "Coach availability not found"}, status=204)
        

        # Get saved Calendar Events to prevent a Coach from being double booked --------------

        # Filter booked events to only include those occurring within the next two months
        start_date = now()
        end_date = start_date + timedelta(days=62)
        booked_events = Event.objects.filter(
            participants=coach,
            date__range=(start_date, end_date)
        )
        # Format book events to include date, start and end times
        formatted_booked_events = [
            {
                "date": event.date.strftime("%Y-%m-%d"),
                "startTime": event.date.strftime("%H:%M"), 
                "endTime": (event.date + timedelta(minutes=event.session_length)).strftime("%H:%M")
                if event.session_length else event.date.strftime("%H:%M")
            }
            for event in booked_events
        ]


        # Serialize and format Coach's availability --------------

        # Get the user's and coach's timezone
        user_timezone = pytz.timezone(request.user.timezone)
        coach_timezone = pytz.timezone(coach.timezone) 

        # Helper function to convert times to user's local timezone if needed
        def convert_to_user_timezone(dt):
            if dt:
                # Convert only if user's and Coach's timezones differ indicating they are in different geographical/timezone areas
                if user_timezone != coach_timezone:
                    # Localize to coach's timezone first, then convert to UTC and then user's timezone
                    coach_dt = coach_timezone.localize(dt) 
                    utc_dt = coach_dt.astimezone(pytz.utc) 
                    user_dt = utc_dt.astimezone(user_timezone)  
                    return user_dt
                else:
                    return dt
            return None
        
        def serialize_month_schedule(month_schedule):
            return {
                "weekly": [
                    {
                        "dayOfWeek": ws.day_of_week,
                        "startTime": str(convert_to_user_timezone(ws.start_time)),
                        "endTime": str(convert_to_user_timezone(ws.end_time)),
                    }
                    for ws in month_schedule.weekly_schedules.all()
                ],
                "blockedDays": [str(bd.date) for bd in month_schedule.blocked_days.all()],
            }

        data = {
            "currentMonth": serialize_month_schedule(
                coach_availability.month_schedules.filter(is_current_month=True).first()
            ),
            "nextMonth": serialize_month_schedule(
                coach_availability.month_schedules.filter(is_current_month=False).first()
            ),
        }

        return JsonResponse({"availability": data, "bookedEvents": formatted_booked_events})

    except Exception as e:
        return JsonResponse({"error": "An unexpected error occurred", "details": str(e)}, status=500)

@require_POST
@login_required
def create_coach_availability(request):
    try:
        # Parse the request data
        data = json.loads(request.body)
        coach = request.user

        current_month_data = data.get("currentMonth")
        next_month_data = data.get("nextMonth")

        if not current_month_data or not next_month_data:
            return JsonResponse({"error": "Missing data for current or next month"}, status=400)

        # Helper function to handle MonthSchedule updates
        def update_month_schedule(month_data, is_current_month):
            today = date.today()
            if is_current_month:
                year, month = today.year, today.month
            else:
                if today.month == 12:
                    year, month = today.year + 1, 1
                else:
                    year, month = today.year, today.month + 1

            formatted_month = f"{year}-{month:02d}"  # Format as 'yyyy-mm'

            # Get or create the corresponding MonthSchedule
            coach_availability, _ = CoachAvailability.objects.get_or_create(coach=coach)
            month_schedule, created = MonthSchedule.objects.update_or_create(
                coach_availability=coach_availability,
                is_current_month=is_current_month,
                defaults={"month": formatted_month},
            )

            # Clear existing schedules and blocked days
            month_schedule.weekly_schedules.all().delete()
            month_schedule.blocked_days.all().delete()

            # Create weekly schedules
            weekly_schedules = [
                WeeklySchedule(
                    day_of_week=ws["dayOfWeek"],
                    start_time=ws["startTime"],
                    end_time=ws["endTime"],
                    month_schedule=month_schedule,
                )
                for ws in month_data.get("weekly", [])
            ]
            WeeklySchedule.objects.bulk_create(weekly_schedules)
            # Create blocked days
            blocked_days = [
                BlockedDay(
                    date=bd, 
                    month_schedule=month_schedule,
                )
                for bd in month_data.get("blockedDays", [])
            ]
            BlockedDay.objects.bulk_create(blocked_days)

            return month_schedule

        # Wrap updates in a transaction for consistency
        with transaction.atomic():
            update_month_schedule(current_month_data, is_current_month=True)
            update_month_schedule(next_month_data, is_current_month=False)

        return JsonResponse({"message": "Coach availability successfully updated."})

    except ValueError as ve:
        return JsonResponse({"error": f"Invalid input: {str(ve)}"}, status=400)
    except KeyError as ke:
        return JsonResponse({"error": f"Missing required data: {str(ke)}"}, status=400)
    except Exception as e:
        return JsonResponse({"error": "An unexpected error occurred", "details": str(e)}, status=500)


# Stripe methods ------------------------------------------------
@require_GET
@login_required
def stripe_config(request):
    stripe_config = {'publicKey': os.getenv('STRIPE_PUBLIC_KEY')}
    return JsonResponse(stripe_config, safe=False)

@require_GET
@login_required
def get_order_details(request):
    try:
        # Extract the session ID from the request
        session_id = request.GET.get('session_id')

        if not session_id:
            return JsonResponse({'error': 'session_id is required'}, status=400)

        # Retrieve the session details using the session ID
        session = stripe.checkout.Session.retrieve(session_id)

        # Extract order details from the session
        order_details = {
            'session_id': session.id,
            'customer_email': session.customer_email,
            'payment_status': session.payment_status,
            'amount_total': session.amount_total,
            'line_items': session.line_items.data,  # List of items purchased
        }
        return JsonResponse(order_details)

    except stripe.error.StripeError as e:
        return JsonResponse({'error': str(e)}, status=500)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@require_POST
@login_required
def create_stripe_checkout(request):
        try: 
            stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

            # Parse JSON body
            body = json.loads(request.body)
            service_id = body.get('serviceId')
            coach_id = body.get('coachId')
            # Retrieve desired service date and time if passed. Only passed from 'individual-session' services
            date_time = body.get('dateTime', None)

            # Validate the input
            if not service_id:
                return JsonResponse({'error': 'id for this service is required'}, status=400)

            # Validate the coach and service
            coach = User.objects.get(id=coach_id, iscoach=True)
            coach_profile = CoachProfile.objects.get(user=coach)
            if not coach_profile:
                return JsonResponse({'error': 'Coach profile not found'}, status=404)
            
            service = coach_profile.services.get(id=service_id)
            if not service:
                return JsonResponse({'error': 'Service not found for this coach'}, status=404)
            
            # set url parameters for success url if user successfully checkouts
            url_parameter = f'&coach_id={coach_id}&service_id={service_id}'
            if date_time:
                url_parameter = f'&coach_id={coach_id}&service_id={service_id}&date_time={date_time}'

            # Fee in cents ($3.99)
            service_fee = 399

            checkout_session = stripe.checkout.Session.create(
                success_url='http://localhost:3000/order-success?session_id=${CHECKOUT_SESSION_ID}' + url_parameter,
                cancel_url='https://www.skillja.ca/order-cancelled'+f'&coach_id={coach_id}',
                payment_method_types=['card'],
                mode='payment',
                line_items=[{
                    'price_data': {
                        'currency': 'cad',
                        'unit_amount': int(service.price * 100),
                        'product_data': {
                            'name': service.title,
                            'description': service.description,
                        },
                    },
                    'quantity': 1
                },
                {
                    'price_data': {
                        'currency': 'cad',
                        'product_data': {
                            'name': 'SkillJa Service Fee',
                        },
                        'unit_amount': service_fee,
                    },
                    'quantity': 1,
                },
                ]
            )
            return JsonResponse({'checkout_url': checkout_session.url, 'checkout_session_id': checkout_session.id}, status=200)
        
        except User.DoesNotExist:
            return JsonResponse({'error': 'Coach not found'}, status=404)
        except Service.DoesNotExist:
            return JsonResponse({'error': 'Service not found for this coach'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@login_required
def stripe_webhook(request):
    stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
    endpoint_key = os.getenv('STRIPE_ENDPOINT_KEY')
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_key
        )
    except ValueError as e:
        # Invalid payload
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return HttpResponse(status=400)

    # Handle the checkout.session.completed event
    if event['type'] == 'checkout.session.completed':
        # trigger event e.g send user what they purchased etc
        return HttpResponse(status=200)


# Email and Mailgun methods -------------------------------------
@require_POST
def new_user_confirmation_email(request):
    try:
        # Parse JSON body
        body = json.loads(request.body)
        recipient = body.get('recipient', 'recipient@email.com')
        try:
            user = User.objects.get(email=recipient)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found!"}, status=400)

        # Prepare the JWT token
        token_payload = {
            "user_id": user.id,
            "exp": (now() + timedelta(days=2)).timestamp() 
        }
        token = jwt.encode(token_payload, os.getenv('EMAIL_CONFIRMATION_KEY'), algorithm="HS256")
        confirmation_link = f"https://www.skillja.ca/confirm-account?token={token}"
        
        # Render the HTML email template
        html_content = render_to_string("email/confirm_email.html", {"confirmation_link": confirmation_link})

        # Mailgun API credentials
        api_key = os.getenv("MAILGUN_API_KEY")
        domain = os.getenv("MAILGUN_DOMAIN")

        # Mailgun API request
        response = requests.post(
            f"https://api.mailgun.net/v3/{domain}/messages",
            auth=("api", api_key),
            data={
                "from": f"SkillJa <noreply@{domain}>",
                "to": recipient,
                "subject": "Confirm Your Email Address - SkillJa",
                "html": html_content, 
            },
        )
        if response.status_code == 200:
            return JsonResponse({"message": "Email sent successfully!"}, status=200)
        else:
            return JsonResponse({"error": "Failed to send email", "details": response.text}, status=500)

    except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@require_POST
def confirm_email(request):
    token = request.data.get("token")
    try:
        payload = jwt.decode(token, os.getenv('EMAIL_CONFIRMATION_KEY'), algorithms=["HS256"])
        user_id = payload["id"]
        user = User.objects.get(id=user_id)
        # Activate the user's account
        user.is_active = True  
        user.save()
        return Response({"message": "Email confirmed successfully!"})
    except jwt.ExpiredSignatureError:
        return Response({"error": "Token expired!"}, status=400)
    except jwt.InvalidTokenError:
        return Response({"error": "Invalid token!"}, status=400)
    except User.DoesNotExist:
        return Response({"error": "User not found!"}, status=400)

@require_POST
def contact_us_email(request):
    try:
        # Parse incoming JSON data
        data = json.loads(request.body)
        firstname = data['firstname']
        lastname = data['lastname']
        email = data['email']
        reason = data['reason']
        message = data['message']

        # Construct the email content
        body = (
            f"Name: {firstname} {lastname}\n"
            f"Email: {email}\n"
            f"Reason: {reason}\n\n"
            f"Message:\n{message}"
        )
        recipient = os.getenv('DEFAULT_CONTACT_EMAIL') 

        # Mailgun API credentials
        api_key = os.getenv("MAILGUN_API_KEY")
        domain = os.getenv("MAILGUN_DOMAIN")

        # Mailgun API request
        response = requests.post(
            f"https://api.mailgun.net/v3/{domain}/messages",
            auth=("api", api_key),
            data={
                "from": f"SkillJa <noreply@{domain}>",
                "to": recipient,
                "subject": f"Inquiry - Contact Us Message From {firstname} {lastname}",
                "text": body, 
            },
        )
        if response.status_code == 200:
            return JsonResponse({"message": "Email sent successfully!"}, status=200)
        else:
            return JsonResponse({"error": "Failed to send email", "details": response.text}, status=500)

    except Exception as e:
        return JsonResponse({"Error": "An unexpected error occurred."}, status=500)

@require_POST
@login_required
def order_confirmation_email(request):
    try:
        stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
        data = json.loads(request.body)
        recipient = request.user.email
        coach_id = data.get('coachId')
        service_id = data.get('serviceId')
        stripe_session_id = data.get('sessionId')
        date_time = data.get('dateTime','N/A')

        if not recipient:
            return JsonResponse({"error":"No email found for user"},status=400)

        # Get coach full name and service details for email template
        coach = User.objects.get(id=coach_id)
        if not coach:
            return JsonResponse({"error":"No user found with related coachId"},status=400)
        
        service = Service.objects.get(id=service_id)
        if not service:
            return JsonResponse({"error":"No service found with related serviceId"},status=400)
        
        # Verify Stripe session
        if not stripe_session_id:
            return JsonResponse({"error": "Stripe session ID is missing"}, status=400)
        
        # Retrieve the session from Stripe API
        try: 
            # Remove unwanted characters if present
            stripe_session_id = stripe_session_id.lstrip("$")
            session = stripe.checkout.Session.retrieve(stripe_session_id)
        except stripe.error.StripeError as e:
            return JsonResponse({"error": f"Stripe verification failed: {str(e)}"}, status=400)
        
        current_date = datetime.now()

        # Handle "N/A" case for date_time
        if date_time is None or str(date_time).strip().lower() in ["", "n/a"]:
            formatted_date_time = "N/A"
        else:
            try:
                # Parse the input string into a datetime object
                parsed_datetime = datetime.strptime(date_time, "%Y-%m-%d-%H-%M")
                formatted_date_time = parsed_datetime.strftime("%Y-%m-%d (%I:%M %p)")
            except ValueError:
                return JsonResponse({"error": "Invalid dateTime format. Expected 'yyyy-mm-dd-hh-mm'."}, status=400)
            
        # Render the HTML email template
        html_content = render_to_string("email/order_confirmation_email.html", 
            {"coach": coach, 
            "service":service,  
            "dateTime": formatted_date_time,
            "current_date":f'{current_date.year}-{current_date.month}-{current_date.day}'}
        )

        # Mailgun API credentials
        api_key = os.getenv("MAILGUN_API_KEY")
        domain = os.getenv("MAILGUN_DOMAIN")

        # Mailgun API request
        response = requests.post(
            f"https://api.mailgun.net/v3/{domain}/messages",
            auth=("api", api_key),
            data={
                "from": f"SkillJa <noreply@{domain}>",
                "to": recipient,
                "subject": "Order Confirmation - SkillJa",
                "html": html_content, 
            },
        )
        if response.status_code == 200:
            return JsonResponse({"message": "Email sent successfully!"}, status=200)
        else:
            return JsonResponse({"error": "Failed to send email", "details": response}, status=500)

    except Exception as e:
        return JsonResponse({"Error": "An unexpected error occurred.","details": str(e)}, status=500)

@require_POST
@login_required
def order_review_email(request):
    try:
        # Parse request data
        data = json.loads(request.body)
        coach_id = data.get('coachId')

        if not coach_id:
            return JsonResponse({"error": "Coach Id parameter not found!"}, status=400)
        
        user = User.objects.get(email=request.user.email)
        coach = User.objects.get(id=coach_id)

        if not coach:
            return JsonResponse({"error": "Coach not found!"}, status=400)
        if not request.user.email:
            return JsonResponse({"error": "User not found!"}, status=400)
        

        # Prepare the JWT token
        token_payload = {
            "user_id": user.id,
            "coach_id": coach.id,
            "exp": (now() + timedelta(days=14)).timestamp() 
        }
        token = jwt.encode(token_payload, os.getenv('EMAIL_CONFIRMATION_KEY'), algorithm="HS256")
        review_link = f"https://www.skillja.ca/order-review?token={token}&coach_id={coach_id}&coach_name={coach.fullname}"
        
        # Render the HTML email template
        html_content = render_to_string("email/order_review_email.html", {"review_link": review_link, "coach_name": coach.fullname})

        # Mailgun API credentials
        api_key = os.getenv("MAILGUN_API_KEY")
        domain = os.getenv("MAILGUN_DOMAIN")

        if not api_key or not domain:
            return JsonResponse({"error": "Mailgun configuration missing!"}, status=500)

        # Mailgun API request
        response = requests.post(
            f"https://api.mailgun.net/v3/{domain}/messages",
            auth=("api", api_key),
            data={
                "from": f"SkillJa <noreply@{domain}>",
                "to": user.email,
                "subject": "Review Your Recent Purchase - SkillJa",
                "html": html_content, 
            },
        )
        if response.status_code == 200:
            return JsonResponse({"message": "Email sent successfully!"}, status=200)
        else:
            return JsonResponse({"error": "Failed to send email", "details": response.text}, status=500)

    except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    

# Image and Cloudinary methods ----------------------------------
@require_GET
def get_image(request):
    try:
        # Extract parameters
        user_id = request.GET.get("id")
        image_name = request.GET.get("image_name", "default-avatar")
        cache = request.GET.get("cache", "False").lower() == "true"

        if user_id:
            # Fetch the user and derive image_name from the email
            try:
                user = User.objects.get(id=user_id)
                image_name = user.id
            except User.DoesNotExist:
                return JsonResponse({"error": "User not found."}, status=404)

        # Possible image formats
        formats = ["jpg", "png", "jpeg"]
        # Generate a signed URL with an expiration time of 2.5 hours
        expiration_time = int(time.time()) + 9000

        # Iterate over formats and validate the URL
        for fmt in formats:
            try:
                # Generate the signed URL
                url = cloudinary.utils.private_download_url(
                    public_id=image_name,
                    format=fmt,
                    resource_type="image",
                    type="private",
                    expires_at=expiration_time,
                    attachment=False
                )
                # Check if the URL is valid by sending a HEAD request
                response = requests.head(url)
 
                if response.status_code == 200:
                    response = JsonResponse({"signed_url": url})
                    # cache url as a cookie to eliminate redundant Cloudinary API calls
                    if cache == True:
                        response.set_cookie ('profile_image_url', url, max_age=9000, httponly=True, secure=True, samesite='Lax')
                    return response
            except Exception as e:
                # Log the failure but don't stop the loop
                print(f"Failed to generate or validate URL for format {fmt}: {str(e)}")

        # If no valid URL is found after checking all formats
        return JsonResponse({"error": "Image not found in any format."}, status=404)

    except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@require_POST
@login_required
def upload_image(request):
    try:
        # Allowed file types
        ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"]

        # Ensure the file is in the request
        uploaded_file = request.FILES.get("filepath")
        if not uploaded_file:
            return JsonResponse({'error': 'No file uploaded'}, status=400)

        # Validate file type
        if uploaded_file.content_type not in ALLOWED_IMAGE_TYPES:
            return JsonResponse({"error": "Invalid file type. Only JPEG and PNG allowed."}, status=400)

        # Extract the email from the cookie
        email = request.COOKIES.get('user_email')
        if not email:
            return JsonResponse({'error': 'Email not found in cookies'}, status=400)

        # Format file name in Cloudinary to user id
        user = User.objects.get(email=email)
        file_name = user.id

        # Upload the image to Cloudinary
        cloudinary.uploader.upload(
            uploaded_file,
            public_id=file_name,
            type="private"
        )

        # update user picture reference with Cloudinary public_id
        if hasattr(user, 'coach_profile') and user.iscoach:
            user.coach_profile.picture = file_name
            user.coach_profile.save()
        elif hasattr(user, 'athlete_profile') and user.isathlete:
            user.athlete_profile.picture = file_name
            user.athlete_profile.save()
        else:
            return JsonResponse({'error': 'User profile not found!'}, status=404)

        # Return success response with the uploaded image URL
        return JsonResponse({'message': 'Image uploaded successfully'}, status=200)

    except User.DoesNotExist:
        return JsonResponse({'error': f'User with email {email} not found!'}, status=404)

    except cloudinary.exceptions.Error as e:
        # Handle Cloudinary-specific errors
        return JsonResponse({'error': f'Cloudinary error: {str(e)}'}, status=500)
    except Exception as e:
        # Handle general errors
        return JsonResponse({'error': f'Server error: {str(e)}'}, status=500)

@require_GET
@login_required
def get_cached_image(request):
    try:
        profile_image_url = request.COOKIES.get('profile_image_url', None)
        if profile_image_url:
            return JsonResponse({"profile_image_url": profile_image_url}, status=200)
        else:
            return JsonResponse({"error": "No cached image available."}, status=204)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# Review methods ------------------------------------------------
@require_POST
def create_review(request):
    try:
        data = json.loads(request.body)
        rating = data.get('rating')
        token = data.get('token')
        title = data.get('title')
        description = data.get('description')

        if not rating:
            return JsonResponse({"error": "rating parameter not given"}, status=400)
        if not token:
            return JsonResponse({"error": "token parameter not given"}, status=400)
        
        try:
            # convert token from payload to check its validity
            payload = jwt.decode(token, os.getenv('EMAIL_CONFIRMATION_KEY'), algorithms=["HS256"])
            coach_id = payload["coach_id"]
            user_id = payload["user_id"]
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token has expired"}, status=400)
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Invalid token"}, status=400)

        # Validate users
        coach = User.objects.get(id=coach_id)
        user = User.objects.get(id=user_id)

        if not coach or not user:
            return JsonResponse({"error": "Invalid user or coach"}, status=400)

        # Prevent duplicate reviews, users can only review a coach one time regardless of how many services they purchased
        existing_review = Review.objects.filter(user=user, reviewer=coach).first()
        if existing_review:
            return JsonResponse({"error": "You have already reviewed this coach"}, status=400)

        # Create a new review
        Review.objects.create(
            user=coach,
            reviewer=user,
            title=title,
            description=description,
            rating=rating
        )

        return JsonResponse({"message": "Review created successfully"}, status=201)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# Custom HTTP response methods ----------------------------------
def custom_500(request):
    return render(request, '500.html', status=500)


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
            'description': 'Saves onboarding preferences for the logged-in user, either as a coach or athlete.'
        },
        {
            'Endpoint': '/auth_status',
            'method': 'GET',
            'description': 'checks if user has a valid session id and is currently logged in'
        },
        {
            'Endpoint': '/auth/coach/',
            'method': 'GET',
            'description': 'Retrieves the coach profile details based on passed "id" query parameter'
        },
        {
            'Endpoint': '/auth/profile/',
            'method': 'GET',
            'description': 'Retrieves the profile details of the logged-in user (Either athlete or coach).'
        },
        {
            'Endpoint': '/auth/profile/services',
            'method': 'GET',
            'description': 'Retrieves the services offered by a coach'
        },
        {
            'Endpoint': '/update_athlete_profile',
            'method': 'POST',
            'description': 'updates an athletes profile'
        },
        {
            'Endpoint': '/update_coach_profile',
            'method': 'POST',
            'description': 'updates a coaches profile'
        },
        {
            'Endpoint': '/create_coach_service',
            'method': 'POST',
            'description': 'creates a new service for a coach if it does not exist, else updates existing service with passed data'
        },
        {
            'Endpoint': '/delete_coach_service',
            'method': 'POST',
            'description': 'deletes a service related to a coach'
        },
        {
            'Endpoint': '/search',
            'method': 'GET',
            'description': 'Retrieves matching coach profiles based on a given query term'
        },
        {
            'Endpoint': '/random_profiles',
            'method': 'GET',
            'description': 'Retrieves a set amount of random coach profiles based on given query terms'
        },
        {
            "Endpoint": "/stripe/config/",
            "method": "GET",
            "description": "Returns the public Stripe API key from environment variables. Required for initializing Stripe on the frontend."
        },
        {
            "Endpoint": "/stripe/get_order_details/",
            "method": "GET",
            "description": "Retrieves the details of a Stripe checkout session using the session ID. Returns the session's customer email, payment status, total amount, and purchased items."
        },
        {
            "Endpoint": "/stripe/create_stripe_checkout/",
            "method": "GET",
            "description": "Creates a Stripe checkout session for a specific service and coach. Returns the session ID for initiating the checkout process."
        },
        {
            'Endpoint': '/custom_500',
            'method': 'GET',
            'description': 'returns a custom template when error=500 occurs'
        },
        {
            'Endpoint': '/api/routes/',
            'method': 'GET',
            'description': 'Provides a list of API endpoints and their descriptions. Useful for documentation.'
        }
    ]
    return Response(routes)
