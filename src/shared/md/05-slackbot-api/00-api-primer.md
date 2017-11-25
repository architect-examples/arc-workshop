Messaging apps have taken the workspace by storm and Slack leads the way as a truly open development platform. The messaging space is relatively new and it can be super fun to hack on.

- *Slack Web API* programatic access to do just about anything you can think of with Slack
- *Events API* for listening to just about any event in real time from the perspective of a user, a bot user or across a team
- *Actions and Options* handle button clicks and dynamically populate drop down menus
- *Slash Commands* the workhorse of any good Slack app is the slash command

---
### Slack Web API

The Slack Web API is extrememly powerful and the design of its architecture fascinating in that it defies many commonly held 'best practices'. It is an RPC over HTTP API. It is not RESTful. It organizes itself in namespaced system entities such as `conversation` or `message`. Entities have methods that accept parameters. It accepts `GET` or `POST` requests to invoke a method. Subsequently, parameters can be either query string or form variables. 

If you use one of the amazing Slack client libraries you will not be exposed to any of these details but I think it matters because while the above sounds contrarian to many practices advocated today it turns out clients authored against this style of API are incredible small and easy to reason about. Food for thought. 🍒

---
### Events API

The opening moments of the Slack platform was based on web sockets (the  RTM API) which works really well for full duplex (read and write) communications. Sockets however require keeping a connection to every client open. This can use a lot of memory. Worse, web sockets can disconnect for any number of reasons so retry logic is required. Anytime retry logic is involved you need bake in exponential backoffs. These complexities have been aleiviated with the Events API which are webhooks. Whenever an event happens Slack hits a URL you configure with a JSON payload. 

---
### Actions and Options

Once you start sending and receiving messages with Slack you will probably want to render a button or dropdown menu. Slack handles button clicks with an Actions URL and it allows you to dynamically populate dropdown menus with the Options URL. You can also spawn dialogs to group buttons and menus and they've announced that further form elements are on the way. 

> I'm personally holding out for an iFrame

---
### Slash Commands

You can use the Events API to listen for specific `@mentions` of your bot to respond or you can create a special Slash Command handler. It too is a webhook URL and probably the fastest way to build an interacton with Slack.

---
### Installing with Add to Slack

---
### Authenticating with Sign in with Slack

---
### Testing Strategies

- Slack recently released a tool named Steno for testing locally. 
- JSF Architect automatically creates both `staging` and `production` URLs so it is fairly easy 

---
### Setup

- get a slack setup
- create an app
- setup the urls

- setup your .arc file

