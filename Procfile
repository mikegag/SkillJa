release: python server/manage.py migrate
web: gunicorn server.wsgi:application --bind 0.0.0.0:$PORT --log-file -





