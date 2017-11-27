In this section of the exercise we'll make `/cute` do something cuter than saying 'hi'. Then we'll wire the bot user to respond to `@mentions`.

---
### Slash Cute

Open up `src/slack/cuteface-slash/index.js` and you'll see a very vanilla Lambda function.

```javascript
exports.handler = function _event(event, context, callback) {
  console.log('recieved event')
  console.log(JSON.stringify(event, null, 2))
  callback(null, {text:'hi'})
}
```

Let's edit this file to return something slightly more interesting.

```javascript
exports.handler = function _event(event, context, callback) {
  console.log(JSON.stringify(event, null, 2))
  callback(null, {
    text: 'Hi here is some cute for u!',
    attachments: [{
      title: 'zome cuuute',
      image_url: 'http://thecatapi.com/api/images/get?format=src&type=gif'
    }]
  })
}
```

Deploy your changes using `npm run deploy` and check out the results with `Cuteface Staging`. Once satisfied this functionality meets your requirements upgrade the `production` bot app by running `ARC_DEPLOY=production npm run deploy`.

Things to notice:

- This is a default vanilla Lambda function signature with `event`, `context` and `callback` params
- We respond with a typical callback invocation by sending `null` in the first parameter (meaning there was no `Error`) and a vanilla Slack message format response
- You can read more about [Slack message attachment responses here](https://api.slack.com/docs/message-attachments)


---
### Listen for Mentions

Slash commands are great because they are private by default and work anywhere. Using the Slack Events API we can build more sophisticated conversational user experiences but we have to set the stage first.

0. Return to the app page for `Cuteface Staging` on [api.slack.com/apps](https://api.slack.com/apps)
1. Click on **Event Subscriptions**, ensure they are enabled, and the URL points to something like `https://xxx.execute-api.us-east-1.amazonaws.com/staging/cuteface/events`
2. Under **Subscribe to Bot Events** add **message.channels** event and hit **Save Changes**
3. Click on **OAuth and Permissions** again and under **Scopes* add `channels:history` and hit **Save Changes** (it will ask you to reinstall the app to your workspace; do that!)

Once all this is done you'll need to repeat the steps above for `Cuteface` bot app that represents our `production` runtime environment.

---
### Invite the Bot

By default bot users do not get any events until they are invited into a channel so lets create a testing channel so we do not annoy anyone and use `/invite @cuteface_staging` to that. After you invite the bot post a couple of messages to create some testing event data.

0. Open up the AWS Console and navigate to the event handler Lambda named `arc-workshop-staging-slack-cuteface-events`
1. Click on **Monitoring** and then **View logs in CloudWatch**
2. Click the **Text** radio button to make things readable; you should see events from `console.log`
3. Go back to your Slack client and post the following in the channel you invited the bot to: `mention @cuteface_staging`
4. Go back to Cloudwatch and have a look at the event data for a mention

The payload for a mention looks something like this:

```javascript
{
  "token": "QZrWWM2djb8XxVyigM36ORpk",
  "team_id": "T7V0DLJQL",
  "api_app_id": "A85E8CWG5",
  "event": {
    "type": "message",
    "user": "U7V0ESEDA",
    "text": "mention <@U84LB1LQG>",
    "ts": "1511582476.000065",
    "channel": "C7UUB2V6E",
    "event_ts": "1511582476.000065"
  },
  "type": "event_callback",
  "event_id": "Ev84QKGNGH",
  "event_time": 1511582476,
  "authed_users": [
    "U84LB1LQG"
  ]
 }
```

We need to parse out the user id and see if it is us. Yes this is a bit quirky.

```javascript
// src/slack/cuteface-events/index.js
exports.handler = function _event(event, context, callback) {
  console.log(JSON.stringify(event, null, 2))
  var isChallenging = event.type === "url_verification" && event.hasOwnProperty('challenge')
  if (isChallenging) {
    callback(null, {challenge: event.challenge})
  }
  else {
    var exp = /<@(U\w+)>/g
    var hasMentions = exp.test(event.event.text)
    if (hasMentions) {
      console.log('mentions', event.event.text.match(exp))
    }
    else {
      console.log('no mention')
    }
    callback()
  }
}
```

Deploy with `npm run deploy` and test your handy work by sending some mention messages and inspecting the `console.log` values in **Cloudwatch**.

Things to notice:

- This handler is also a vanilla Lambda function; we end execution by calling `callback()`
- AWS Lambda sends us an `event` and, nested within, is the Slack `event.event` (this is  fine ;)
- We use a basic `RegExp` to parse out if there is any mentions and then use it `console.log` any matches

---
### Lookup the Slack User

We have an array of Slack user ids but we do not know who is who yet. JSF Architect pre-installs [slack](https://www.npmjs.com/package/slack) so we can use the Web API to figure out if any of these user ids represent our bot user.  

To make API calls we need a token.

0. Slack helpfully issues us a testing token under **OAuth and Permssions** copy **Bot User OAuth Access Token**
1. Open up the AWS Console and navigate to `arc-workshop-staging-slack-cuteface-events` and copy that token value into a new **Environment Variable** named `SLACK_TESTING_TOKEN`

Since we potentially have more than one user mentioned we'll need to batch a few requests to Slack in parallel. Open up your terminal:

```bash
cd src/slack/cuteface-events
npm i run-parallel --save
```

And modify your handler code:

```javascript
var slack = require('slack')
var parallel = require('run-parallel')

exports.handler = function _event(event, context, callback) {
  console.log(JSON.stringify(event, null, 2))
  var isChallenging = event.type === "url_verification" && event.hasOwnProperty('challenge')
  if (isChallenging) {
    callback(null, {challenge: event.challenge})
  }
  else {
    var exp = /<@(U\w+)>/g
    var hasMentions = exp.test(event.event.text)
    if (hasMentions) {
      var mentions = event.event.text.match(exp)
      // loop thru mentions constructing lookup functions
      var fns = mentions.map(userID=> {
        return function _getUser(callback) {
          // strips off the Slack formatting to get the user parameter
          var user = userID.replace(/<@|>/g, '')
          slack.users.info({
            token: process.env.SLACK_TESTING_TOKEN, // note the env var for the token        
            user
          }, callback)
        }
      })
      parallel(fns, function _done(err, results) {
        if (err) throw err
        console.log('users found', JSON.stringify(results, null, 2))
        callback()
      })
    }
    else {
      console.log('no mention so lets bail execution')
      callback()
    }
  }
}
```

Deploy with `npm run deploy` and test your handy work by sending some mention messages and inspecting the `console.log` values in **Cloudwatch**.

Things to notice:

- We only have 3 seconds to respond to Slack before it retries so we move as fast as possible by checking the mentions in parallel
- The env variable we created `SLACK_TESTING_TOKEN` will only work for our workspace installation so we still need to do some work to save and look up tokens; we'll do that later by implementing **Add to Slack**

---
### Bot Identificaiton Algorythm

Identifying our bot user from a regular user is up to you! Inside the `_done` callback we loop through `results` looking for `user.name === 'cuteface_staging` or, if `process.env.NODE_ENV === 'production` just `user.name === 'cuteface'`. This won't be suitable for a production deployed bot app because names can, and do, change in Slack. Once we get to **Add to Slack** we can compare `user.id` to a value saved in Dynamo to be absolutely sure this is the bot we're looking for. 😅

```javascript
var slack = require('slack')
var parallel = require('run-parallel')

exports.handler = function _event(event, context, callback) {
  console.log(JSON.stringify(event, null, 2))
  var isChallenging = event.type === "url_verification" && event.hasOwnProperty('challenge')
  if (isChallenging) {
    callback(null, {challenge: event.challenge})
  }
  else {
    var exp = /<@(U\w+)>/g
    var hasMentions = exp.test(event.event.text)
    if (hasMentions) {
      var mentions = event.event.text.match(exp)
      // loop thru mentions constructing lookup functions
      var fns = mentions.map(userID=> {
        return function _getUser(callback) {
          // strips off the Slack formatting to get the user parameter
          var user = userID.replace(/<@|>/g, '')
          slack.users.info({
            token: process.env.SLACK_TESTING_TOKEN, // note the env var for the token      
            user
          }, callback)
        }
      })
      parallel(fns, function _done(err, results) {
        if (err) throw err
        var botname = process.env.NODE_ENV === 'staging'? 'cuteface_staging' : 'cuteface'
        var found = results.find(u=> u.user.name === botname)
        if (found) {
          slack.chat.postMessage({
            token: process.env.SLACK_TESTING_TOKEN, // note the env var for the token      
            channel: event.event.channel,  
            text: 'ohai!'
          }, callback)
        }
        else {
          callback()
        }
      })
    }
    else {
      console.log('no mention so lets bail execution')
      callback()
    }
  }
}
```

This is indeed a modestly intense amount of code to listen for and respond to mentions. Slack iterates at a furious pace and it is likely this will get much easier in the future.

---
