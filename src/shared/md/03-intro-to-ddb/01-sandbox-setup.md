Before we start writing data to the cloud lets get things setup for local development. 

---
### 1. Database CRUD

We'll use `@architect/data` to generate a DynamoDB client. Add the following to `index.js`:

```javascript
// index.js
const data = require('@architect/data')
module.exports = data()
```

This client automatically resolves table names at runtime so you don't have to. It is a very thin wrapper over the official [DyanamoDB DocumentClient](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html) methods that pre-binds `TableName`.

---
### 2. REPL 🔑

Test drive the declaritively generated data layer in a REPL by running `npm start`.

- Try typing in `data` and hitting enter
- Explore methods on `data`; try typing `data.posts.scan({} ,console.log)`

We'll revisit the repl again soon!

---
### 3. Test Sandbox

Lets write some tests against a local sandbox. Open up `test/env-test.js` amd add the following env check test:

```javascript
var data = require('../')
var test = require('tape')
var arc = require('@architect/workflows')

test('env', t=> {
  t.plan(1)
  t.ok(data, 'data is in scope')
  console.log(data)
})
```

> Your first test should check the thing you are testing is in scope

Check the test by running `npm t`.

Things to notice:

- The tests are fast! Working locally in memory is awesome
- The generated `data` client has both `posts` and `reactions` entities with `delete`, `get`, `put`, `query`, `scan` and `update` methods

### 4. Dynalite

Lets add a new test file `test/local-test.js`

```javascript
var data = require('../')
var test = require('tape')
var arc = require('@architect/workflows')
var db

test('arc.sandbox.db.start', t=> {
  t.plan(1)
  db = arc.sandbox.db.start(x=> {
    t.ok(true, 'in memory db started')
  })
})

test('list tables', t=> {
  t.plan(1)
  data._db.listTables({}, function listTables(err, result) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(result, 'got result')
      console.log(result)
    }
  })
})

test('arc.sandbox.db.close', t=> {
  t.plan(1)
  db.close()
  t.ok(true, 'db is safely shut down')
})
```

Things to notice:

- We declare `db` at the top of our file to pass through tests (the first and last)
- `data._db` gives us a reference to the official [DynamoDB](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html) client
- You will notice a sessions table in addition to the other tables you declared in `.arc`


---
### 5. Low Level Concerns

The generated DynamoDB client has three hidden helper functions:

- `data._name` is a helper function that accepts a table name and returns it normalized for the current runtime
- `data._db` we saw above, gives us access to a raw DynamoDB instance; this is the lowest level interface in `aws-sdk`
- `data._doc` is an instance of `DynamoDB.DocumentCLient`; slightly higher level client that is much easier on the eyes to use 

Lets review usage of each of these methods in turn.

### ℹ️ `data._name`

```javascript
var postsTableName = data._name('posts')
var reactionsTableName = data._name('reactions')

test('get name', t=> {
  t.plan(2)
  t.ok(postsTableName === 'arc-workshop-staging-posts', 'posts')
  t.ok(reactionsTableName === 'arc-workshop-staging-reactions', 'reactions')
})

```
### 💾 `data._db`

An instance of [`DynamoDB`](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html). Anything you want to do with Dynamo can be done with it but it often has more verbose and sometimes confusing syntax.

Commons methods:

- `listTables`
- `describeTable`

Here's an example test to explore using `data._db`:

```javascript
test('describe posts', t=> {
  t.plan(1)
  data._db.describeTable({
    TableName: postsTableName,
  }, 
  function _desc(err, result) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(result, 'got result')
      console.log(JSON.stringify(result,null,2))
    }
  })
})
```

Copy the test above and modify to try out `data._db.listTables` method.


### 📄 `data._doc`

An instance of [`DynamoDB.DocumentClient`](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html) which provides a cleaner interface for working with entities and collections.

---
### Extra Credit

- Lint checker
- Code Coverage
- Continuous Integration (JSF Architect uses Codeship fwiw)
- Greenkeeper
- Bithound
- Publish the data layer as a scoped module on npm

---
