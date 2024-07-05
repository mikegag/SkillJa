from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db.models import Q
from django.contrib.auth.backends import BaseBackend

class EmailAuthBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = User.objects.get(email=username)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

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

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='skillja_app_user_set',
        blank=True,
        help_text=_('The groups this user belongs to. A user will get all permissions granted to each of their groups.'),
        verbose_name=_('groups')
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='skillja_app_user_set',
        blank=True,
        help_text=_('Specific permissions for this user.'),
        verbose_name=_('user permissions')
    )

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

    def save(self, *args, **kwargs):
        # Set iscoach flag to True when saving coach preferences
        self.user.iscoach = True  
        self.user.save() 
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.user.email} - Coach Preferences'

class AthletePreferences(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='athlete_preferences')
    experience_level = models.CharField(max_length=255)
    goals = models.CharField(max_length=255)
    sport_interests = models.CharField(max_length=255)

    def save(self, *args, **kwargs):
        # Set isathlete flag to True when saving athlete preferences
        self.user.isathlete = True 
        self.user.save()
        super().save(*args, **kwargs) 

    def __str__(self):
        return f'{self.user.email} - Athlete Preferences'

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    location = models.CharField(max_length=100)
    biography = models.CharField(max_length=255)
    # picture = models.ImageField()
    # sport specializations?