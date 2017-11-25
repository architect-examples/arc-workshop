<section>
  <p>
  &#x1f329; Architecture as Text
  </p>
</section>

<section>
  <p>
  <a href=https://twitter.com/brianleroux>@brianleroux</a>
  </p>
  <small>
    Cofounder/CTO <a href=https://twitter.com/begin>@begin</a>
  </small>
  <aside class=notes>
    TKTK who are you? past companies? past projects?
  </aside>
</section>

<section>
  <blockquote>The chief cause of problems is solutions. - Eric Sevareid</blockquote>
</section>

<section>
  <p>Physical servers
  <p class=fragment>Virtual machines
  <p class=fragment>Containers
  <p class=fragment><strong>Cloud functions</strong>
  <aside class=notes>
    - Physical servers break down so we moved to commodity hardware.
    - Virtual machines are slow so we removed state and load balanced them.
    - Containers are hard to coordinate so they became cloud functions.
  </aside>
</section>

<section><strong>Cloud functions</strong> are different: virtual machines and containers are a metaphor for a physical server</section>

<section>
  <p>We knew Cloud Functions would bring significant advantages in an incumbant market. 
  <aside class=notes>
  </aside>
</section>

<section>
  <blockquote>
    We can't solve problems by using the same kind of thinking we used when we created them. - Albert Einstein
  </blockquote>
</section>

<section>
  <p>You have to manually provision and setup your deployment pipeline with your own assumptions about environment isolation and reproducability.</p>
  <aside class=notes>
    <ul>
      <li>Configuration and infrastructure can drift, leaving systems in difficult to repeat/reproduce and thus scale
      <li>Hard to configure and thus automate
      <li>Which means getting consistent, repeatable and reproducable builds is tough to get right
    </ul>
  </aside>
</section>

<section>
  <img width=500px src=https://brianleroux.github.com/arc-preso/aws.png style=border:none;box-shadow:none;>
</section>

<section>
  Infrastructure as Code
</section>

<section>
  <ol>
    <li>Manifest checked into your revision control system so you can version your infra beside your code
    <li>Tooling for managing the manifest based infra (usually global CLI binary)
  </ol>
</section>

<section>
  <p>Terraform</p>
  <p>Serverless</p>
  <p>AWS SAM</p>
  <aside class=notes>
    None of these things existed when we started building begin.com; as they matured and the thing that would become .arc emmerged we still liked our approach
  </aside>
</section>

<section>Terraform HCL</section>

<section>Terraform HCL<pre><code class=hcl data-trim>resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"
  assume_role_policy = &lt;&lt;EOF
{
  "Version": "2012-10-17",
  "Statement": [{
      "Action": "sts:AssumeRole",
      "Principal": {
      "Service": "lambda.amazonaws.com"
    },
    "Effect": "Allow",
    "Sid": ""
  }]
}
EOF
}

resource "aws_lambda_function" "test_lambda" {
  filename         = "lambda_function_payload.zip"
  function_name    = "lambda_function_name"
  role             = "${aws_iam_role.iam_for_lambda.arn}"
  handler          = "exports.test"
  source_code_hash = "${base64sha256(file("lambda_function_payload.zip"))}"
  runtime          = "nodejs4.3"
  environment {
    variables = {
      foo = "bar"
    }
  }
}</code></pre><small>Provisions a Lambda function on AWS.</small></section>

<section>Serverless YAML</section>

<section>Serverless YAML<pre><code class=yaml># serverless.yml

service: users

provider:
  name: aws
  runtime: nodejs6.10
  stage: dev # Set the default stage used. Default is dev
  region: us-east-1 # Overwrite the default region used. Default is us-east-1
  profile: production # The default profile to use with this service
  memorySize: 512 # Overwrite the default memory size. Default is 1024
  deploymentBucket:
    name: com.serverless.${self:provider.region}.deploys # Overwrite the default deployment bucket
    serverSideEncryption: AES256 # when using server-side encryption
  versionFunctions: false # Optional function versioning
  stackTags: # Optional CF stack tags
   key: value
  stackPolicy: # Optional CF stack policy. The example below allows updates to all resources except deleting/replacing EC2 instances (use with caution!)
    - Effect: Allow
      Principal: "*"
      Action: "Update:*"
      Resource: "*"
    - Effect: Deny
      Principal: "*"
      Action:
        - Update:Replace
        - Update:Delete
      Condition:
        StringEquals:
          ResourceType:
            - AWS::EC2::Instance

functions:
  usersCreate: # A Function
    handler: users.create
    events: # The Events that trigger this Function
      - http: post users/create
  usersDelete: # A Function
    handler: users.delete
    events:  # The Events that trigger this Function
      - http: delete users/delete

