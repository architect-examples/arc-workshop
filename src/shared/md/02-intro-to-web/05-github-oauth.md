For the final boss of our *Intro to Web* exercises we'll setup a login page with Github. 

---
### 1. Autoreloading

Before we get into the dirty details of oAuth lets setup auto-reloading of our app locally. Open up the terminal and run:

```
npm i nodemon --save
```
> Normally you'd save things in your directory to devDependencies but since only the modules in `src` get deployed you don't have to worry about that

And edit your `package.json` scripts&rarr;start to read like this:

```javascript
"scripts": {
  "start": "NODE_ENV=testing AWS_REGION=us-east-1 AWS_PROFILE=personal nodemon --watch src -e js,css --exec arc-sandbox",
}
``` 

Things to notice:

- `NODE_ENV` is used by JSF Architect extensively; we know we're running locally when `NODE_ENV` is `testing`
- The `nodemon` command is going to watch any file in `src` with an extension of `js` or `css` and reload if they chage

Cool! Now you can open up a tab, run `npm run start` and forget about starting/stopping.

---
### 2. Create an App on Github

1. Navigate to https://github.com/settings/developers
2. Click on 'New oAuth App' and fill in the form; use http://localhost:3333/login for the oAuth redirect
3. Make note of `Client ID` and `Client Secret`; we will use these to auth your app

---
### 3. Create the oAuth Redirect

Open up `.arc` and add `get /login` route.

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
```

And run `npm run create` to generate the route.

---
### 4. Environment Variables

Our login page needs to know the Github Client ID and the Client Secret. JSF Architect currently requires that you manually configure environment variables on each Lambda function that needs them manually in the AWS Console.

Login to the AWS Console and find the Lambdas you need to configure and add the following:

- `GITHUB_USERNAME` with a value of your Github useranme
- `GITHUB_CLIENT_ID` with the value you got from Github above
- `GITHUB_CLIENT_SECRET` ditto that ☝

Then open your terminal in the root of you project and run:

```bash
touch .arc-env
```

And edit it to read:

```.arc
# .arc-env
@testing
GITHUB_USERNAME yourusername
GITHUB_CLIENT_ID xxx
GITHUB_CLIENT_SECRET xxx
```

And then immediately add it to your `.gitignore` so you don't accidentally publish credentials!

```bash
echo .arc-env >> .gitignore
```

---
### 5. Create an oAuth Handler

Now we need to make our login ready to work with Github. We'll add a special dependency to the login route.

```bash
cd src/html/get-login
npm i arc-middleware-github-oauth --save
```

This adds a pre-baked middleware for handling Github oAuth flow. To use it edit the login file:

```javascript
// ./src/html/get-login
var arc = require('@architect/functions')
var auth = require('arc-middleware-github-oauth')

function login(req, res) {
  res({
    html: 'if you see this you are logged in!'
  })
}

exports.handler = arc.html.get(auth, login)
```

This middleware will just redirect us to the root url if we are not logged in. Now we need to add a login button!

---
### 6. Login Button

The whole oAuth flow is a little bit weird. You initiate an oAuth flow by performing an HTTP `GET` to a third party domain and if things look good that domain will redirect back also using `GET`. 

Login is def a global concern so lets add the following to our `src/shared` folder:

```javascript
// login.js
module.exports = function login() {
  var url = 'https://github.com/login/oauth/authorize'
  var scope = 'user:email'
  var clientID = process.env.GITHUB_CLIENT_ID
  return `<li class=nav-item><a href=${url}?scope=${scope}&client_id=${clientID}>login</a></li>`
}
```

And now we can include it in our layout:

```javascript
var login = require('./login')

module.exports = function layout(req, body) {
  var nav = [
    {href:req._url('/'), title:'home', active: req.path === '/'},
    {href:req._url('/about'), title:'about', active: req.path != '/'},
  ] 
  nav.push(login())
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

Clicking on the `login` link in your navigation should send you Github to authenticate and, if everything is setup right, when you redirect back `req.session` will be populated with your Github account credentials. 

---
### 7. Auth Middleware

Lets create some authentication middleware for a protected page.

```bash
touch src/shared/protect.js
```

And edit the file:

```javascript
// src/shared/protect.js
module.exports = function protect(req, res, next) {
  if (req.session.isLoggedIn) {
    next()
  }
  else {
    res({location:req._url('/')})  
  }
}
```

Lets add a protected page to our `.arc` file.

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
```

And generate it by running `npm run create`. Then open it up and edit the contents:

```javascript
var arc = require('@architect/functions')
var protect = require('@architect/shared/protect')

function route(req, res) {
  res({
    html: 'hey imma let u finish'
  })
}

exports.handler = arc.html.get(protect, route)
```

We can now try to directly navigate to `/protected` before logging in and after to see it working.


---
### 8. Logout

If we have a login we probably want a logout. And the good news is resetting the session is super simple. Lets add a logout route.

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
get /logout
```

And, once again, run `npm run create` to generate the code and deployment Lambdas. Once that completes edit the new logout page:

```javascript
// ./src/html/get-logout
var arc = require('@architect/functions')

function route(req, res) {
  res({
    session: {},
    location: req._url('/')
  })
}

exports.handler = arc.html.get(route)
```

Things to notice:

- `session` is a write only meaning _any_ writes to session within a response will overwrite the previous session values

---

# Intro to Web Summary

You've learned a great deal of information in roughly one hour. You've completely tamed API Gateway for `text/html`!

- isolated `staging` and `production` deployments
- work locally without any internet connection
- use shared code across your lambda functions
- create middleware for processing the request pipeline
- use sessions to add stateful interactions
- dealing with Error states
- oAuth flow using Github as the provider

### Next Steps

Next up we're looking at database persistence using DynamoDB
