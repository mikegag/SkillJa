release: python server/manage.py migrate
web: gunicorn wsgi:app --bind 0.0.0.0:$PORT --log-file -





