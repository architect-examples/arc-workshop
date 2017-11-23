Databases offer different sorts of guarentees around persistence but ultimately they really are about two primary concerns: read and writing data. In this section we explore reading data.

---
### 1. Test Skeleton

```javascript
// test/reads-test.js
var data = require('../')
var parallel = require('run-parallel')
var test = require('tape')
var arc = require('@architect/workflows')

// db gets shared between the first and last test
var db

// create some mock data to work with the in memory db
var postID = 'fake-post-id'
var emoji = ':smile:'
var emoji2 = ':cat:'

// start the test db server
test('arc.sandbox.db.start', t=> {
  t.plan(1)
  db = arc.sandbox.db.start(x=> {
    t.ok(true, 'in memory db started')
  })
})

/**
 * 
 *   ✿ ✿ ✿   your tests go here   ✿ ✿ ✿ 
 *
 */ 

// shut down the test db server
test('arc.sandbox.db.close', t=> {
  t.plan(1)
  db.close()
  t.ok(true, 'db is safely shut down')
})

```

Things to notice:

- `db` is instantiated by the first test
- `db.close` is called by the last test
- We probably want to write our tests in between those two tests


---
### 2. Populate Mock Data

Before we read any data we need to write a little bit. You can blindly copy/past this method to create a mock post with two reactions.


```javascript
test('populate mock data', t=> {
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

---
### 3. Get a Row

 If you happen to know the id of the entity you are looking for then `get` is the fastest method you can use to retrieve it. 

```javascript
test('data.posts.get', t=> {
  t.plan(1)
  data.posts.get({
    postID,
  }, 
  function _get(err, result) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(result, 'got result')
      console.log(result)
    }
  })
})
```

---
### 4. Query a Table for a Collection of Rows

```javascript
/**
 * if you want to get a collection of things you ideally want to use query
 * for example: all the reactions for a post
 */
test('data.reactions.query', t=> {
  t.plan(1)
  data.reactions.query({
    KeyConditionExpression: 'postID = :postID',
    ExpressionAttributeValues: {
      ':postID': postID,
    }
  }, 
  function _get(err, result) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(result, 'got result')
      console.log(result)
    }
  })
})
```

---
### 5. Query a Table _Index_ for a Collection of Rows

```javascript

/**
 * or perhaps all the posts in 2017
test('data.reactions.query with index', t=> {
  t.plan(1)
  data.posts.query({
    KeyConditionExpression: 'begins_with(#ts, :ts)',
    ExpressionAttributeNames: {
      '#ts': 'ts'
    },
    ExpressionAttributeValues: {
      ':ts': '2017',
    }
  }, 
  function _get(err, result) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(result, 'got result')
      console.log(result)
    }
  })
})
*/

```

---
### batchGet

```javascript
/**
 * batchGet
 */
test('data.reactions.batchGet', t=> {
  t.plan(1)
  data._doc.batchGet({
    RequestItems: {
      'arc-workshop-staging-posts': {
         Keys: [{postID}]
      },
      'arc-workshop-staging-reactions': {
         Keys: [{postID, emoji}]
      }
    }
  }, 
  function _batchGet(err, result) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(result, 'got result')
      console.log(result)
    }
  })
})
```

---
### Scan

The `scan` method is a last resort and ideally only used for scripts and/or migraitons. You shouldn't need it for application logic and if you do its a sign you should consider denormalizing, add indexes or (most drastic) change the key schema to support direct queries. Scan literally scans your database a row at a time so it is totally inefficient and thusly slow.

```javascript
test('data.reactions.scan', t=> {
  t.plan(1)
  data.reactions.scan({}, function _scan(err, result) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(result, 'got result')
      console.log(result)
    }
  })
})
```

