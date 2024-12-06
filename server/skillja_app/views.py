from django.forms import model_to_dict
import json, os, stripe
from venv import logger
from django.db import IntegrityError
from django.shortcuts import redirect, get_object_or_404, render
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login as auth_login, authenticate
from django.contrib.auth import logout
from django.http import JsonResponse, HttpResponseRedirect
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import User, CoachPreferences, AthletePreferences, CoachProfile, AthleteProfile, Service, Review, SocialMedia
from django.middleware.csrf import get_token, rotate_token
from django.shortcuts import redirect
from urllib.parse import urlparse, parse_qs
from django.views.decorators.http import require_POST, require_GET
from django.contrib.auth.decorators import login_required
from .utils import calculate_price_deviance, calculate_coach_cost, calculate_coach_review
from django.core.exceptions import ObjectDoesNotExist

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
            'email': request.user.email
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
            'name': user.fullname,
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
                    'picture': athlete_profile.picture.url if athlete_profile.picture else None,
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
                    'picture': coach_profile.picture.url if coach_profile.picture else None,
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
            'fullname': user.fullname,
            'profile': {
                'location': coach_profile.location or '',
                'biography': coach_profile.biography or '',
                'primarySport': coach_profile.primary_sport or '', 
                'picture': coach_profile.picture.url if coach_profile.picture else None,
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
                service.duration = data['duration']
                service.frequency = data.get('frequency', service.frequency)
                service.target_audience = data.get('targetAudience', service.target_audience)
                service.location = data.get('location', service.location)
                service.deliverable = data.get('deliverable', service.deliverable)
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
        if request.method == 'GET':
            # Get query parameters or set default values
            sport = request.GET.get('sport', 'tennis') 
            location = request.GET.get('location', 'toronto')
            # Default to '$60'
            original_price = request.GET.get('priceValue', 60)
            # Default to 0%
            min_deviation = request.GET.get('priceMin', 0)
            # Default to 50%
            max_deviation = request.GET.get('priceMax', 50)

            # Convert to integers, handling empty strings
            original_price = int(original_price) if original_price else 60
            min_deviation = int(min_deviation) if min_deviation else 0
            max_deviation = int(max_deviation) if max_deviation else 50

            # Calculate price bounds
            price_min, price_max = calculate_price_deviance(original_price, min_deviation, max_deviation)
            
            # Perform the search for coaches based on specialization, location, and price range.
            results = User.objects.filter(
                iscoach=True,
                coach_preferences__specialization__icontains=sport,
                coach_profile__location__icontains=location,
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

            # Format results for cleaner JSON output
            formatted_results = []
            for result in results:
                average_cost = calculate_coach_cost(result['id']) or 1
                average_rating = calculate_coach_review(result['id']) or 0

                formatted_results.append({
                    'id': result['id'],
                    'fullname': result['fullname'],
                    'location': result['coach_profile__location'],
                    'specialization': result['coach_preferences__specialization'],
                    'experience': result['coach_preferences__experience_level'],
                    'biography': result['coach_profile__biography'],
                    'cost': average_cost,
                    'rating': average_rating
                })

            data = {
                'results': formatted_results
            }
            return JsonResponse(data)

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


# Stripe methods ------------------------------------------------
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

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
def create_stripe_checkout(request,coach_id):
        try:
            # Parse JSON body
            body = json.loads(request.body)
            service_id = body.get('serviceId')

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

            checkout_session = stripe.checkout.Session.create(
                success_url=f'https://skillja.ca/' + 'order-success?session_id={CHECKOUT_SESSION_ID}&coach_id={coach_id}',
                cancel_url='https://skillja.ca/' + 'order-cancelled',
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
                }
                ]
            )
            return JsonResponse({'sessionId': checkout_session['id']}, status=200)
        
        except User.DoesNotExist:
            return JsonResponse({'error': 'Coach not found'}, status=404)
        except Service.DoesNotExist:
            return JsonResponse({'error': 'Service not found for this coach'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


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