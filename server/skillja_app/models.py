# models.py
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

class UserManager(BaseUserManager):
    def create_user(self, email, fullname, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email field must be set'))
        if not username:
            raise ValueError(_('The Username field must be set'))
        if not fullname:
            raise ValueError(_('The Fullname field must be set'))

        email = self.normalize_email(email)
        user = self.model(email=email, fullname=fullname, password=password, **extra_fields)
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
    fullname = models.CharField(max_length=50)
    email = models.EmailField(_('email address'), unique=True)
    date_joined = models.DateTimeField(default=timezone.now)
    date_ideas = models.JSONField(default=list)
    #need to map out all atributes for this (chats? is coach or athlete yet? etc.)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'fullname']

    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name=_('groups'),
        blank=True,
        related_name='skillja_user_set',
        related_query_name='skillja_user',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name=_('user permissions'),
        blank=True,
        related_name='skillja_user_set', 
        related_query_name='skillja_user',
    )

    def __str__(self):
        return self.email