---
## Amazon.com

- Founded 1994
- Internet retailer and electronics manufacter
- Book store? Grocery store? Everything Store
- The original Cloud Vendor

---
## Intro to AWS

Amazon Web Services

- Founded 2002 as a subsidiary of amazon.com
- Relaunched in 2006 with: S3, SQS and EC2

---
## Growth

- In 2015, Amazon.com reported AWS was profitable, with sales of $1.57 billion in the first quarter of the year 
- AWS is predicted to have $13 billion in revenue in 2017

> http://www.bbc.co.uk/news/business-32442268

---
## Marketplace Dominance

Gartner estimated in 2015 that AWS customers are deploying 10x more infrastructure on AWS than the combined adoption of the next 14 providers

> https://www.gartner.com/doc/reprints?id=1-2G2O5FC&ct=150519&st=sb

---
## Cloud Vendor Philosphy

If you really want to understand AWS you need to read this blog post from Werner Vogels. 

> http://www.allthingsdistributed.com/2016/03/10-lessons-from-10-years-of-aws.html

---
## AWS is the pioneer and leader of the Infrastructure as a Service 

While it currently dominates the market it mostly created new players are emmerging

---
## Evaluate and Monitor

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

Cloud has challenges! Stuff happens…

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

Pricing model: 1st million invocations are free and then its $0.10 per million invocations thereafter. That means 10 million invocations is under $1 a month.
