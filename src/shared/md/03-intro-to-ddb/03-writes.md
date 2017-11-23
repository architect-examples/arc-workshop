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

```javascript
test('update', t=> {
  t.plan(1)
  waterfall([
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
    function read(callback) {
      data.posts.get({
        postID
      }, callback) 
    }
  ],
  function _put(err, result) {
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


