release: npm run build && python server/manage.py migrate
web: PYTHONPATH=/app/server gunicorn skillja_project.wsgi:application --log-file - --log-level debug






