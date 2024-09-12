#function that utilizes geocoding api to apply results to search proximity

#calculates lower and upper bound from a given input, used for search results for finding a price range from single input
def calculate_price_deviance(original_input, lower_percentage, upper_percentage):
    lower_bound = original_input - (lower_percentage / 100) * original_input
    upper_bound = original_input + (upper_percentage / 100) * original_input
    return lower_bound, upper_bound

# calculate average price for a coach

#calculate average review rating for a coach