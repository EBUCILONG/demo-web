import time
import json

dict={}
dict["text"]="cao ni ma shabi"
out_path="./load_json/runtime-infos/console_log.json"
out_file=open(out_path, "w")
json.dump(dict, out_file, indent = 4, sort_keys = False)
