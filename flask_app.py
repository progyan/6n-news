from pywebpush import webpush
from flask import Flask, request, session, jsonify, send_from_directory, redirect
from flask.templating import render_template
from markupsafe import escape
from flask_cors import CORS
import psycopg2
import os
from datetime import date

from werkzeug.utils import environ_property

#class SimpleMiddleWare(object):
#    def __init__(self, app):
#        self.app = app
#
#    def __call__(self, environ, start_response):
 #       if environ["SERVER_PORT"] == 8000:
  #          start_response('301 Moved Permanently', [('Location','http://google.com')])
   #     return self.app(environ, start_response)

def check_env(app):
    if not os.environ.get("WEB_PUSH_KEY"):
        app.logger.error("ERROR: WEB_PUSH_KEY is not set")
        exit(-1)
    if not os.environ.get("SESSION_KEY"):
        app.logger.error("ERROR: SESSION_KEY is not set")
        exit(-1)


app = Flask(__name__)
#app.wsgi_app = SimpleMiddleWare(app.wsgi_app)
check_env(app)
app.secret_key = os.environ["SESSION_KEY"].encode()
CORS(app)

@app.route("/news")
def news_list():
    with get_connection() as con:
        cur = con.cursor()
        cur.execute('SELECT creator, title, content, news_type, id, is_important, creation_date FROM news;')
        #return jsonify(_news)
        ans = cur.fetchall()
        for i in range(len(ans)):
            ans[i] = list(ans[i])
            ans[i][6] = ans[i][6].strftime("%d.%m.%Y")
        return jsonify(ans)

@app.post("/addnews")
def add_news():
    if request.json[1] != "" and request.json[2] != "":
        with get_connection() as con:
            cur = con.cursor()
            if session["username"] == "Ю. Е. Козуб" or session["username"] == "Ян Бобрус":
                cur.execute('INSERT INTO news (creator, title, content, news_type, is_important, creation_date) VALUES (%s, %s, %s, %s, %s, %s);',
                        request.json + [date.today()])
                con.commit()
                # TODO: make async
                cur.execute('SELECT endpoint, p256dh, auth FROM subscriptions;')
                #app.logger.debug(cur.fetchall())
                for sub in cur.fetchall():
                    webpush(
                        subscription_info={
                            "endpoint": sub[0],
                            "keys": {
                                "p256dh": sub[1],
                                "auth": sub[2]
                            }
                        },
                        data=("6Н: " + request.json[0] + " написал(а) новость \"" + request.json[1] + "\""),
                        vapid_private_key=os.environ["WEB_PUSH_KEY"],
                        vapid_claims={"sub": "mailto:yancolabs@gmail.com"}
                    )
                return jsonify("OK")
            else:
                return jsonify("NO RIGHTS")

@app.route("/deletenews/<int:id>")
def delete_news(id):
    with get_connection() as con:
        cur = con.cursor()
        cur.execute('SELECT creator FROM news where id = %s;', (id,))
        if session["username"] == cur.fetchall()[0][0]:
            cur.execute('DELETE FROM news WHERE id = %s;', (id,))
            con.commit()
            return jsonify("OK")
        else:
            return jsonify("NO RIGHTS")

@app.post("/login")
def login():
    with get_connection() as con:
        cur = con.cursor()
        cur.execute('SELECT id FROM users WHERE username = %s AND password = %s;', request.json)
        here = cur.fetchall()
        if here and len(here[0]):
            session['username'] = request.json[0]
            return jsonify("OK")
        return jsonify("FAIL")

@app.post("/updatenews/<int:id>")
def update_news(id):
    if request.json[1] != "" and request.json[2] != "":
        with get_connection() as con:
            cur = con.cursor()
            cur.execute('SELECT creator FROM news where id = %s;', (id,))
            if session["username"] == cur.fetchall()[0][0]:
                cur.execute('UPDATE news SET creator = %s, title = %s, content = %s, news_type = %s, is_important = %s, creation_date = %s WHERE id = %s;',
                        request.json + [date.today(), id])
                con.commit()
                # TODO: make async
                cur.execute('SELECT endpoint, p256dh, auth FROM subscriptions;')
                #app.logger.debug(cur.fetchall())
                for sub in cur.fetchall():
                    webpush(
                        subscription_info={
                            "endpoint": sub[0],
                            "keys": {
                                "p256dh": sub[1],
                                "auth": sub[2]
                            }
                        },
                        data=("6Н: " + request.json[0] + " изменил(а) новость \"" + request.json[1] + "\""),
                        vapid_private_key=os.environ["WEB_PUSH_KEY"],
                        vapid_claims={"sub": "mailto:yancolabs@gmail.com"}
                    )
                return jsonify("OK")
            else:
                return jsonify("NO RIGHTS")

@app.post("/logout")
def logout():
    session.pop("username")
    return jsonify("OK")

@app.route("/getuser")
def getuser():
    app.logger.debug(session)
    return session.get('username', '')

@app.route('/pages/<path:path>')
def pages(path):
    return send_from_directory('static', path)

@app.route("/")
def main_page():
    return redirect("https://news-6n.herokuapp.com/pages/main/index.html")

@app.post("/subscribe")
def subscribe():
    with get_connection() as con:
        cur = con.cursor()
        app.logger.debug(request.json)
        cur.execute('INSERT INTO subscriptions (endpoint, p256dh, auth) VALUES (%s, %s, %s);', (request.json["endpoint"], request.json["keys"]["p256dh"], request.json["keys"]["auth"]))
        return jsonify({"data": {"success": True}})

def get_connection():
    if os.environ.get("ENV") == 'prod':
        # Heroku settings
        app.logger.debug("Database from Heroku")
        return psycopg2.connect(os.environ["DATABASE_URL"])
    # return connection to dev server
    return psycopg2.connect(database='6n', user='postgres', password='postgres', 
            host='localhost', port=5432)

#if __name__ == '__main__':
#    app.run(ssl_context='adhoc')