import flask
from flask import request
import json
import subprocess
import time, os
import signal
import glob

from grasper_infos import *
import grasper_infos

app = flask.Flask(__name__)

# app.logger.setLevel(40)
import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app_table = {}
coordinator_table = {}
finished_key_set = set()

dev_debug = False

GRASPER_HOME = os.environ['GRASPER_HOME']
GRASPER_DEMO_LOG = os.path.join(GRASPER_HOME, 'grasper-demo-log')
query_dir = os.path.join(GRASPER_HOME, 'query') # all queries are stored in separate files in a folder called /query
client_log_file = os.path.join(GRASPER_DEMO_LOG, 'client_console.txt')
dag_update_file = os.path.join(GRASPER_DEMO_LOG, 'status.txt')

timestamp = ""

'''
    Index page
'''
@app.route('/')
def main():
    persons = grasper_infos.grasper_persons
    persons = [persons[i * 2:i * 2 + 2] for i in range(7//2 + 1)]
    supervisors = grasper_infos.grasper_supervisors
    supervisors = [supervisors[i * 2:i * 2 + 2] for i in range(7//2 + 1)]
    return flask.render_template('index.html',
            # apps=grasper_apps,
            supervisors = supervisors,
            # datasets=grasper_datasets,
            # sysconfigs0=grasper_sysconfig[:3],
            # sysconfigs1=grasper_sysconfig[3:],
            slideimages = grasper_infos.grasper_compare,
            teammembers = persons)
            # codes = grasper_infos.grasper_codes)

'''
    User submit the request to the backend
    {
        "mode" : "single/thpt",
        "qid" : 1
    }
'''
@app.route('/runrequest', methods=['POST'])
def runApplication():
    global timestamp
    timestamp = get_timestamp()
    data = request.form.copy() # TODO: data or form?


    # 2. submit the query to a client node in a file format
    query_mode = data["mode"]
    if query_mode == "single":
        qid = data["qid"]
        query_fname = "{}/{}.query".format(query_dir, qid)
    elif query_mode == "thpt":
        query_fname = "{}/thpt.query".format(query_dir)

    final_cmd = "{}/release/client {}/ib.cfg {}/{} {}".format(GRASPER_HOME, GRASPER_HOME, GRASPER_HOME, query_fname, str(timestamp), client_log_file)
    print('run command: ', final_cmd)
    log_file = open(client_log_file, 'w')
    proc = subprocess.Popen(final_cmd, shell=True, stdout=log_file)

    data.update({'timestamp': timestamp, 'status': "ok"})

    resp = flask.Response(json.dumps(data), mimetype='application/json')
    return resp


'''
    CPU and Infiniband monitor data
'''
@app.route('/stat')
def return_stat():
    stat_path = os.path.join(GRASPER_DEMO_LOG, "*_monitor-data.json")
    stat_file = glob.glob(stat_path)[0]
    data = []
    with open(stat_file, "r") as f:
        for line in f.readlines():
            if line.rstrip() == "":
                continue
            data.append(json.loads(line.rstrip()))

    res = { "stat" : data }
    resp = flask.Response(json.dumps(res), mimetype='application/json')
    return resp

'''
    Throughput
'''
@app.route('/thpt')
def return_thpt():
    thpt_path = os.path.join(GRASPER_DEMO_LOG, "thpt.txt")
    res = dict()
    res["stat"] = []
    try:
        with open(thpt_path, "r") as f:
            for line in f.readlines():
                if line.rstrip() == "":
                    continue
                value = float(line.rstrip())
                res['stat'].append({'value' : value, 'type' : "throughput"})
    except IOError:
        pass

    resp = flask.Response(json.dumps(res), mimetype='application/json')
    return resp

'''
    Output Console
'''
@app.route('/output')
def return_output():
    res = dict()
    res["content"]=[]
    try:
        with open(client_log_file, 'r') as f:
            for line in f.readlines():
                line = line.rstrip()
                if line != '':
                    res["content"].append(line)
    except IOError:
        pass

    resp = flask.Response(json.dumps(res), mimetype='application/json')
    return resp

'''
    DAG Update
    url: /update?timestamp=730180190&qid=1
    TODO: use mapping
'''
@app.route('/update')
def return_update():
    timestamp = request.args.get("timestamp")
    qid = request.args.get("qid")
    print(timestamp)

    try:
        with open(dag_update_file, "r") as json_file:
            data = json.load(json_file) # data is a list of updates
            data = data["update"]

        update_dic = dict()
        for upd in data:
            if upd["step"] in update_dic:
                update_dic[upd["step"]] += 1
            else:
                update_dic[upd["step"]] = 1

        activer = []
        for key, value in update_dic.items():
            tmp = { "steps" : key, "threads" : value }
            activer.append(tmp)

        res = dict()
        res["activer"] = activer
        res["status"] = 0

        result_path = os.path.join(GRASPER_DEMO_LOG, "{}.result".format(timestamp))
        if os.path.exists(result_path): # this query is finished
            res["status"] = 1
            # launch_cleanup()

    except IOError:
        res = { "activer" : [], "status" : 0}

    resp = flask.Response(json.dumps(res), mimetype='application/json')
    return resp

'''
Utility Functions
'''
def discardByKey(key):
    # del app_table[key]
    coordinator_table[key].kill()

def get_timestamp():
    t = time.time()
    t = int(t * 1000 + 0.5)
    return t

def launch_cleanup():
    global timestamp

    # clean up result file
    result_path = os.path.join(GRASPER_DEMO_LOG, timestamp+".result")
    os.remove(result_path)

    # clean up monitoring data
    monitor_path = os.path.join(GRASPER_HOME, "*_monitor-data.json")
    monitor_files = glob.glob(monitor_path)[0]
    for m in monitor_files:
        os.remove(monitor_files)

    # clean up thpt files
    thpt_path = os.path.join(GRASPER_DEMO_LOG, "thpt.txt")
    os.remove(thpt_path)

    # restore timestamp
    timestamp = ""

if __name__ == "__name__":
    app.run()

'''
    Return the result if the query is finished
'''
# @app.route('/result')
# def return_result():
#     timestamp = string(request.args.get('timestamp'))
#     path = os.path.join(GRASPER_HOME, timestamp+".result")
#     res = {}
#     try:
#         with open(path, "r") as json_file:
#             res = json.load(json_file)
#             launch_cleanup(timestamp)
#         except Exception:
#             res = {}

#     resp = flask.Response(json.dumps(res), mimetype='application/json')
#     return resp

if __name__ == '__main__':
    app.run(port=5000)
