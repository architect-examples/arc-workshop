Error handling is a major 🔑  to writing resilient applications. JSF Architect bakes support in for working with the inevidable `Error` over HTTP. Will will explore different error handling scenarios in this exercise.

---
### 1. Hope for the Best

Lets create a fresh route to play with `Error`. Open up your `.arc` file and add a `get /wtf` route.

```.arc
@app
arc-workshop

@domain
your-domain-here.com

@html
get /
get /page/:page
post /count
get /wtf
```

---
### 2. Direct Error

A `res` may be invoked with an instance of Error.

```
// ./src/html/get-wtf/index.js
var arc = require('@architect/functions')

function fail(req, res) {
  res(Error('internal "server" error: lol'))
}

exports.handler = arc.html.get(fail)
```

By default an `Error` returns with an HTTP status code `500`. If the Error passed to `res` contains a property of `code`, `status` or `statusCode` with a value of `403`, `404` or `500` the status code response is updated accordingly.

---
### 3. Custom Error Pages

The default error response template can be overridden by adding `error.js` that exports a single default function that accepts an `Error` and returns a non empty `String`.

```javascript
// src/html/get-wtf/error.js
module.exports = function error(err) {
return `
<!doctype html>
<html>
<body>
  <h1>${err.message}</h1>
  <pre>${err.stack}</pre>
</body>
</html>
`
}
```

Have a look at the error examples repo and demos at https://wut0.click

---
### Summary

There is always room to improve. Some discussion happening to bring custom error templates into `src/shared` for global error conditions but this work has not started yet.

---
