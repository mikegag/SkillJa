# Generated by Django 3.2.25 on 2024-10-08 23:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('skillja_app', '0004_auto_20241008_0113'),
    ]

    operations = [
        migrations.AlterField(
            model_name='athleteprofile',
            name='biography',
            field=models.CharField(default='No Biography Specified', max_length=255),
        ),
        migrations.AlterField(
            model_name='athleteprofile',
            name='location',
            field=models.CharField(default='No Location Specified', max_length=100),
        ),
        migrations.AlterField(
            model_name='coachprofile',
            name='biography',
            field=models.CharField(default='No Biography Specified', max_length=255),
        ),
        migrations.AlterField(
            model_name='coachprofile',
            name='location',
            field=models.CharField(default='No Location Specified', max_length=100),
        ),
    ]