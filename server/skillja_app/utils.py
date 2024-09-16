#function that utilizes geocoding api to apply results to search proximity

#calculates lower and upper bound from a given input, used for search results for finding a price range from single input
def calculate_price_deviance(original_input, lower_percentage, upper_percentage):
    lower_bound = original_input - (lower_percentage / 100) * original_input
    upper_bound = original_input + (upper_percentage / 100) * original_input
    return lower_bound, upper_bound

#calculates the average price for a coach based on their services, used for ranking coaches based on cost
def calculate_coach_cost(coach_email):
    try:
        # Get the coach by their email
        coach = User.objects.get(email=coach_email)

        # Check if the user is a coach
        if coach.iscoach:
            # Retrieve all services related to the coach
            services = coach.coach_profile.services.all()

            # Get the prices for each service
            prices = [service.price for service in services if service.price]

            if prices:
                # Calculate the average price
                ''' Scale for prices ranging from $-$$$$: 
                        $: 0-50
                        $$: 51-100
                        $$$: 101 - 150
                        $$$$: > 151
                '''
                scale = 1
                average_price = sum(prices) / len(prices)

                if average_price <= 50:
                    scale = 1
                elif average_price > 50 and average_price <= 100:
                    scale = 2
                elif average_price > 100 and average_price <= 150:
                    scale = 3
                elif average_price > 150:
                    scale = 4   
                return scale 
            else:
                # Handle the case where no services have prices
                return None
        else:
             # If the user is not a coach, return None or handle accordingly
            return None 
    except User.DoesNotExist:
        # If the coach does not exist, return None or handle accordingly
        return None  


#calculate average review rating for a coach, used for ranking coaches based on reviews
def calculate_coach_review(coach_email):
    try:
        # Get the coach by their email
        coach = User.objects.get(email=coach_email)

        # Check if the user is a coach
        if coach.iscoach:
            # Get all the reviews for the coach
            reviews = coach.coach_profile.reviews.all()

            # Get all the ratings for each review
            ratings = [review.rating for review in reviews if review.rating]

            if ratings:
                # Calculate the average rating and round to the nearest whole number
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