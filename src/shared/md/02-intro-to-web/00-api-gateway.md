For our first nine steps we will build a very simple website together. [JSF Architect](https://arc.codes) is designed for working incrementally so we will be adding up small tweaks and features as we go. Very quickly you will have built and deployed an infinitely scaling website with isolated staging and production environments hosted on a custom domain you own. 

---
### 0. Prerequisites

Before we get started make sure you have NodeJS installed and Amazon Web Services account credentials setup.

You can check for NodeJS by opening your terminal and running:

```
node -v
```

On *nix systems AWS Credentials are listed in:

```
~/.aws/credentials
```

Or on Windows systems:

```
C:\Users\USER_NAME\.aws\credentials
```

More detailed instructions can be found on [at the JSF Architect website](https://arc.codes/quickstart/setup).

---
## 1. Setup an `.arc` project

JSF Architect is setup as a very vanilla NodeJS project. In your terminal run the following commands:

```bash
mkdir arc-workshop
cd arc-workshop
touch .arc
npm init --yes
npm i @architect/workflows --save
```

---
## 2. Configure `package.json` for `npm run` scripts

Open `package.json` in your fav text editor edit `scripts` to look like this:

```javascript
{
  "scripts": {
    "create": "AWS_PROFILE=personal AWS_REGION=us-west-1 arc-create",
    "deploy": "AWS_PROFILE=personal AWS_REGION=us-west-1 arc-deploy",
    "start": "NODE_ENV=testing AWS_PROFILE=personal AWS_REGION=us-west-1 arc-sandbox",
    "dns": "AWS_PROFILE=personal AWS_REGION=us-west-1 arc-dns"
  }
}
```

We will go through using each of these local workflows soon. (You can probably guess roughly what each command does! ;)

---
## 3. Edit `.arc` 

Open the `.arc` file you just created up in your editor and save the following contents:

```.arc
@app
arc-workshop

@html
get /
get /page/:page
```

Things to notice:

- `@app` is your application namespace; all generated AWS infrastructure will be prefixed with this
- `@html` defines `text/html` routes with an express-like syntax

---
## 4. Generate Code and Infrastructure

To generate code locally and deploy it to isolated staging and production Lambdas all you need to do is run:

```
npm run create
```

JSF Architect will take a moment to run. It only creates things if they do not already exist and never destroys anything so its completely safe to run and re-run as you add new things (or if something goes wrong). Sometimes things do go wrong! The cloud can be unpredictable, things get rate limited or throttled and retrys not just common: they should be expected and planned for.

---
## 5. Deploy to `staging`

The `.arc` file above locally generates the following directory structure and corosponding source code.

```
/-src
| '-html
|   |-get-index/
|   '-get-page-000page/
|-.arc
'-package.json
```

Things to notice:

- The code on your filesystem mirrors the `.arc` file making it super easy to reason about and find things
- Parameters get encoded with a leading `000` to make them easy to spot
- Every route is one function
- Each function gets two totally isolated Lambda functions for deployment: one for `staging` and one for `production`

Open up `src/html/get-index` and you can see the signature is very similar to Express.

```javascript
var arc = require('@architect/functions')

function route(req, res) {
  console.log(JSON.stringify(req, null, 2))
  res({
    html: 'Edit this to say <b>something different</b>!'
  })
}

exports.handler = arc.html.get(route)
```

`console.log` statements automatically log to CloudWatch. The `res` function accepts named parameters. We're just sending back an `html` in a `String` value for now but it also supports being passed other keys, which we will see later: `location`, `status` and `session`.

Deploy the edited function to staging by running:

```
npm run deploy
```

That's it! Fast, eh? 🇨🇦

---
## 6. Deploy to `production`

Once we're satisfied with our work we can deploy to `production` by running:

```
ARC_DEPLOY=production npm run deploy
```

`ARC_DEPLOY` is an environment variable. It is also just a little bit trickier to type so you have to think about it! 😽


---
## 7. Work Locally

Sometimes you can't access the cloud. _Sometimes you don't want to._ Working local is fast and JSF Architect fully supports running your functions on your own machine without a web connection. To kick up a sandbox run:

```
npm start
```

Things to notice:

- The local sandbox uses the excellent [Dynalite](https://www.npmjs.com/package/dynalite) library which runs in-memory so any database state you have will be nuked between runs (this is a feature not a bug!)
- The sandbox does not currently support SNS events, scheduled functions with Cloudwatch Events or mocking out Slack (but all are possible and in scope for the roadmap: contributions appreciated!)

---
## 8. Buy a Domain

Open the AWS Console &rarr; Route 53 &rarr; [Domains](https://console.aws.amazon.com/route53/home?region=us-east-1#DomainListing:). Pick something totally awesome! [✨](https://✨.to)

---
## 9. Setup DNS

Edit `.arc` file with a `@domain` as below.

```.arc
@app
arc-workshop

@domain
your-domain-here.com

@html
get /
get /page/:page
```

Open your terminal again and run:

```
npm run dns
``` 

Follow the instructions on your screen. You will need to re-run this command as it progresses through steps. 

This command does a few thing on our behalf:

- Sets up certificates with AWS Certificate Manager
- Creates a DNS Recordset on Route 53
- Sets up `staging` and `production` domains in API Gateway
- Creates a corresponding Alias records in Route 53

Remember DNS can take time to propagate. (That's why we're doing this at the very beginning of the workshop!)

---
