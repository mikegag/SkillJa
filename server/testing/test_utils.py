import unittest
import os
import django
from django.conf import settings
from django.contrib.auth import get_user_model
import pytest
from skillja_app.utils import calculate_coach_cost, calculate_coach_review, calculate_price_deviance

# Set the settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'skillja_project.settings')  # Replace with your actual settings module

# Setup Django
django.setup()


class TestUtils(unittest.TestCase):

    def test_calculate_price_deviance(self):
        """Test the calculate_price_deviance function."""
        # Test case 1
        result = calculate_price_deviance(25, 10, 10)
        self.assertEqual(result, (22.5,27.5))

        # Test case 2
        result = calculate_price_deviance(0, 12, 22)
        self.assertEqual(result, (0.0,0.0))

        # Test case 3
        result = calculate_price_deviance(40, 15, 20)
        self.assertEqual(result, (34.0,48.0))

    User = get_user_model()

    @pytest.mark.django_db
    def test_calculate_coach_cost():
        # Create a test coach user
        coach = User.objects.create(
            username='test_coach',
            iscoach=True
        )
        
        # Add a mock coach profile and services to the coach
        coach_profile = coach.coach_profile
        coach_profile.services.create(price=30)  # Service 1
        coach_profile.services.create(price=70)  # Service 2
        coach_profile.services.create(price=0)    # Service 3 (no price)
        
        # Test with a coach that has services with prices
        assert calculate_coach_cost(coach.id) == 2  # Average is (30 + 70) / 2 = 50 -> should return 2

        # Test with a coach that has no services
        coach_profile.services.all().delete()  # Remove all services
        assert calculate_coach_cost(coach.id) == 1  # No services -> should return 1

        # Test with a coach that is not a coach
        non_coach_user = User.objects.create(username='non_coach', iscoach=False)
        assert calculate_coach_cost(non_coach_user.id) == 1  # Not a coach -> should return 1

        # Test with a non-existing coach
        assert calculate_coach_cost(9999) == 1  # Non-existing coach -> should return 1



if __name__ == "__main__":
    unittest.main()