# The "Resources" your "Functions" use.  Raw AWS CloudFormation goes in here.
resources:
  Resources:
    usersTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: usersTable
        AttributeDefinitions:
          - AttributeName: email
            AttributeType: S
        KeySchema:
          - AttributeName: email
            KeyType: HASH
        ProvisionedThroughput:
          ReadCapacityUnits: 1
          WriteCapacityUnits: 1</code></pre><small>Wires a couple of Lambdas and a DynamoDB Table</small></section>

<section>AWS SAM</section>

<section>AWS SAM<pre><code class=yaml data-trim>AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: Simple CRUD webservice. State is stored in a SimpleTable (DynamoDB) resource.
Resources:
GetFunction:
  Type: AWS::Serverless::Function
  Properties:
    Handler: index.get
    Runtime: nodejs4.3
    CodeUri: s3://<bucket>/api_backend.zip
    Policies: AmazonDynamoDBReadOnlyAccess
    Environment:
      Variables:
        TABLE_NAME: !Ref Table
    Events:
      GetResource:
        Type: Api
        Properties:
          Path: /resource/{resourceId}
          Method: get

PutFunction:
  Type: AWS::Serverless::Function
  Properties:
    Handler: index.put
    Runtime: nodejs4.3
    CodeUri: s3://<bucket>/api_backend.zip
    Policies: AmazonDynamoDBFullAccess
    Environment:
      Variables:
        TABLE_NAME: !Ref Table
    Events:
      PutResource:
        Type: Api
        Properties:
          Path: /resource/{resourceId}
          Method: put

DeleteFunction:
  Type: AWS::Serverless::Function
  Properties:
    Handler: index.delete
    Runtime: nodejs4.3
    CodeUri: s3://<bucket>/api_backend.zip
    Policies: AmazonDynamoDBFullAccess
    Environment:
      Variables:
        TABLE_NAME: !Ref Table
    Events:
      DeleteResource:
        Type: Api
        Properties:
          Path: /resource/{resourceId}
          Method: delete

Table:
  Type: AWS::Serverless::SimpleTable
</code></pre><small>Wires a couple of Lambdas and a DynamoDB Table</small></section>


<section>
  <ol>
    <li>Deep proprietary knowledge is required to configure and maintain common infrastructure primatives
    <li class=fragment>Painful manifest files; JSON and YAML are not ideal
		<li class=fragment>Tooling was designed for the last generation of metaphors
  </ol>
  <aside class=notes>
    <li>Tooling lags behind AWS releases
    <li>Setup requires expertise in AWS Primatives which might as well be AWS Frameworks
    <li>JSON: is difficult to read, has no comments, and unforgiving to edit
    <li>YAML isn't much better and especially worse with deeply nested statements
  </aside>
</section>

<section>
	We are committing AWS infra config arcana into our revision control systems
</section>

<section data-transition="slide-in fade-out">
  Infrastructure as Code
</section>

<section data-transition="fade-in zoom-out">
  <strike>Infrastructure as Code</strike>
</section>

<section data-transition="zoom-in slide-out">
  Architecture as Text
</section>

<section>
	<code>.arc</code> is a plaintext manifest file
	<aside class=notes>Designed to solve the specific problems above by treating infra as a build artifacts</aside>
</section>

<section><code>.arc</code><pre><code class=bash data-trim># this is an .arc file
@app
helloapp

@html
get /</code></pre>
</section>

<section>
	Things to understand about <code>.arc</code>
</section>

<section data-transition="slide-in fade-out">
	<small>
	<ol>
		<li>Comments start with <code>#</code></li>
		<li class=fragment data-transition="fade-in fade-out">Sections start with <code>@</code></li>
		<li class=fragment data-transition="fade-in fade-out"><b>Everything after a section becomes instructions for generating AWS infrastructure</b></li>
	</ol>
	</small>
</section>

<section data-transition="fade-in fade-out"><code>.arc</code> lives in the root of a Node project<pre><code class=bash data-trim># this is an .arc file
@app
helloapp

@html
get /</code></pre><small><code>.arc</code> file always lives beside <code>package.json</code></small>
</section>

<section data-transition="fade-in fade-out"><code>@app</code> defines a namespace<pre><code class=bash data-trim># this is an .arc file
@app
helloapp

@html
get /</code></pre><small><code>@app</code> namespace scopes all generated infrastructure within AWS.</small>
</section>

<section data-transition="fade-in fade-out"><code>@html</code> defines <code>text/html</code> routes<pre><code class=bash data-trim># this is an .arc file
@app
helloapp

@html
get /</code></pre><small>(Other HTTP handlers supported: <code>@css</code>, <code>@js</code> and <code>@json</code>)</small>
</section>


