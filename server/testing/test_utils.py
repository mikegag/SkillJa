import unittest
import os
import django
from django.conf import settings
from unittest.mock import patch, Mock
from django.contrib.auth import get_user_model
import pytest
from skillja_app.models import CoachProfile, User, Service
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

    #test for calculate_coach_cost, additional test database will need to be created (another postgreSQL add-on in heroku $)

    #test for calculate_coach_review, additional test database will need to be created (another postgreSQL add-on in heroku $)


if __name__ == "__main__":
    unittest.main()
