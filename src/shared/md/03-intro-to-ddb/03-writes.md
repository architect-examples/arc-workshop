Reading data isn't going to be very interesting if we can't write it.

---
### Test Setup

Lets scaffold some tests.

```javascript
var data = require('../')
var waterfall = require('run-waterfall')
var parallel = require('run-parallel')
var test = require('tape')
var arc = require('@architect/workflows')

// instance passed to first and last test
var db

// mock data
var postID = 'fake-post-id'
var emoji = ':smile:'
var emoji2 = ':cat:'

test('arc.sandbox.db.start', t=> {
  t.plan(1)
  db = arc.sandbox.db.start(x=> {
    t.ok(true, 'in memory db started')
  })
})

/**
 *
 *  ^ ^ ^ your tests here again v v v
 *
 */

test('arc.sandbox.db.close', t=> {
  t.plan(1)
  db.close()
  t.ok(true, 'db is safely shut down')
})
```

Great! Now we are ready to write some data.

---
### Writing Rows with `put`

The primary method of writing data in DynamoDB is `put`. Herein we'll write three rows in parallel.

```javascript
test('put', t=> {
  t.plan(1)
  // create a dummy post and reactions
  var post = data.posts.put.bind({}, {postID, title:'hi', ts:'2017-11-11'})
  var reaction = data.reactions.put.bind({}, {postID, emoji, count:2})
  var reaction2 = data.reactions.put.bind({}, {postID, emoji:emoji2, count:1})
  // run the dummy data writes in parallel
  parallel([
    post,
    reaction,
    reaction2,
  ],
  function _put(err, result) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(result.length === 3, 'got result')
      console.log(result)
    }
  })
})
```

The `parallel` method accepts functions that themselves accept a Node style callback (sometimes called an 'errback').

Things to notice:

- We use `.bind` to construct functions that have parameters pre-bound
- We can use parallel to run those functions as fast as possible

---
### Updating a Row

Mutating data is a complex topic and accordingly DynamoDB `update` is probably the most complicated code in this workshop. To make writing our test a bit easier we use `waterfall` to avoid nesting and the so-called 'callback hell'.

```javascript
test('update', t=> {
  t.plan(1)
  waterfall([
    // update the row
    function update(callback) {
      data.posts.update({
        Key: {
          postID
        },
        UpdateExpression: 'set #title = :title',
        ConditionExpression: '#postID = :postID',
        ExpressionAttributeNames: {
          '#title': 'title',
          '#postID': 'postID',
        },
        ExpressionAttributeValues: {
          ':title': 'updated title nice 1',
          ':postID': postID,
        }
      }, callback)
    },
    // read it back
    function read(callback) {
      data.posts.get({
        postID
      }, callback)
    }
  ],
  // check the result
  function _done(err, result) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(result.title.indexOf('updated') > -1, 'got result')
      console.log(result)
    }
  })
})

```

It is also possible to write your own update by just overwriting a record in the database using `put`.

---
### Deletion

No CRUD app is complete without delete!

```javascript
test('delete', t=> {
  t.plan(1)
  waterfall([
    function wrrite(callback) {
      data.reactions.delete({
        postID,
        emoji,
      }, callback)
    },
    function read(ignored, callback) {
      data.reactions.scan({}, callback)
    }
  ],
  function done(err, result) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(result.Count === 1, 'got result')
      console.log(result)
    }
  })
})
```

---
