set FLASK_APP=flask_app
set FLASK_ENV=development
set /P WEB_PUSH_KEY=< webpush.pkey
set /P SESSION_KEY=< session.pkey
flask run --host=0.0.0.0