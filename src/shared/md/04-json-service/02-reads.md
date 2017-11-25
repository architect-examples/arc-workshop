The JSF Architect sandbox database instance runs on PORT `5000`. If you start another sandbox it just connects to the original.

---
### 1. Setup

Open up your earlier project arc-workshop-data in a new terminal window and start the repl:

```bash
cd arc-workshop-data
npm start
```

Add a few rows to the database:

```javascript
// enter something like this and hit enter a few time
// also! make sure you change the postID and title or you just are overwriting the same row
data.posts.put({postID:'asdf', title:'hi'}, console.log)
```

Leave this terminal process running and return to `arc-workshop-api` repo you created and re-run the tests:

```
npm t
```

You should see the rows you entered in the repl on the other tab!

---
### 2. Read One

Lets wire up `get /api/posts/:postID` for reading one record.

```javascript
// src/json/get-api-posts-000postID/index.js
var arc = require('@architect/functions')
var data = require('@architect/shared/data')

function route(req, res) {
  data.posts.get({
    postID: req.params.postID
  }, 
  function _get(err, results) {
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

It's very clean. We will want to add parameter validation and authentication check but in a future iteration. First lets test this!

---
### 3. Testing

Sometimes people like to write tests first. 

```javascript
var test = require('tape')
var arc = require('@architect/workflows')
var request = require('request')

var req = request.defaults({jar:true})
var done 
var first 

test('start', t=> {
  t.plan(1)
  arc.sandbox.start(fin=> {
    t.ok(true, 'started')
    done = fin
  })
})

test('get /api/pasts', t=> {
  t.plan(1)
  req('http://localhost:3333/api/posts', function _get(err, res, body) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(true, 'body')
      console.log(body)
      first = JSON.parse(body).Items[0]
    }    
  })
})

test('get /api/posts/:postID', t=> {
  t.plan(1)
  var url = `http://localhost:3333/api/posts/${first.postID}`
  req(url, function _get(err, res, body) {
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
  done()
})
```

Things to notice:

- A new top level variable named `first` to stash the first post from the `get /api/posts` test
- The test for `get /api/posts/:postID` usses `first.postID` as a url parameter

---

Nice work. Lets look at writing data over HTTP next.

---
