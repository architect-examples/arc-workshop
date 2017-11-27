🆗 this is where things get really fun. We're ready to wire up our data access layer to a JSON API. Before we start writing data _through_ the cloud lets get things setup for local development.

---
### 1. Setup

URL design is super fun. Lets create a new project for our API layer:

```bash
mkdir arc-workshop-api
mkdir arc-workshop-api/test
cd arc-workshop-api
npm init --yes
```

Add some deps:

```
npm i @architect/data @architect/workflows run-parallel run-waterfall request tape tap-spec --save-dev
```

And some starter files:

```bash
touch index.js
touch test/env-test.js
touch .arc
```

---
### 2. Setup `npm run` Workflows

Edit `package.json` `scripts`:

```javascript
{
  "scripts": {
    "create": "AWS_PROFILE=personal AWS_REGION=us-east-1 arc-create",
    "test": "NODE_ENV=testing AWS_PROFILE=personal AWS_REGION=us-east-1 tape test/*-test.js | tap-spec",
  }
}
```

---
### 3. Define Routes and Tables in `.arc`

Edit the `.arc` file. Note we want the same `@app` so the tables are namespaced correctly. To make things quicker we'll just copy the tables from the last exercise. In a more formal architecture you'd probably keep them in seperate repos and manage the relationship as a dependency instead of copy pasta. 😽🍝

```.arc
@app
arc-workshop

@json
get /api/posts                 # read posts
get /api/posts/:postID         # read one post
post /api/posts                # create a post
post /api/posts/:postID        # update a post
post /api/posts/:postID/delete # delete a post
post /api/reactions            # add reaction

@tables
posts
  postID *String
  #slug
  #title
  #body
  #tags
  #ts

reactions
  postID *String
  emoji **String
  #count

@indexes
posts
  postID *String
```

Things to notice:

- `@json` defines `application/json` routes
- We scoped our routes under `/api` and did not nest entities
-

---
### 4. Create Routes

Create the routes execute:

```
npm run create
```

It'll skip the `@tables` since you already created them.

---
### 5. Test Sandbox

Lets write some tests against a local sandbox. Open up `test/env-test.js` and add the following env check test:

```javascript
var test = require('tape')
var arc = require('@architect/workflows')
var request = require('request')

var req = request.defaults({jar:true})
var end

test('start', t=> {
  t.plan(1)
  arc.sandbox.start(done=> {
    t.ok(true, 'started')
    end = done
  })
})

test('get /api/posts', t=> {
  t.plan(1)
  req('http://localhost:3333/api/posts', function _get(err, res, body) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(true, 'body')
      console.log(body)
    }    
  })
})

test('close', t=> {
  t.plan(1)
  t.ok(true, 'closed')
  end()
})
```

A few things are different this time.

Things to notice:

- We use `request` for its cookie `jar` so our session state is persisted through test runs
- `arc.sandbox.start` initializes both the local Dynalite database and the HTTP routes
- `arc.sandbox.start` callback function passes a `done` function which we assign to a variable called `end`
- we call `end()` in our final test to close the database connection and shut down the mock HTTP server

---
### 6. Wire a Data Access Layer

Lets create a fresh shared context for our data access layer since all our routes will be talking to the database in this repo.

```bash
mkdir src/shared
mkdir src/shared/data
touch src/shared/data/index.js
```

Init the shared deps.

```
cd src/shared/data
npm init --yes
npm i @architect/data --save
```

By default `@architect/data` looks for `.arc` in the current working directory but we can override this by passing a path directly in. JSF Architect copies `./.arc` into the shared root upon deployment and starting the sandbox so we can reference it there.

```javascript
// src/shared/data/index.js
var path = require('path')
var arc = require('@architect/data')

var arcPath = path.join(__dirname, '..', '.arc')
module.exports = arc(arcPath)
```

---
### 7. Wire the JSON Routes

Edit `get /api/posts` route:

```javascript
// src/json/get-api-posts/index.js
var arc = require('@architect/functions')
var data = require('@architect/shared/data')

function route(req, res) {
  data.posts.scan({}, function _scan(err, results) {
    if (err) {
      res(err)
    }
    else {
      res({
        json: results
      })
    }
  })
}

exports.handler = arc.json.get(route)
```

And re-run the test suite:

```bash
npm t
```

You should see a response value directly from Dynalite:

```javascript
{"Items":[],"Count":0,"ScannedCount":0}
```


Nice work. Lets wire up database reads next.

---
