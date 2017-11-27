Messaging apps have taken the workspace by storm and Slack leads the way as a truly open development platform. The messaging space is relatively new and it can be super fun to hack on.

- [**Slack Web API**](https://api.slack.com/web) programatic access to do just about anything you can think of with Slack
- [**Events API**](https://api.slack.com/events-api) for listening to just about any event in real time from the perspective of a user, a bot user or across a team
- [**Actions and Options**](https://api.slack.com/interactive-messages) handle button clicks and dynamically populate drop down menus for _interactive messages_
- [**Slash Commands**](https://api.slack.com/slash-commands) the workhorse of any good Slack app is the slash command

---
### Slack Web API

The Slack Web API is extremely powerful and the design of its architecture fascinating in that it defies many commonly held 'best practices'.

- It is an RPC over HTTP API (it is not RESTful)
- Organized by namespaced system entities (E.g.`conversation` or `message`)
- It accepts _either_ `GET` or `POST` requests to invoke a method; subsequently, parameters can be either query string or form variables

If you use one of the amazing Slack client libraries you will not be exposed to any of these details but I think it still matters to understand this because while the above sounds contrarian to many practices advocated today it turns out clients authored against this style of API are incredibly small and easy to reason about.

Food for thought. 🍒

---
### Events API

The opening moments of the Slack platform was based on web sockets (aka the [RTM API](https://api.slack.com/rtm)) which works really well for full duplex (read and write) communications. Sockets however require keeping a connection to every client open. This can use a lot of memory. Worse, web sockets can disconnect for any number of reasons so retry logic is required. Anytime retry logic is involved you need bake in exponential backoffs. These complexities have been alleviated with the Events API which are simple webhooks. Whenever an event happens Slack hits a URL you configure with a JSON payload.

---
### Actions and Options

Once you start sending and receiving messages with Slack you will probably want to render a button or dropdown menu. Slack handles button clicks with an Actions URL and it allows you to dynamically populate dropdown menus with the Options URL. You can also spawn dialogs to group buttons and menus and they've announced that further form elements are on the way.

---
### Slash Commands

You can use the Events API to listen for specific `@mentions` of your bot to respond or you can create a special Slash Command handler. It too is a webhook URL and probably the fastest way to build an interaction with Slack.

---
### Installing with Add to Slack

Slack apps are installed with an oAuth flow using a button often called **Add to Slack**.

---
### Authenticating with Sign in with Slack

Slack users can be authenticated using **Sign in with Slack** oAuth flow.

---
### Testing Strategies

- Slack recently released a tool named Steno for testing locally.
- JSF Architect automatically creates both `staging` and `production` URLs making it trivial to create a bot user for each environment; its a bit of a pain because you need to manage two sets of Slack API secrets but it is vastly prefferable than 'doin it live' 🤠

---
### 1. Slack Setup

0. To build a Slack app we need to setup credentials and a Slack where you have authority to install an app. If you do not have a Slack where you can do that you'll need to crate one and login.
1. Once ready, navigate to [api.slack.com/apps](https://api.slack.com/apps) and click the big green button **Create New App**. (If you do not see that button you'll need to login in that browser.)
2. Enter an **App Name** of `Cuteface Staging` and choose the **Slack Development Workspace** where we'll be prototyping and click **Create App**

Repeat these steps and create a second app named `Cuteface`.


---
### 2. `.arc` Setup


Bot design is super fun. Lets create a new project for our new 🤖  friend:

```bash
mkdir arc-workshop-bot
mkdir arc-workshop-bot/test
cd arc-workshop-bot
npm init --yes
```

Add an initial dep:

```
npm i @architect/workflows --save
```

And some starter files:

```bash
touch index.js
touch test/env-test.js
touch .arc
```

---
### 3. Setup `npm run` Workflows

Edit `package.json` `scripts`:

```javascript
{
  "scripts": {
    "create": "AWS_PROFILE=personal AWS_REGION=us-east-1 arc-create",
    "test": "NODE_ENV=testing AWS_PROFILE=personal AWS_REGION=us-east-1 tape test/*-test.js | tap-spec",
    "start": "NODE_ENV=testing AWS_PROFILE=personal AWS_REGION=us-east-1 arc-repl"
  }
}
```

You know the drill!

---
### 4. Define `.arc`

JSF Architect bakes in first class Slack support.

```.arc
@app
arc-workshop

@slack
cuteface
```

And run `npm run create` to generate the endpoint URLs.

Things to notice:

- We re-used `arc-workshop` namespace yet again so everything will be scoped under those API Gateway deployments
- The `@slack` directive accepts any number of names separated by a newline so you can create more than one bot in the same project

---
### 5. Slack URL Setup

Return to the app page for `Cuteface Staging` on [api.slack.com/apps](https://api.slack.com/apps)

0. In the left nav click **Bot Users** (the second to last item…)
1. Click **Add a Bot User** and follow the instructions; you'll want to enable **Always Show My Bot as Online** also
2. Click on **Event Subscriptions** in the left nav (the third to last item…)
3. Click **Enable Events** and enter the events url for the staging bot (it should look something like this:  `https://xxx.execute-api.us-east-1.amazonaws.com/staging/cuteface/events`) …you'll know it worked when you see a green check and verified text
4. Click on **Slash Commands** in the left nav and then click **Create New Command**
5. Enter `/cute` for the command and enter the staging slash command URL (it should look something like this: `https://xxx.us-east-1.amazonaws.com/staging/cuteface/slash`
6. Click on **Interactive Components** in the left nav and then hit **Enable Interactive Components** and enter the URLs for actions and options (they look something like this: `https://xxx.execute-api.us-east-1.amazonaws.com/staging/cuteface/actions` and `https://xxx.execute-api.us-east-1.amazonaws.com/staging/cuteface/options`
7. Click on **OAuth and Permissions** in the left nav and click **Install App to Workspace**
8. Go to your Slack workspace and give `/cute` a try ---it should print 'hi' in response

I have good news and bad news. The good news is your `staging` bot is setup. The bad news is you need to repeat the steps above but with `production` URLs pointing at the official `Cuteface` bot app.

Rock on. 🎸🔥

---
