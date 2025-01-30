from django.utils.timezone import activate

class TimezoneMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated and hasattr(request.user, "timezone"):
            # Set user's timezone
            activate(request.user.timezone)
        else:
            # Default to UTC for anonymous users
            activate("UTC") 

        return self.get_response(request)
