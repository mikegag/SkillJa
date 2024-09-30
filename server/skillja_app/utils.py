#function that utilizes geocoding api to apply results to search proximity

#calculates lower and upper bound from a given input, used for search results for finding a price range from single input
from server.skillja_app.models import User


def calculate_price_deviance(original_input, lower_percentage, upper_percentage):
    lower_bound = original_input - (lower_percentage / 100) * original_input
    upper_bound = original_input + (upper_percentage / 100) * original_input
    return lower_bound, upper_bound

#calculates the average price for a coach based on their services, used for ranking coaches based on cost
def calculate_coach_cost(coach_id):
    try:
        # Get the coach by their id
        coach = User.objects.get(id=coach_id)

        # Check if the user is a coach
        if coach.iscoach:
            # Retrieve all services related to the coach
            services = coach.coach_profile.services.all()

            # Get the prices for each service
            prices = [service.price for service in services if service.price]

            if prices:
                # Calculate the average price
                average_price = sum(prices) / len(prices)

                ''' Price scale based on average cost:
                        $: 0-50
                        $$: 51-100
                        $$$: 101-150
                        $$$$: > 151
                '''
                if average_price <= 50:
                    return 1
                elif average_price <= 100:
                    return 2
                elif average_price <= 150:
                    return 3
                else:
                    return 4   
            else:
                # Return 1 as a default if no services have prices
                return 1
        else:
             # If the user is not a coach, return 1 as default value
            return 1 
    except User.DoesNotExist:
        # If the coach does not exist, return 1 as default value
        return 1

#calculate average review rating for a coach, used for ranking coaches based on reviews
def calculate_coach_review(coach_id):
    try:
        # Get the coach by their id
        coach = User.objects.get(id=coach_id)

        # Check if the user is a coach
        if coach.iscoach:
            # Get all the reviews for the coach
            reviews = coach.coach_profile.reviews.all()

            # Get all the ratings for each review
            ratings = [review.rating for review in reviews if review.rating]

            if ratings:
                # Calculate the average rating
                average_rating = sum(ratings) / len(ratings)
                return average_rating
            else:
                # Handle the case where no reviews have ratings
                return None
        else:
            # If the user is not a coach, return None or handle accordingly
            return None 
    except User.DoesNotExist:
        # If the coach does not exist, return None or handle accordingly
        return None 