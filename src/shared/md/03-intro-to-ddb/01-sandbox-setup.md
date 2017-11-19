---
## 2.0 Scheduled Lambda

Go back to `arc-workshop` repo and edit `.arc`:

```.arc
@app
arc-workshop

@domain
your-domain-here.com

@html
get /

@scheduled
heartbeats rate(5 minutes)
```

And run `npm run create`.

---
## 2.0 Scheduled Lambda

Take a chill five

---
## 2.0 Scheduled Lambda

0. Navigate to the Lambda in the AWS Console &rarr; Lambda
1. Click on **Monitoring**
2. Click on **CloudWatch Logs**
3. Verify your Lambda is being invoked every five minutes!

---
## 2.0 Scheduled Lambda

Lets install the data layer.

```bash
cd src/scheduled/heartbeats
npm i @my-npm-username/arc-workshop-data --save
```

---
## 2.0 Scheduled Lambda

Edit `src/scheduled/index.js`

```javascript
var data = require('')
var arc = require('@archited/functions')

function handler(event, callback) {
  data.heartbeats.put({
    utcDate,
    utcTime,
  }, callback)
}

exports.handler = arc.scheduled(handler)
```

Deploy to `staging` with `npm run deploy`.
