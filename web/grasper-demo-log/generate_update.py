import random
import json
import time

file = "status.txt"

steps = [0,1,2,3,4,5,6] # end is omitted


if __name__ == "__main__":
	while True:
		k = random.randint(1,len(steps))
		active_steps = random.choices(steps, k=k)
		upd = dict()
		upd["update"] = []
		for s in active_steps:
			parallism = random.randint(1,7)
			for p in range(parallism):
				upd["update"].append({ "step" : s, "msg_type" : 1 })

		print(upd)
		with open(file, "w") as f:
			json.dump(upd, f)

		time.sleep(0.1)
