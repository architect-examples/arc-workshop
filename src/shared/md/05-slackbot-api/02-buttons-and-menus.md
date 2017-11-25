Buttons allow us to quickly compose simple interaction flows with Slack. It's much easier than trying to build generalized artifical intelligence for natural language processing to understand intent. At least for now.

---
### 1. Add Buttons

Open up `src/slack/cuteface-events/index.js` and modify the call to `slack.chat.postMessage` to read:

```javascript
slack.chat.postMessage({
  token: process.env.SLACK_TESTING_TOKEN, // note the env var for the token      
  channel: event.event.channel,  
  text: 'ohai!',
  attachments: [{
    text: 'Choose ur cutes',
    callback_id: 'cute-selection',
    color: "#3AA3E3",
    attachment_type: "default",
    actions: [{
      name: "game",
      text: "Doge",
      type: "button",
      value: "doge"
    },
    {
      name: "game",
      text: "Cat",
      type: "button",
      value: "cat"
    }]
  }]
}, callback)
```          

Nice. Test your work on `staging` by running `npm run deploy`. You'll know it worked if you see buttons! If you click a button you'll see text that reads `hi from button press`. 

---
### 2. Inspect the Payload

0. Navigate in the AWS Console to `arc-workshop-staging-slack-cuteface-actions` Lambda
1. Click on **Monitoring** and then **View logs in Cloudwatch**

You'll notice the logs are ugly! This is because someone (me) forgot to format the code. Open up `src/slack/cuteface-actions` and modify the code to read:

```javacript
// src/slack/cuteface-actions/index.js
exports.handler = function _action(event, context, callback) {
  console.log(JSON.stringify(event, null, 2))
  callback(null, {text:'hi from button press'})
}
```

Go back to Slack, mention the bot, click a button, and go back to Cloudwatch to see the JSON formated in slightly more readable way.

---
### 3. Respond Dynamically

It is fairly trivial to respond to the user initiated button press:

```javascript
// src/slack/cuteface-actions/index.js
exports.handler = function _action(event, context, callback) {
  console.log(JSON.stringify(event, null, 2))
  var choice = event.actions[0].value
  if (choice === 'cat') {
    callback(null, {text: 'purr'})
  }
  else {
    callback(null, {text: 'woof'})
  }
}
```

Feel free to get more creative here!

---
