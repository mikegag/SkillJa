from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, email, fullname, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not fullname:
            raise ValueError('The Fullname field must be set')

        email = self.normalize_email(email)
        user = self.model(email=email, fullname=fullname, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, fullname, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')

        return self.create_user(email, fullname, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    fullname = models.CharField(max_length=80)
    email = models.EmailField('email address', unique=True)
    birthdate = models.DateField()
    phonenumber = models.CharField(max_length=20)
    gender = models.CharField(max_length=20)
    iscoach = models.BooleanField(default=False)
    isathlete = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['fullname', 'birthdate', 'phonenumber', 'gender']

    def __str__(self):
        return self.email

class CoachPreferences(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='coach_preferences')
    experience_level = models.CharField(max_length=255)
    age_groups = models.CharField(max_length=255)
    specialization = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.user.email} - Coach Preferences'

class AthletePreferences(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='athlete_preferences')
    experience_level = models.CharField(max_length=255)
    goals = models.CharField(max_length=255)
    sport_interests = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.user.email} - Athlete Preferences'


