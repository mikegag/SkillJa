# Generated by Django 3.2.25 on 2024-12-03 23:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('skillja_app', '0007_auto_20241130_2108'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coachprofile',
            name='reviews',
            field=models.ManyToManyField(blank=True, related_name='coach_profile', to='skillja_app.Review'),
        ),
        migrations.AlterField(
            model_name='coachprofile',
            name='services',
            field=models.ManyToManyField(blank=True, related_name='coach_profile', to='skillja_app.Service'),
        ),
        migrations.AlterField(
            model_name='coachprofile',
            name='social_media',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='coach_profile', to='skillja_app.socialmedia'),
        ),
    ]