**1. Check if the result is ready**

The front-end should recur to ask the back-end if the result for the corresponding query is ready.

Route= `/result?timestamp=<t>`

Method="GET"

If the result is ready, the back-end will reply with a http response with non-empty body. Otherwise, the result is not ready yet, so keep asking.



**2. Request the monitoring data (CPU, Infiniband)**

The front-end should recur to fetch the most recent data from the back-end.

Route=`\stat`

Method="GET"

The body of the HTTP response looks like the following.

```json
[
	{"value": 0.0, "time": 0, "type": "cpu"},
	{"value": 303.7958984375, "time": 0, "type": "infiniband"}
  # ....... more data
] # this is a list
```



**3. Check throughput**

In the throuput mode, the front-end should recur to fetch the most recent throughput data from the back-end. 

Route=`\thpt`

Method="GET"

The body of the HTTP response looks like the following.

```json
[
  24294,
  31398,
  89182,
  # ...... more data
] # this is a list
```



**4. Submit a single query**

If a user choose a query in the single query mode, the front end should post the query to the back end.

Route=`\runrequest`

Method="POST"

The request body should look like the following.

```json
{
  "qid": 5, # one of the eight queries
  "mode": "single" # or "thpt"
}
```

The back-end will respond with

```json
{
  'timestamp': 1780120910,
  'status': "ok"
}
```





