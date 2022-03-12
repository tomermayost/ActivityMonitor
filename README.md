
## Description
Activity Monitor running with [Nest](https://github.com/nestjs/nest) framework, Redis and MongoDB.


## Rest API: 

```
1. Create Event 
Request:
method: POST
URL: 'http://{host}:{port}/api/monitor/events' 
Content-Type: application/json
Body: 
{
    "type": "click",
    "user": "tom12345",
    "page": "gooe.com",
    "element_id": "1erv2333"
}

Response:
Http Status: 201 (created)
Body:
{
    "type": "click",
    "user": "tom12345",
    "page": "gooe.com",
    "element_id": "1erv2333",
    "timestamp": "2022-03-12T10:06:52.218Z"
}
```
```
2. Get Uses Visits since start of day
Request:
method: GET
URL: 'http://{host}:{port}/api/monitor/user/visits' 

Response:
Http Status: 200 (ok)
Body:
{
    "users_visiting_today": 2022
}
```
```
3. Get Events per user since start of day (ordered by events descending)
Request:
method: GET
Optional Query params: skip, limit
URL: 'http://{host}:{port}/api/monitor/events/user' 

Response:
Http Status: 200 (ok)
Body:
[
        { "events": 30, "user": 'jack' },
        { "events": 25, "user": 'jim' },
        { "events": 20, "user": 'jill' },
        { "events": 15, "user": 'suzy' },
        { "events": 10, "user": 'moshe' },
        { "events": 5, "user": 'clod' }
]
```
```
4. Get Average Events per minute since start of day
Request:
method: GET
URL: 'http://{host}:{port}/api/monitor/events/avg_epm' 

Response:
Http Status: 200 (ok)
Body:
{
    "avg_epm": 4.7777777
}
```

## Tests
```
to run the tests:
$npm run test:e2e
```

## Running the app with docker
    it will take a few minutes to build the image the first time you run it.
```bash
# development
$ docker-compose up -d main 
```
    this will spin up the app and its dependecies in docker containers
## Running the app in localy in dev mode 
    for this to work you need to replace the hosts names to localhost in the .env file for the DATABASE_URL and REDIS_HOST vars


```
$ docker-compose up -d redis mongodb && npm run start:dev
```