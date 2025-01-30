from django.db import models
from django.utils import timezone
from django.utils.timezone import now, timedelta
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
    is_active = models.BooleanField(default=False)
    fullname = models.CharField(max_length=80)
    email = models.EmailField('email address', unique=True)
    birthdate = models.DateField()
    phonenumber = models.CharField(max_length=20)
    gender = models.CharField(max_length=20)
    iscoach = models.BooleanField(default=False)
    isathlete = models.BooleanField(default=False)
    timezone = models.CharField(max_length=50, default="UTC")

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
    picture = models.CharField(max_length=120, default='', blank=True)
    services = models.ManyToManyField('Service', related_name='coach_services', blank=True)
    reviews = models.ManyToManyField('Review', related_name='coach_profiles', blank=True) 

    def __str__(self):
        return f'{self.user.email} - Coach Profile'

class AthleteProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='athlete_profile')
    primary_sport = models.CharField(max_length=100, blank= True, null = True, default='Not Specified')
    location = models.CharField(max_length=100, default='No Location Specified')
    biography = models.CharField(max_length=255, default='No Biography Specified')
    picture = models.CharField(max_length=120, default='', blank=True)
    reviews = models.ManyToManyField('Review', related_name='athlete_profiles', blank=True)

    def __str__(self):
        return f'{self.user.email} - Athlete Profile'

class Service(models.Model):
    TYPE_CHOICES = (
        ('full-program','full-program'),
        ('online-program', 'online-program'),
        ('individual-session','individual-session')
    )
    coach_profile = models.ForeignKey('CoachProfile', on_delete=models.CASCADE, related_name='services_offered',null=True, blank=True )
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
        return f'{self.user.email} - Service'

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    title = models.CharField(max_length=100)
    description = models.TextField(validators=[MaxLengthValidator(1000)])
    rating = models.DecimalField(max_digits=2, decimal_places=1)
    date = models.DateField(default=timezone.now)

    def __str__(self):
        return f'{self.user.email} - Review'

class SocialMedia(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='socialMedia')
    facebook = models.CharField(max_length=255, blank=True, null=True, default='/')
    twitter = models.CharField(max_length=255, blank=True, null=True, default='/')
    instagram = models.CharField(max_length=255, blank=True, null=True, default='/')
    tiktok = models.CharField(max_length=255, blank=True, null=True, default='/')

    def __str__(self):
        return f'{self.user.email} - Social Media'
    
class Settings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='settings')
    email_message_notifications = models.BooleanField(default=False)
    email_appointment_notifications = models.BooleanField(default=False)
    email_marketing_notifications = models.BooleanField(default=False)
    account_deletion_reason = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f'{self.user.email} - Settings '

class Chat(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_initiator')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chats_receiver')
    created_at = models.DateTimeField(default=now)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user1', 'user2'],
                name='unique_chat_users'
            )
        ]
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if self.user1 == self.user2:
            raise ValueError("A user cannot start a chat with themselves.")
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Chat between {self.user1.email} and {self.user2.email}'

class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='message')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='sent_message')
    content = models.TextField()
    sent_at = models.DateTimeField(default=now)
    read = models.BooleanField(default=False)

    # admin messages will not have the sender field
    def __str__(self):
        if self.sender:
            return f'Message {self.id} from {self.sender.email}'
        return f'System Message {self.id}'

class Calendar(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='calendar')

    def __str__(self):
        return f"{self.user.get_full_name()}'s Calendar"

class Event(models.Model):
    created_at = models.DateTimeField(default=now)
    date = models.DateTimeField()
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    participants = models.ManyToManyField(User, related_name='events')

    def __str__(self):
        return f"{self.title} on {self.date.strftime('%Y-%m-%d-%H-%M')}"

    @classmethod
    def delete_old_events(cls):
        """
        Deletes events older than one year.
        """
        one_year_ago = timezone.now() - timedelta(days=365)
        cls.objects.filter(date__lt=one_year_ago).delete()

class BlockedDay(models.Model):
    # Format YYYY-MM-DD
    date = models.DateField()
    month_schedule = models.ForeignKey("MonthSchedule", on_delete=models.CASCADE, related_name="blocked_days")

    def __str__(self):
        return f"Blocked Day: {self.date}"

class WeeklySchedule(models.Model):
    # Represent availability for a specific day of the week
    # 1 = Sunday, ..., 7 = Saturday
    day_of_week = models.PositiveSmallIntegerField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    month_schedule = models.ForeignKey("MonthSchedule", on_delete=models.CASCADE, related_name="weekly_schedules")

    class Meta:
        unique_together = ('month_schedule', 'day_of_week')

    def __str__(self):
        return f"Day {self.day_of_week}: {self.start_time} - {self.end_time}"

class MonthSchedule(models.Model):
    coach_availability = models.ForeignKey("CoachAvailability", on_delete=models.CASCADE, related_name="month_schedules")
    # Format: YYYY-MM
    month = models.CharField(max_length=7)
    is_current_month = models.BooleanField()

    def __str__(self):
        return f"{'Current' if self.is_current_month else 'Next'} Month Schedule"

class CoachAvailability(models.Model):
    coach = models.OneToOneField(User, on_delete=models.CASCADE, related_name="availability")

    def __str__(self):
        return f"Availability for Coach {self.coach}"