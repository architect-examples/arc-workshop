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

Let's build an HTML form on the `get /protected` route for now.

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


---
### List Posts

---
### Wire up Clientside JS

This is the easy part.

```html
<script>
postForm.onSubmit.addEventListener('submit', function _submit(e) {
  e.preventDefault()
  console.log(postForm.values)
})
</script>
```
