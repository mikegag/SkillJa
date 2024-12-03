from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db.models import Q
from django.contrib.auth.backends import BaseBackend
from django.core.validators import MaxLengthValidator

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
    age_groups = models.JSONField(default=list, blank=True, null=True)
    specialization = models.JSONField(default=list, blank=True, null=True)

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
    goals = models.JSONField(default=list, blank=True, null=True)
    sport_interests = models.JSONField(default=list, blank=True, null=True)

    def save(self, *args, **kwargs):
        # Set isathlete flag to True when saving athlete preferences
        self.user.isathlete = True 
        self.user.save()
        super().save(*args, **kwargs) 

    def __str__(self):
        return f'{self.user.email} - Athlete Preferences'

class CoachProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='coach_profile')
    primary_sport = models.CharField(max_length=100, blank= True, null = True, default='No Primary Sport')
    location = models.CharField(max_length=100, default='No Location Specified')
    biography = models.CharField(max_length=255, default='No Biography Specified')
    picture = models.ImageField(upload_to='coach_pictures/', blank=True, null=True)
    services = models.ManyToManyField('services', related_name='coach_profile', blank=True)
    reviews = models.ManyToManyField('reviews', related_name='coach_profile', blank=True)
    social_media = models.OneToOneField('socialMedia', on_delete=models.CASCADE, related_name='coach_profile', null=True, blank=True)

    def __str__(self):
        return f'{self.user.email} - Coach Profile'

class AthleteProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='athlete_profile')
    primary_sport = models.CharField(max_length=100, blank= True, null = True, default='Not Specified')
    location = models.CharField(max_length=100, default='No Location Specified')
    biography = models.CharField(max_length=255, default='No Biography Specified')
    picture = models.ImageField(upload_to='athlete_pictures/', blank=True, null=True)
    reviews = models.ManyToManyField('Review', related_name='athlete_profiles', blank=True)

    def __str__(self):
        return f'{self.user.email} - Athlete Profile'

class Service(models.Model):
    TYPE_CHOICES = (
        ('full-program','full-program'),
        ('online-program', 'online-program'),
        ('individual-session','individual-session')
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='services')
    type = models.CharField(max_length=25, choices = TYPE_CHOICES, default='individual-session')
    title = models.CharField(max_length=110)
    description = models.CharField(max_length=240)
    duration = models.CharField(max_length=110, default='')
    frequency = models.CharField(max_length=110, blank=True, null=True)
    target_audience = models.CharField(max_length=110, blank=True, null=True)
    location = models.CharField(max_length=110, blank=True, null=True)
    deliverable = models.CharField(max_length=240, blank=True, null=True)
    price = models.PositiveIntegerField(blank=True, null=True)  

    #tbd - deliverable = models.FileField(upload_to='service_files/', blank=True, null=True)

    def __str__(self):
        return f'{self.title} - {self.user.email}'

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    title = models.CharField(max_length=100)
    description = models.TextField(validators=[MaxLengthValidator(1000)])
    rating = models.DecimalField(max_digits=2, decimal_places=1)
    date = models.DateField(default=timezone.now)

    def __str__(self):
        return f'{self.title} - {self.user.email}'

class SocialMedia(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='socialMedia')
    facebook = models.CharField(max_length=255, blank=True, null=True, default='/')
    twitter = models.CharField(max_length=255, blank=True, null=True, default='/')
    instagram = models.CharField(max_length=255, blank=True, null=True, default='/')
    tiktok = models.CharField(max_length=255, blank=True, null=True, default='/')

    def __str__(self):
        return f'Social Media - {self.user.email}'