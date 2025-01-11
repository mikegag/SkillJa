from django.apps import AppConfig
from datetime import timedelta
from django.utils import timezone
from django.db.models.signals import post_migrate


def setup_scheduled_task(sender, **kwargs):
    from django_q.tasks import schedule
    from django_q.models import Schedule

    # Schedule the task if not already scheduled
    if not Schedule.objects.filter(func='skillja_app.models.Event.delete_old_events').exists():
        schedule(
            'skillja_app.models.Event.delete_old_events',
            schedule_type='D',  # Daily
            next_run=timezone.now() + timedelta(days=1),
        )


class SkilljaAppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "skillja_app"

    def ready(self):
        post_migrate.connect(setup_scheduled_task, sender=self)
