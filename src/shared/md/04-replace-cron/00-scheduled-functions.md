Cloudwatch Events allow us to schedule an invocation of a Lambda function. In this exercise we'll ping your domain every five minutes and save some telemtry data in DynamoDB.

---
### 1. Setup

Lets create a new working project to group all our `@scheduled` functions in one place.

```bash
mkdir arc-workshop-scheduled
mkdir arc-workshop-scheduled/test
cd arc-workshop-scheduled
npm init --yes
```

Add some deps:

```
npm i @architect/data --save
npm i @architect/workflows run-parallel run-waterfall tape tap-spec --save-dev
```

And some starter files:

```bash
touch index.js
touch test/env-test.js
touch .arc
```

And finally setup `npm run` Workflows

Edit `package.json` `scripts`:

```javascript
{
  "scripts": {
    "create": "AWS_PROFILE=personal AWS_REGION=us-east-1 arc-create",
    "deploy": "AWS_PROFILE=personal AWS_REGION=us-east-1 arc-deploy"
  }
}

---
### 2. Architecture as Text

Naviate to repo and edit `.arc`:

```.arc
@app
arc-workshop

@tables
heartbeats
  utcDate *String
  utcTime **String
  ttl TTL
  #latency Number

@scheduled
heartbeats rate(5 minutes)
```

Things to notice:
- Once again note the `@app` namespace is the same
- We are enabling TTL on the table; rows with a `ttl` are expired automatically
- Arguably `@tables` should go in the `arc-workshop-data` repo; when the time comes do what makes sense for your architecture
- There is a `#latency` comment noting the intended model schema
- `@scheduled` denotes scheduled functions
- `heartbeats` is the function name
- `rate(5 minutes)` is the function execution interval

And run
```
npm run create
```

This will generate:

- `arc-workshop-staging-heartbeats` DynamoDB table
- `arc-workshop-production-heartbeats` DynamoDB table
- `src/scheduled/heartbeats` Lambda function code
- `staging` and `production` Lambda deployment targets

---
### 3. Be Chill for Five

Let's wait to see the Lambda execution logs.

---
### 4. Checkout the Logs

0. Navigate to the Lambda in the AWS Console &rarr; Lambda
1. Click on **Monitoring**
2. Click on **CloudWatch Logs**
3. Verify your Lambda is being invoked every five minutes!

---
### 5. Ping

Lets ping our domain!

```bash
cd src/scheduled/heartbeats
npm i tiny-json-http --save
```

Open up the function code:

```javascript
var arc = require('@architect/functions')
var tiny = require('tiny-json-http')

function heartbeat(event, callback) {
  tiny.get({
    url: 'https://brian.io'
  },
  function _get(err, res) {
    console.log(err, JSON.stringify(res, null, 2))
    callback(err, res)
  })
}

exports.handler = arc.scheduled(heartbeat)
```

And deploy

```bash
npm run deploy
```

And wait for five and lets see what happens.

---
### 5. Save Telemetry

Lets install our data layer.

```bash
touch src/shared/data.js
```

---
### 6. Scheduled Lambda

Edit `src/scheduled/index.js`

```javascript
var data = require('@architect/shared/data')
var arc = require('@archited/functions')

function handler(event, callback) {
  data.heartbeats.put({
    utcDate,
    utcTime,
    event,
  }, callback)
}

exports.handler = arc.scheduled(handler)
```

Deploy to `staging` with `npm run deploy`.
