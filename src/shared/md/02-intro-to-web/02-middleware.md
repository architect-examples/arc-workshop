In ancient times web servers often provided many functions across an application request lifecycle. Things like request validation, logging, authentication, payload compression and more. JSF Architect routes fully support the middleware pattern. In this exercise we'll create some logging middleware and inspect the results in AWS Cloudwatch.

---
### 1. Setup the Middleware

In your terminal lets create a new middleware file to be shared.

```
mkdir src/shared/middleware
touch src/shared/middleware/log.js
```

---
### 2. Create the Middleware

```javascript
// src/shared/middleware/log.js
module.exports = function log(req, res, next) {
  console.log(JSON.stringify(req, null, 2))
  next() // <-- important!
}
```

Things to notice:

- Middleware functions take three parameters: `req`, `res` and `next`
- Middleware functions signal execution is ready to continue by invoking `next()`
- Middleware functions can short circut execution and respond immediately by invoking `res`

---
### 3. Include the Middleware

From here we need to include the middleware in our functions that will use it.

```javascript
// ./src/html/get-index/index.js
var arc = require('@architect/functions')
var layout = require('@architect/shared/layout')
var log = require('@architect/shared/log')

function index(req, res) {
  res({
    html: layout(req, 'hi from the index')
  })
}

exports.handler = arc.html.get(log, index)
```

Things to notice:

- Middleware is added to `arc.html.get` as a parameter
- Middleware is order dependant 

---
### 4. Deploy and Inspect

Lets deploy the code by running `npm run deploy` and hit the url a few times. 

Now in your browser open up the AWS Console &rarr; Lambda &rarr; [your lambda function] &rarr; click on the Monitoring tab &rarr; View logs in CloudWatch

---
