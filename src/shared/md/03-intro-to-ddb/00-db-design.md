---
## 00 Database CRUD

Create a new project for our data layer:

```bash
mkdir arc-workshop-data
cd arc-workshop-data
npm init --yes
npm i @architect/data --save
npm i @architect/workflows --save-dev
```

Add these files:

```bash
touch index.js
touch .arc
```

---
## 01 Database CRUD

Add `create` to `package.json` `scripts`:

```javascript
{
  "scripts": {
    "create": "AWS_PROFILE=personal AWS_REGION=us-west-1 arc-create",
    "start": "AWS_PROFILE=personal AWS_REGION=us-west-1 arc-repl"
  }
}
```

---
## 02 Database CRUD

Edit the `.arc` file. Note we want the same `@app` so the tables are namespaced correctly.

```.arc
@app
arc-workshop

@tables
heartbeats
  utcDate *String
  utcTime **String
```

And execute `npm run create` to ensure the tables are created.

---
## 03 Database CRUD

We'll use `@architect/data` to generate a DynamoDB client. Add the following to `index.js`:

```javascript
// index.js
const data = require('@architect/data')
module.exports = data()
```

---
## 04 Database CRUD

Test drive the REPL.

---
## 05 Database CRUD

Lets write some tests.

---
## 08 Database CRUD

Publish your module.

---
## 09 Database CRUD

Extra Credit

- Lint checker
- Code Coverage
- Continuous Integration
- Greenkeeper
- Bithound
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

wwhat we need here is a long peice of text what we need here is a long peice of textwhat we need here is a long peice of text what we need here is a long peice of textwhat we need here is a long peice of text what we need here is a long peice of textwhat we need here is a long peice of text what we need here is a long peice of textwhat we need here is a long peice of text what we need here is a long peice of textwhat we need here is a long peice of text what we need here is a long peice of textwhat we need here is a long peice of text what we need here is a long peice of textwhat we need here is a long peice of text what we need here is a long peice of textwhat we need here is a long peice of text what we need here is a long peice of textwhat we need here is a long peice of text what we need here is a long peice of textwhat we need here is a long peice of text what we need here is a long peice of textwhat we need here is a long peice of text what we need here is a long peice of textwhat we need here is a long peice of text what we need here is a long peice of textwhat we need here is a long peice of text what we need here is a long peice of textwhat we need here is a long peice of text what we need here is a long peice of textwhat we need here is a long peice of text what we need here is a long peice of textwhat we need here is a long peice of text what we need here is a long peice of textwhat we need here is a long peice of text what we need here is a long peice of textwhat we need here is a long peice of text what we need here is a long peice of textwhat we need here is a long peice of text what we need here is a long peice of textwhat we need here is a long peice of text what we need here is a long peice of textwhat we need here is a long peice of text what we need here is a long peice of textwhat we need here is a long peice of text what we need here is a long peice of texthat we need here is a long peice of text what we need here is a long peice of text
