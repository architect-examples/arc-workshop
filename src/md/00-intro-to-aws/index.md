---
## 0000 Intro to AWS

Amazon.com

- Founded 1994
- Internet retailer and electronics manufacter
- Book store? Grocery store? Everything Store
- The original Cloud Vendor

---
## 0000 Intro to AWS

Amazon Web Services

- Founded 2002 as a subsidiary of amazon.com
- Relaunched in 2006 with: S3, SQS and EC2

---
## 0000 Intro to AWS

- In 2015, Amazon.com reported AWS was profitable, with sales of $1.57 billion in the first quarter of the year 
- AWS is predicted to have $13 billion in revenue in 2017

> http://www.bbc.co.uk/news/business-32442268

---
## 0000 Intro to AWS

Gartner estimated in 2015 that AWS customers are deploying 10x more infrastructure on AWS than the combined adoption of the next 14 providers

> https://www.gartner.com/doc/reprints?id=1-2G2O5FC&ct=150519&st=sb

---
## 0000 Intro to AWS

If you really want to understand AWS you need to read this blog post from Werner Vogels. 

> http://www.allthingsdistributed.com/2016/03/10-lessons-from-10-years-of-aws.html

---
## 000 Intro to AWS

- AWS is the pioneer and leader of the infrastructure as a service market
- While it currently dominates the market it mostly created new players are emmerging

---
## 000 Intro to AWS

Worth evaluating and monitoring:

- Microsoft Azure
- Google Cloud Platform

---
## 0000 Intro to AWS

Cloud history! Compute has changed over time for various reasons:

Servers &rarr; Virtual Machines &rarr; Containers &rarr; _Functions_

---
## 0000 Intro to AWS

- Servers are hard to scale; you can only go so far vertically
- We solved that by making commodity servers and stacking them horizontally
- They commodified to the point that renting them became more cost effective
 
---
## 0000 Intro to AWS

- Eventually we rented virtual machines; small slices of the old physical pie
- Virtual machines are large, difficult to manage/update/backup/etc, they are slow to startup
- Containers share the benefits of VMs plus coldstart speed is in milliseconds

---
## 0000 Intro to AWS

Cloud has challenges! 

- stuff goes down &rarr; region and/or provider failover time in a DNS window
- stuff gets throttled &rarr; retrys and timeouts are par for the course
- stuff gets spiked &rarr; means you have to figure out load balancing big ass fleets of servers
- stuff gets shipped &rarr; means you have to have zero downtime deploys of those big ass fleets of servers

---
## 0000 Intro to AWS

AWS Lambda ships in 2014 the idea that the smallest unite of compute is a Function

---
## 0000 Intro to AWS

It is important to notice the _server_ metaphor is not longer the baseline infrastructure primative for compute in this model

~Servers~ &rarr; ~Virtual Machines~ &rarr; ~Containers~ &rarr; Functions

---
## 0000 Intro to AWS

- Makes dynamic backend compute deployment akin to static website deployment
- Functions offer perfect and total isolation
- Completely managed, and thus predictable, if modestly opaque, runtime

---
## 0000 Intro to AWS

- Deployments are in seconds, instantly available to theoretical infinate load
- Isolation means these are super antifragile systems; downtime is hard to achieve 
- Configuration can be very lightweight and more portable

---
## 0000 Intro to AWS

- Timeouts still happen but you can tune them to a 5 minute window
- Throttles still happen; only 1000 concurrent requests are allowed

---
## 0000 Intro to AWS

devops at a high level is about using principles to inform practices 

---
## 0000 Intro to AWS

Five Factors of the Twelve Factor App

- Use declarative formats for setup automation, to minimize time and cost for new developers joining the project;
- Have a clean contract with the underlying operating system, offering maximum portability between execution environments;
- Are suitable for deployment on modern cloud platforms, obviating the need for servers and systems administration;
- Minimize divergence between development and production, enabling continuous deployment for maximum agility;
- And can scale up without significant changes to tooling, architecture, or development practices.

> https://12factor.net

---
## 0000 Intro to AWS

One view of AWS Lambda is a commodification of the 12factor principles in the form of a purchasable service (practice).

---
## 0000 Intro to AWS

- automation is key (automate builds, tests, lints, deploys)
- continuous delivery vs continuous deployment 
- infrastructure as code
- primatives vs frameworks and the impending serverless renaissance 
- compute, storage/persistence (db and blob), http (and dns), events/ipc/messaging, scheduled
- security and understanding IAM


- a caveat! I think you should learn the AWS Console inside and out. its your IDE and you are only fucking yourself over by not mastering it no matter how much of a peice of shit you think it is
    - learning the console makes you a master of scripting AWS itself; it leads to deeper understanding of what the APIs so cryptically described in docs are actually capable of; if I didn't know how API Gateway works visually I most-fucking-definitely would not have been able to write arc abstraction for it; seriously have a look at those docs and tell me you have any clue wtf they're talking about. its an api for creating apis ffs. how *could* you document that?! visually thats how. and thats the genius of what the console does. it teaches you how to write aws code visually.





- lambda, s3, dynamodb, api gateway, route53, sns, cloudwatch events, cloudformation
- other things to know about: lambda step functions, lambda at edge, lambda greengrass, sqs, kinesis, athena 
- infra services: codestar, codecommit code pipeline, code build 
- summary: principles vs practices / primatives not frameworks  intro to aws
