We setup an infinitely scaling hello world with zero downtime deployment `staging` and `production` environments. Not bad. Lets make it a bit more interesting. A powerful feature of JSF Achitect is that everything is a function and every function is completely isolated. This feature comes with the tradeoff that often you need to share code between functions. 

The fastest and easiest way JSF Architect provides for sharing code is automatically mapping `./src/shared` to `@architect/shared` for all functions defined by a project `.arc` file. This works great but only put code that is genuinely shared across **all** your functions here otherwise your Lambdas will get too big. 

The second method is to use `npm` modules and install them in the functions on a case by case basis.  

---
## 1. Create a Shared Folder

Enter your terminal and run:

```
mkdir src/shared
```

---
### 2. Add `layout.js`

Create the following file:

```
touch src/shared/layout.js
```

And modify it to this simple layout:
 
```javascript
module.exports = function layout(body) {
  return `
<!doctype html>
<html>
<head>
  <link rel=stylesheet href=https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css>
  <link rel=stylesheet href=https://cdn.rawgit.com/brianleroux/5bd964013a6c567dcb01f4b997f6b10e/raw/decff8e49f2fef1befe6849b0919742b8e08c515/offscreen-menu.css>
</head>
<body>
  <ul class="navigation">
    <li class="nav-item"><a href="/">Home</a></li>
    <li class="nav-item"><a href="/page/about">About</a></li>
  </ul>

  <input type="checkbox" id="nav-trigger" class="nav-trigger" />
  <label for="nav-trigger"></label>

  <div class="site-wrap">${body}</div>
</body>
</html>
`
}
```

> Thx to [Austin Wulf for this great article making an offscreen menu](https://www.sitepoint.com/pure-css-off-screen-navigation-menu/)

---
### 3. Use the Layout

Now that you've created the layout you can use it in your function code:

```javascript 
// ./src/html/get-index/index.js
var arc = require('@architect/functions')
var layout = require('@architect/shared/layout')

function index(req, res) {
  res({
    html: layout('hi from the index')
  })
}

exports.handler = arc.html.get(index)
```

Before running the local test server or upon deployment JSF Architect will automatically copy everything in `./src/shared` to each functions `./node_modules/@architect/shared` to enable this functionality. 

Things to notice:

- Code is shared by _all_ functions defined in `.arc` so be careful about how much code you put in there
- Code in `src/shared` can have its own Node modules but you have to install and manage those deps in those sub folders with `npm` yourself and relative paths above `/src/shared` will not work once they get copied into the destination functions
- Code in `@architect/shared` will be clobbered very time you run `npm start` or `npm run deploy`

---
### 4. Fix Borken URLs

API Gateway creates really long freaky urls and appends the URL with `/staging` or `/production` respectively. This means a link to `/` without DNS setup would actually want to point at `/staging` (or `/production`). JSF Architect bundles a hidden helper function `req._url` for resolving urls. Once your DNS is propagated using this function isn't neccessary. 

You could imagine you'll want _some_ state in your layout for highlighting global navigation items in addition to setting the correct URLs. Lets modify our layout to do that.

```javascript
module.exports = function layout(req, body) {
  var nav = [
    {href:req._url('/'), title:'home', active: req.path === '/'},
    {href:req._url('/about'), title:'about', active: req.path != '/'},
  ]
  var item = i=> `<li class="nav-item${i.active? ' active': ''}"><a href=${i.href}>${i.title}</a></li>`
  var menu = nav.map(item)
  return `
<!doctype html>
<html>
<head>
  <link rel=stylesheet href=https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css>
  <link rel=stylesheet href=https://cdn.rawgit.com/brianleroux/5bd964013a6c567dcb01f4b997f6b10e/raw/decff8e49f2fef1befe6849b0919742b8e08c515/offscreen-menu.css>
</head>
<body>
  <ul class="navigation">${menu}</ul>
  <input type="checkbox" id="nav-trigger" class="nav-trigger" />
  <label for="nav-trigger"></label>
  <div class="site-wrap">${body}</div>
</body>
</html>
`}
```

Things to notice:

- The `layout` function now accepts two parameters: `req` and `body`
- `req.path` contains the currently executing URL
- `req._url` is a function that accepts a relative url (and will return it normalized for `staging` or `production`)

Now lets edit our index function.

```javascript
// ./src/html/get-index/index.js
var arc = require('@architect/functions')
var layout = require('@architect/shared/layout')

function index(req, res) {
  res({
    html: layout(req, 'hi from the index')
  })
}

exports.handler = arc.html.get(index)
```

Nice work!

### Summary

You created a shared layout and modified to accept a request and respond dynamically. You learned about:

- `src/shared` for sharing code across all the functions defined by `.arc`
- `req._url` is a hidden helper for fixing relative urls in your app

---
