# Generated by Django 3.2.25 on 2024-11-30 21:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('skillja_app', '0006_auto_20241112_0140'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coachprofile',
            name='primary_sport',
            field=models.CharField(blank=True, default='No Primary Sport', max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='service',
            name='deliverable',
            field=models.CharField(blank=True, max_length=240, null=True),
        ),
        migrations.AlterField(
            model_name='service',
            name='description',
            field=models.CharField(max_length=240),
        ),
        migrations.AlterField(
            model_name='service',
            name='duration',
            field=models.CharField(default='', max_length=110),
        ),
        migrations.AlterField(
            model_name='service',
            name='frequency',
            field=models.CharField(blank=True, max_length=110, null=True),
        ),
        migrations.AlterField(
            model_name='service',
            name='location',
            field=models.CharField(blank=True, max_length=110, null=True),
        ),
        migrations.AlterField(
            model_name='service',
            name='price',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='service',
            name='target_audience',
            field=models.CharField(blank=True, max_length=110, null=True),
        ),
        migrations.AlterField(
            model_name='service',
            name='title',
            field=models.CharField(max_length=110),
        ),
        migrations.AlterField(
            model_name='service',
            name='type',
            field=models.CharField(choices=[('full-program', 'full-program'), ('online-program', 'online-program'), ('individual-session', 'individual-session')], default='individual-session', max_length=25),
        ),
    ]
