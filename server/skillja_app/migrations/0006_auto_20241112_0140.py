# Generated by Django 3.2.25 on 2024-11-12 01:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('skillja_app', '0005_auto_20241008_2317'),
    ]

    operations = [
        migrations.AlterField(
            model_name='athletepreferences',
            name='goals',
            field=models.JSONField(blank=True, default=list, null=True),
        ),
        migrations.AlterField(
            model_name='athletepreferences',
            name='sport_interests',
            field=models.JSONField(blank=True, default=list, null=True),
        ),
        migrations.AlterField(
            model_name='coachpreferences',
            name='age_groups',
            field=models.JSONField(blank=True, default=list, null=True),
        ),
        migrations.AlterField(
            model_name='coachpreferences',
            name='specialization',
            field=models.JSONField(blank=True, default=list, null=True),
        ),
    ]
