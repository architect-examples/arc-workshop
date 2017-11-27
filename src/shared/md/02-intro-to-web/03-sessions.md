JSF Architect builds in session state **by default** without any setup. No configuration. No debates about the releative merits of ephemeral persistence schemes. Just works!

---
## 1. Add a Route

Open up your `.arc` file and add a new route `post /count`.

```.arc
@app
arc-workshop

@domain
your-domain-here.com

@html
get /
get /page/:page
post /count
```

And generate the local code and remote deployment targets by running:

```
npm run create
```

Things to note:

- JSF Architect currently only supports `GET` and `POST` routes; this choice was deliberate because browsers also only support `GET` and `POST`
- You can run and re-run `npm run create` because it only creates things if they do not exist and never clobbers

---
## 2. Display the Count

Open up the index file and lets add count variable and a form to increment it.

```javascript
// ./src/html/get-index/index.js
var arc = require('@architect/functions')
var layout = require('@architect/shared/layout')
var log = require('@architect/shared/log')

function index(req, res) {
  var body = `
    <h1>${req.session.count || 0}</h1>
    <form action=/count method=post>
      <button>1up</button>
    </form>
  `
  res({
    html: layout(body)
  })
}

exports.handler = arc.html.get(log, index)
```

Thing to notice:

- `req.session` contains the session data

## 3. Increment the Count

JSF Architect has a deliberate rule that any HTTP POST _must_ do an Location 302 redirect. This additional level of isolation enforces that every POST exclusively mutates data and only mutates data. This makes reasoning about your GET routes much easier which can be especially complex with "server"-side rendering.

Lets edit the count Lambda.

```javascript
// ./src/html/post-count/index.js
var arc = require('@architect/functions')

function counter(req, res) {
  var count = req.session.count || 0
  res({
    session: {count: count + 1},
    location: req._url('/')
  })
}

exports.handler = arc.html.post(counter)
```

> Hat tip to [Marco Rogers](https://twitter.com/polotek) for the reasoning that lead to 'POST only mutates rule'


## Summary

Session state is stored in DynamoDB and expires after a week of inactivity. If you want to disable sessions remove `SESSION_TABLE_NAME` environment variable from your Lambda function in the console.
