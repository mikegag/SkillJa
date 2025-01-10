from django.apps import AppConfig
from django_q.tasks import schedule
from datetime import timedelta
from django.utils import timezone

class SkilljaAppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "skillja_app"

    def ready(self):
        # Schedule the task if not already scheduled
        from django_q.models import Schedule

        if not Schedule.objects.filter(func='skillja_app.models.Event.delete_old_events').exists():
            schedule(
                'skillja_app.models.Event.delete_old_events',
                schedule_type='D',  # Daily
                next_run=timezone.now() + timedelta(days=1),
            )