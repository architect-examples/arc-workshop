To quickly recap we've configured a bot user to respond to slash commands and mentions with interacive messages. Lets get this thing ready for production by implmenting **Add to Slack**.

---
### 1. Create a Landing Page

Lets modify our bot app `.arc` file with a landing page for installing the bot and a DynamoDB table for storing oAuth access tokens. Comment out the `@slack` section so we do not have to wait for the create workflow to check then skip creation of those routes.

```.arc
@app
arc-workshop

# @slack
# cuteface

@html
get /add-to-slack

@tables
bots
  teamID *String
  botID **String
  #staging Boolean
```

Run `npm run create` and stand up and give yourself a stretch!

---
### 2. Secrets

Before we get too excited we have some more configuration work to do. In the root of this repo add `.arc-env`

```.arc
@testing
SLACK_CLIENT_ID "1111111111.11111111111"
SLACK_CLIENT_SECRET xxx 
```

You can find client id and secret in the Slack configuration page under **Basic Information** &rarr; **App Credentials**.

Immediately add `.arc-env` to your `.gitignore` to ensure you do not accidently share your secrets on Github. `.arc-env` will be read by the sandbox command in `npm start` which, is JavaScript, so we need to quote the `SLACK_CLIENT_ID` so it doesn't get rounded up. 

---
### 3. Deploy Secrets

0. Open up the AWS Console and find the `get /add-to-slack` Lambda
1. Add environment variables `SLACK_CLIENT_ID` and `SLACK_CLIENT_SECRET` as appropriate for `staging` and `production` routes

---
### 4. Setup oAuth Redirects

0. Open up the Slack configuration page and click on **OAuth and Permissions**
1. Under **Redirect URLs** enter URLs for testing, staging and production (testing is `http://localhost:3333/add-to-slack`)
3. Click **Save URLs**

---
### 5. Add to Slack

Now we're ready to render the button. Lets create a pure helper function for doing that:

```javascript
module.exports = function button(clientID, redirect, scopes) {
  return `
    <a href="https://slack.com/oauth/authorize?scope=${scopes}&client_id=${clientID}&redirect_uri=${redirect}">
      <img alt="Add to Slack" 
        height="40" 
        width="139" 
        src="https://platform.slack-edge.com/img/add_to_slack.png" 
        srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x">
    </a>
  `
}
```

And a second helper function for getting the appropriate redirect URL.


```javascript
module.exports = function getRedirect() {
  if (process.env.NODE_ENV === 'testing') {
    return 'http://localhost:3333/add-to-slack' 
  }
  else if (process.env.NODE_ENV === 'staging') {
    return 'MY PROD DOMAIN/staging/add-to-slack' 
  }
  else if (process.env.NODE_ENV === 'production') {
    return 'MY PROD DOMAIN/production/add-to-slack' 
  }
  else {
    throw Error('unknown process.env.NODE_ENV')
  }
}
```

You can probably write something prettier than this! Finally lets render this thing:

```javascript
var arc = require('@architect/functions')
var button = require('./_get-button')
var getRedirect = require('./_get-redirect')

function route(req, res) {
  var clientID = process.env.SLACK_CLIENT_ID.replace(/"/g, '')
  var redirect = getRedirect()
  var scopes = ['bot', 'commands', 'channels:history']
  res({
    html: button(clientID, redirect, scopes)
  })
}

exports.handler = arc.html.get(route)
```

Test locally by running `npm start`.

Things to notice:

- The two helper functions are pure (no side effects)
- The `clientID` variable needs to strip out any `"` symbols globally because `.arc-env` treats numbers like JavaScript numbers

---
### 6. Check for `req.query.code`

The idea behind oAuth is the client and Slack both share a secret. We can use that secret and the `code` Slack sends us to trade for an `access_token` which we can then use to save information to our database for future use. Lets scaffold that flow out using middleware:

```javascript
var arc = require('@architect/functions')
var button = require('./_get-button')
var getRedirect = require('./_get-redirect')

function oAuth(req, res, next) {
  if (req.query.code) {
    // get an access token 
    res({
      html: 'cool we got a code'
    })
  }
  else {
    // continue execution and render the button
    next() 
  }
}

function route(req, res) {
  var clientID = process.env.SLACK_CLIENT_ID.replace(/"/g, '')
  var redirect = getRedirect()
  var scopes = ['bot', 'commands', 'channels:history']
  res({
    html: button(clientID, redirect, scopes)
  })
}

exports.handler = arc.html.get(oAuth, route)
```

Test locally by running `npm start`.


---
### 6. Trade `req.query.code` for an `access_token`

In order to make the trade we need our Slack Web API client. And because oAuth is a multistep process we know we'll need to wrangle callbacks so lets add `run-waterfall` also. Open up your terminal:

```bash
cd src/html/get-add-to-slack
npm i slack run-waterfall --save
touch _oauth.js
```

We need a shared data layer again also.

```bash
mkdir src/shared
mkdir src/shared/data
touch src/shared/data/index.js
cd src/shared/data
npm init --yes
npm i @architect/data --save
```

Create the data layer:

```javascript
// src/shared/data/index.js
var data = require('@architect/data')
var path = require('path')
var arcPath = path.join(__dirname, '..', '.arc')
module.exports = data(arcPath)
```

And update our middlware to persist data:

```javascript
var waterfall = require('run-waterfall')
var slack = require('slack')
var getRedirect = require('./_get-redirect')

module.exports = function oAuth(req, res, next) {
  if (req.query.code) {
    waterfall([
      function _getToken(callback) {
        slack.oauth.access({
          code: req.query.code,
          client_id: process.env.SLACK_CLIENT_ID.replace(/"/g, ''),
          client_secret: process.env.SLACK_CLIENT_SECRET,
          redirect_uri: getRedirect()
        }, callback)
      },
      function _getInfo(result, callback) {
        // parse the results into a flat structure
        var teamID = result.teamID
        var botID = result.bot.bot_user_id
        var token = result.bot.bot_access_token
        var staging = process.env.NODE_ENV != 'production'
        // save to dynamo
        data.bots.put({
          teamID,
          botID,
          token,
          staging,
        }, callback)
      },
    ], 
    function _done(err, result) {
      if (err) {
        console.log(err)
        res(err)
      }
      else {
        res({
          html: 'successfully saved bot info!'
        }) 
      }
    })
  }
  else {
    // continue execution and render the button
    next() 
  }
}
```

That was hardcore! Final boss: augment `src/slack/cuteface-events` to lookup tokens instead of hardcoding `SLACK_TESTING_TOKEN`.

---