<section data-transition="fade-in fade-out">
<code>.arc</code> tooling is <em>local</em> to the project using <code>npm scripts</code>
</section>

<section data-transition="fade-in fade-out"><code>npm run create</code><pre><code class=bash data-trim>#   /
#   |-src
#   | '-html
#   |   '-get-index
#   |     |-index.js
#   |     '-package.json
#   |-.arc
#   '-package.json</code></pre><small>A Lambda function wired to API Gateway handles requests to <code>/</code>.</small>
</section>

<section data-transition="fade-in fade-out"><code>.arc</code> is expressive<pre><code class=bash data-trim># this is an .arc file
@app
helloapp

@html
get /
get /about
get /contact
post /contact

@json
get /api</code></pre>
</section>

<section><code>npm run create</code><pre><code class=bash data-trim>#   /
#   |-src
#   | |-html
#   | | |-get-index/
#   | | |-get-about/
#   | | |-get-contact/
#   | | '-post-contact/
#   | '-json
#   |   '-get-api/
#   |-.arc
#   '-package.json</code></pre><small>The file system layout mirrors the <code>.arc</code> file.</small>
</section>

<section>a complete <code>.arc</code> example<pre><code class=bash data-trim>@app
hello

@html
get /
post /likes

@json
get /likes

@events
hit-counter

@scheduled
daily-affirmation rate(1 day)

@tables
likes
  likeID *String
  update Lambda

@indexes
likes
  date *String</code></pre>
</section>

<section>Lets look at the generated cloud function code</section>

<section><code>src/html/get-index/index.js</code><pre><code class=javascript data-trim>var arc = require('@architect/prototype')

function index(req, res) {
  console.log(JSON.stringify(req, null, 2))
  res({
    html: '<blink>hello world</blink>'
  })
}

exports.handler = arc.html.get(index)
</code></pre>
</section>

<section><code>src/html/post-likes/index.js</code><pre><code class=javascript data-trim>var arc = require('@architect/prototype')

function likes(req, res) {
  // send an email or something here
  res({
    location: '/'
  })
}

exports.handler = arc.html.post(likes)
</code></pre>
</section>

<section><code>src/events/hit-counter/index.js</code><pre><code class=javascript data-trim>var arc = require('@architect/prototype')

function count(payload, callback) {
  // do a db thing here probs
  console.log(JSON.stringify(payload, null, 2))
  callback()
}

exports.handler = arc.events.subscribe(count)
</code></pre>
</section>

<section><code>src/scheduled/daily-affirmation/index.js</code><pre><code class=javascript data-trim>var arc = require('@architect/prototype')

function daily(payload, callback) {
  // idk, send an sms here maybe?
  console.log(JSON.stringify(payload, null, 2))
  callback()
}

exports.handler = arc.scheduled(daily)
</code></pre>
</section>

<section><code>src/tables/likes-update/index.js</code><pre><code class=javascript data-trim>var arc = require('@architect/prototype')

function like(record, callback) {
  // anything you want!
  console.log(JSON.stringify(payload, null, 2))
  callback()
}

exports.handler = arc.tables.update(like)
</code></pre>
</section>
<section>
	<code>.arc</code> has three facets
</section>

<section>
	<small>
	<ol>
    <li>Declaritively define architecture with a high level primitives in plain text in <code>.arc</code>
		<li class=fragment>Workflows to generate local code, configure, provision and deploy infrastructure
		<li class=fragment>Cloud function code itself
	</ol>
	</small>
</section>

<section>
	<small>Other stuff you should know</small>
</section>

<section>
	<small>
	<ul>
		<li class=fragment><code>npm start</code> runs code completely offline and in memory
		<li class=fragment><code>npm run deploy</code> ships to <code>staging</code>
		<li class=fragment><code>ARC_DEPLOY=production npm run deploy</code> promotes code to <code>production</code>
		<li class=fragment>Safely use the console tactically to access and admin deployed infra
		<li class=fragment>Format, parser and tooling are completely open to extension
	</ul>
	</small>
</section>

<section>
    Before <code>.arc</code><br>
  <small>
	<ol>
    <li>Super long dev/depoy cycles
		<li>Inconsistent infra leading to hard to trace bugs
		<li>Frustration, demotivation, unhappiness and a sense of doom
	</ol>
	</small>
</section>

<section>
    After <code>.arc</code><br>
  <small>
	<ol>
    <li>Dev cycles are immediate, deployments run in secondss
		<li>Infra is consistent, bugs are easy to trace (and isolated!)
		<li>Green builds and happy devs
	</ol>
	</small>
</section>

<section><a href=https://arc.codes>arc.codes</a></section>

