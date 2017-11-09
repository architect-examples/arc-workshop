---
## Preface: Mental Models

In physics we describe light in terms of particals and waves. Neither of these things are precisely true but both are useful *models* for thinking about how light works. A mental model is way of approaching thinking around a how a particular idea or topic works. It is a technique of self directed empathy to aide in understanding complex systems better and make better decisions for creating desirable outcomes in those systems.

If making better decisions and thinking about learning sounds interesting to you I highly reccomend reading these links!

- https://en.wikipedia.org/wiki/Mental_model
- https://www.farnamstreetblog.com/mental-models/

A choice quote:

> Mental models are so basic to understanding the world that people are hardly conscious of them.

---
## Primitives not Framworks

This is a fantastic mental model for the serverless renaissance introduced by Werner Vogals, CTO of Amazon.

---
## Primitives not Framworks

werner pic and quote here


## Primatives not Frameworks

Talk about what werner meant here.

---
## AWS Primitives

- Compute
- Blob storage
- Database persistence
- HTTP gateway
- Messaging

---
## Primatives

- Compute &rarr; runtime for all your business logic
- Blog storage &rarr; static assets, coldstorage of data, etc
- Database persistence &rarr; structured data
- HTTP gateway &rarr; talk to the world
- Messaging &rarr; background tasks

---
## Mental Model

| Primative  | Self Managed | Fully Managed
| ---------- | ------------ | ------
| Compute    | Heroku       | Lambda       | Transparent upgrading, Auto Scaling pay per use
| Blob Store | Filesystem   | S3           | Transparent upgrading, Auto Scaling pay per use
| Database   | Postgres     | DyanmoDB     | Configured auto scaling pay reads/writes provisinoed capacity
| HTTP       | Express      | API Gateway  | Completely transparent pay per use
| Messaging  | Redis        | SNS          | Pay per use

---
## Managed vs Unmanged

Transparent vs Opaque
Security
Performance
Scale

Do you really think you have the ability to commodatize these vectors faster than AWS?

---
## Primitives as a Service

A better PaaS?

| -------------------- | ---
| Compute              | Lambda
| Blob storage         | S3
| Database persistence | DynamoDB
| HTTP gateway         | API Gateway, CloudFront, Route53
| Messaging            | SNS

> PaaS in popular tech culture mean Platform as a Service; an idea that predicated Lambda

---
## Important!

AWS is much more serverless than just these services:

- Lambda
- S3
- DynamoDB
- API Gateway, CloudFront, Route53
- SNS

---
## Patterns are Mental Models

- Introduced in the new well worn GoF
- Most of these things go by a few names; sometimes differ between languages/runtimes and/or get built-in

Underlying principle: we can follow a pattern to solve a particular class of problem

---
## Patterns are Composed of Primatives

| ---------- | -------------------- | --------
| Model      | Database persistence | DynamoDB
| View       | S3                   | Blog storage
| Controller | API Gateway          | HTTP Gateway

---
## Old Patterns are New Again

Flyweight &rarr; Fan out
- http://freecontent.manning.com/patterns-for-solving-problems-in-serverless-architectures/ 

---
## Composition over Inheritance 

- ✅ Primatives are flexable and compose to powerful solutions
- ✅ Frameworks tradeoff flexability for deliberate constraint
- ✅ Frameworks themselves are composed of Primatives; oft by way Patterns

---
## Primatives &rarr; Patterns &rarr; App

Building an **App** is building a non generalized **Framework** for your **Product**

---
## Spoiler Alert *Ops: Still A Thing

- Devops is about shattering the barrier between dev and delivery
- Cloud tech brings delivery right to the doorstep of dev
- Devops is a loose collection of principles and ever-changing implementing practices

**The cloud does not negate princples; it's just a new player in our ever-changing implementing practices**
