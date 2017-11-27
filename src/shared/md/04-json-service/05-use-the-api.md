Now that we have an API we can talk to it from the clientside. Typically you'd have clientside JavaScript intercept form posts and delegate to our JSON API appropriately. There are new ways to do this every day and, it seems to this author, we often opt into more complexity than necessary.

The best way to author clientside JavaScript isn't a question JSF Architect is designed to answer. That's your problem to solve. Some well regarded options include:

- Marko from eBay (also a member of the JSF!)
- Choo
- React
- VueJS
- Good old fashioned vanilla JS

---
### Vanilla `text/html`

Lets wire up the application to work without clientside JavaScript first. We need a way to save a post so lets modify our `.arc` file from the first repo we worked on.

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
get /login
get /protected
post /post
```

And run `npm run create` to generate the route.

---
### Write the Handler for `text/html` `POST`s

Lets create a handler identical to the JSON `POST /api/post` route handler. A little duplication is ok.

```javascript
// src/html/post-post/index.js
var arc = require('@architect/functions')
var data = require('@architect/shared/data')

function route(req, res) {
  data.posts.put(req.body, function _put(err, results) {
    if (err) {
      res(err)
    }
    else {
      res({
        location: req._url('/')
      })
    }
  })
}

exports.handler = arc.html.post(route)
```

Things to notice:

- A successful invocation will redirect to `/`
- The handler is registered with `arc.html.post` (instead of `arc.json.post`)

> Extra credit: augment with input sanitization and parameter validation

---
### Create a Form

Let's build a basic HTML form on the `get /protected` route for now.

```javascript
// src/html/get-protected/index.js
var arc = require('@architect/functions')
var protect = require('@architect/shared/protect')
var layout = require('@architect/shared/layout')

function route(req, res) {
  var render = layout.bind({}, req)
  var form = `
    <form action=/post method=POST>
      <input type=hidden name=csrf value=${req.csrf}>
      <labal for=title>Title:</label>
      <input type=text name=title><br>
      <labal for=body>body:</label>
      <textarea name=body></textarea>
      <button>Save</button>
    </form>
  `
  res({
    html: render(form)
  })
}

exports.handler = arc.html.get(protect, route)
```

Things to notice:

- We added Cross-Site Request Forgery (CSRF) token to the form in a hidden form field

---
### Add CSRF Validation

We need to ensure this is a legit HTTP request and not some evil hax0r. JSF Architect makes this pretty easy. We need to check the token with some code like this:

```javascript
// src/html/post-post/index.js
var arc = require('@architect/functions')
var data = require('@architect/shared/data')

function csrf(req, res, next) {
  if (req._verify(req.body.csrf)) {
    next()
  }
  else {
    res({
      location: req._url('/')
    })
  }
}

function route(req, res) {
  data.posts.put(req.body, function _put(err, results) {
    if (err) {
      res(err)
    }
    else {
      res({
        location: req._url('/')
      })
    }
  })
}

exports.handler = arc.html.post(csrf, route)
```
Things to notice:

- We created middleware named `csrf` to verify the token
- We used `req._verify` to verify the token 💅

Nice work! ⚔️

---
### List Posts

List the posts on `/`. Make em nice!

---
### Wire up Clientside JS

This is the easy part. Here's a starter function using vanilla clientside JS:

```html
<script>
document.forms[0].addEventListener('submit', function _submit(e) {
  e.preventDefault()
  // read form values here
  // validate and santize them
  // use AJAX (XMLHttpRequest or fetch) to POST them to /api/post-post as ContentType: application/json
})
</script>
```

---
