from flask import Flask
import flask
import json
import os

app = Flask(__name__)


@app.route('/')
def hello_world():
    return flask.render_template('index.html')

@app.route('/load_json/<folder>/<path>')
def return_cpu_info(folder, path):
    folder = "./" + folder
    path = os.path.join(folder, path)
    try:
        with open(path) as f:
            res = json.load(f)
    except Exception:
        res = {}

    resp = flask.Response(json.dumps(res), mimetype='application/json')
    return resp

if __name__ == '__main__':
    app.run()