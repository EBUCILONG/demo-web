from flask import Flask
import flask
from flask import request
import json
import random
import os
from grasper_infos import *
import grasper_infos
app = Flask(__name__)


@app.route('/')
def hello_world():
    persons = grasper_infos.grasper_persons
    persons = [persons[i * 2:i * 2 + 2] for i in range(7//2 + 1)]
    supervisors = grasper_infos.grasper_supervisors
    supervisors = [supervisors[i * 2:i * 2 + 2] for i in range(7//2 + 1)]
    return flask.render_template('index.html', apps=grasper_apps,
            supervisors = supervisors,
            datasets=grasper_datasets,
            sysconfigs0=grasper_sysconfig[:3],
            sysconfigs1=grasper_sysconfig[3:], 
            slideimages = grasper_infos.grasper_compare, 
            teammembers = persons, 
            codes = grasper_infos.grasper_codes)

@app.route('/active', methods=['GET'])
def Application():
    print("**********")
    print(request.args)
    print("**********")
    folder = "./templates/load_json"
    path = os.path.join(folder, "update_dag.json")
    try:
        with open(path) as f:
            res = json.load(f)
    except Exception:
        res = {}

    resp = flask.Response(json.dumps(res), mimetype='application/json')
    return resp

@app.route('/runrequest', methods=['POST'])
def runApplication():
    print(request.form)
    # try:
    # 1. run python coordinator
    dicter = {"timestamp":10000}
    resp = flask.Response(json.dumps(dicter), mimetype='application/json')
    return resp

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