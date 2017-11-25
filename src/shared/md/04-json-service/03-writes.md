Create a fresh testing file `src/test/writes-test.js`. 

---
### 1. Test `POST`

```javascript
var test = require('tape')
var arc = require('@architect/workflows')
var request = require('request')

var req = request.defaults({
  jar: true, 
  method: 'POST'
})

var postID = 'test-post-id'
var done 

test('start', t=> {
  t.plan(1)
  arc.sandbox.start(fin=> {
    t.ok(true, 'started')
    done = fin
  })
})

// create a post
test('post /api/posts', t=> {
  t.plan(1)
  req({
    url: 'http://localhost:3333/api/posts', 
    form: {
      postID,
      title: 'test post title'
    },
  },
  function _get(err, res, body) {
    if (err) {
      t.fail(err)
    }
    else if (res.statusCode != 200) {
      t.fail(res.statusCode)
      console.log(body)
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

- `request.defaults` set method to `POST`
- There is a mock variable named `postID` with a value `test-post-id` (which we will reuse for updating and deleting)

---
### 2. Perform the Write

Let's wire up our data access layer.

```javascript
var arc = require('@architect/functions')
var data = require('@architect/shared/data')

function route(req, res) {
  data.posts.put(req.body, function _scan(err, results) {
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

exports.handler = arc.json.post(route)
```

And re-run the tests to make sure the data is being correctly writ.

---
### 3. Updating

Lets add a test for updating the post re-using that `postID` variable for constructing the URL.

```javascript
// update a post
test('post /api/posts/:postID', t=> {
  t.plan(1)
  req({
    url: 'http://localhost:3333/api/posts/' + postID, 
    form: {
      postID: 'test-post-id',
      title: 'updated post title'
    },
  },
  function _get(err, res, body) {
    if (err) {
      t.fail(err)
    }
    else if (res.statusCode != 200) {
      t.fail(res.statusCode)
      console.log(body)
    }
    else {
      t.ok(true, 'body')
      console.log(body)
    }    
  })
})
```

---
### 3. An Agressive Update

The DyanmoDB update method is a bit complex to compose. We can cheat a little by just overwriting the record with the `postID`.  This method is identical to our create method and will blindly overwrite the original row. A more robust solution would check parameters and only update the ones that changed with `update`.

```javascript
var arc = require('@architect/functions')
var data = require('@architect/shared/data')

function route(req, res) {
  data.posts.put(req.body, function _scan(err, results) {
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

exports.handler = arc.json.post(route)
```

We can run the tests and see the updated value. For completeness check the updated value in your test.

---
### 4. Deleting 

The test for deletion is a straightforward `POST` to the deletion URL. 

```javascript
// delete a post
test('post /api/posts/:postID/delete', t=> {
  t.plan(1)
  req({
    url: 'http://localhost:3333/api/posts/' + postID + '/delete', 
  },
  function _post(err, res, body) {
    if (err) {
      t.fail(err)
    }
    else if (res.statusCode != 200) {
      t.fail(res.statusCode)
      console.log(body)
    }
    else {
      t.ok(true, 'body')
      console.log(body)
    }    
  })
})
```

### 5. Delete Implementation

Once again we reuse the shared data layer. This time to perform the delete operation.

```javascript
var arc = require('@architect/functions')
var data = require('@architect/shared/data')

function route(req, res) {
  data.posts.delete({postID: req.params.postID}, function _scan(err, results) {
    if (err) {
      res(err)
    }
    else {
      var deleted = true
      res({
        json: {deleted}
      })
    }
  })
}

exports.handler = arc.json.post(route)
```
Things to notice:
- Upon a successful delete we return `true` in the JSON payload to make testing a bit more straightforward
- We nab the `postID` from `req.params`

---
