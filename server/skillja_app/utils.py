from .models import User, CoachProfile, Review
from math import radians, cos, sin, sqrt, atan2

# Calculates the lower and upper bounds for a price range based on a given input and percentage deviations.
# This is used in search results to filter coaches within a specified price range.
def calculate_price_deviance(original_input, lower_percentage, upper_percentage):
    # Compute the lower bound by reducing the percentage from the original input
    lower_bound = original_input - (lower_percentage / 100) * original_input
    # Compute the upper bound by adding the percentage to the original input
    upper_bound = original_input + (upper_percentage / 100) * original_input
    return lower_bound, upper_bound

# Calculates the average price for a coach's services and returns a cost ranking.
# Ranking: $ = 1 (0-50), $$ = 2 (51-100), $$$ = 3 (101-150), $$$$ = 4 (>151)
# This is used to rank coaches based on affordability.
def calculate_coach_cost(coach_id):
    try:
        # Fetch the coach user object by ID
        coach = User.objects.get(id=coach_id)

        # Ensure the user is marked as a coach
        if coach.iscoach:
            # Retrieve all services related to the coach
            services = coach.coach_profile.services.all()

            # Extract service prices and ensure they are valid
            prices = [service.price for service in services if service.price]

            if prices:
                # Calculate the average price of services
                average_price = sum(prices) / len(prices)

                # Determine the cost ranking based on the average price
                if average_price <= 50:
                    return 1  # $
                elif average_price <= 100:
                    return 2  # $$
                elif average_price <= 150:
                    return 3  # $$$
                else:
                    return 4  # $$$$
            else:
                # Default to 1 if no valid prices are available
                return 1
        else:
            # Return default if user is not a coach
            return 1
    except User.DoesNotExist:
        # Return default if the coach does not exist
        return 1

# Calculates the average review rating for a coach based on their reviews.
# This is used to rank coaches by their overall review score.
def calculate_coach_review(coach_id):
    try:
        # Fetch the coach user object by ID
        coach = User.objects.get(id=coach_id)

        # Ensure the user is marked as a coach
        if coach.iscoach:
            # Retrieve all reviews associated with the coach
            reviews = Review.objects.filter(user=coach)

            # Extract valid ratings from reviews
            ratings = [review.rating for review in reviews if review.rating]

            if ratings:
                # Calculate the average rating
                average_rating = sum(ratings) / len(ratings)
                return average_rating
            else:
                # Return None if no valid ratings are found
                return None
        else:
            # Return None if user is not a coach
            return None
    except User.DoesNotExist:
        # Handle cases where the coach does not exist
        return None

# Calculates Haversine Formula to determine a circular boundary around a given latitude and longitude coordinate pair
def calculate_distance(lat1, lon1, lat2, lon2):
    # Radius of Earth in km
    R = 6371

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = sin(dlat/2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    # Distance in km
    return R * c