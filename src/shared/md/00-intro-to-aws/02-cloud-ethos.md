---
## Cloud Ethos

- focus on delivering business value not infrastructure maintenance
- using guiding principles to inform dev practices 

---
## *Ops

- Ops is not about a particular tool or even skillset
- *ops is the unifiation of the operations, reliability, and qa teams with engineering
- Devops taught us ops should *not* be a siloed team 
- Like performance and security, ops is not a line item you can just schedule

---
## *Ops

0. Security
1. Performance budgets and capacity planning
2. Systems monitoring
3. Issue triage and recovery

---
# Security

A land of acronyms. 

| Role based security   | IAM (Identity Access Management) is required
| Certificate Authority | ACM (AWS Certificate Manager) is your friend
| Key management        | KMS (Key Management Service) is super awesome

---
## Security!

This is everyone's ethical responsibility to respect the security and privacy of our customers, our colleagues and ourselves.

---
## Performance

You can't be "fast" without a thing to measure against a baseline

---
## Performance

- Business case: faster software makes for faster conversations
- Ethics case: emmerging markets and slow internet connections are the norm
- Magic case: super responsive software feels like it 'just works' and delights

---
# Monitoring

Monitoring **is not** logging; it is the practice of keeping an eye on your production system in real time

---
# Issue Triage and Recovery

- Systems debugging is a special sort of sleuthing; it is often spelunking logs while trying to reproduce in a staging environment
- This is often live debuggers; inspecting core dumps and actual logging

---
## *Ops: Doesn't go away with Cloud!

0. Security
1. Performance budgets and capacity planning
2. Systems monitoring
3. Issue triage and recovery

---
## Tools of the *Ops-y Cloud Craft

- scheduled functions are a very ops-y thing achieved with cloudwatch events
- cloudwatch logs for bug triage and monitoring
- xray for detailed service metrics
- cloudformation 'infrastructure as code'

---
## Principles vs Practices

- *Ops follow truly modest principles
- Principles have a longer lifetime than practices
- Principles are lightweight Mental Models!

---
## Principles vs Practices

- Revision Control &rarr; CVS &rarr; SVN &rarr; Git
- Testing &rarr; JUnit &rarr; Qunit &rarr; Tape
- Automation &rarr; Make &rarr; Ant &rarr; Grunt &rarr; npm scripts

---
## Principles vs Practices

- Principles *can* change
- When a **Principle** changes it is an **innovation**
- When this happens analyists call that event a **disruption**

> Disruption events predicate large investments. Examples: Mobile, Cloud, Containers, Big Data…

---
## Cloud Craft Principles

- automation is key (automate builds, tests, lints, deploys)
- continuous delivery vs continuous deployment 
- infrastructure as code

---
## Five Factors of the Twelve Factor App

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
## A Wild Caveat Appears

A caveat! I think you should learn the AWS Console inside and out. its your IDE and you are only fucking yourself over by not mastering it no matter how much of a peice of shit you think it is

- learning the console makes you a master of scripting AWS itself; it leads to deeper understanding of what the APIs so cryptically described in docs are actually capable of; if I didn't know how API Gateway works visually I most-fucking-definitely would not have been able to write arc abstraction for it; 
- seriously have a look at those docs and tell me you have any clue wtf they're talking about. its an api for creating apis ffs. how *could* you document that?! visually thats how. and thats the genius of what the console does. it teaches you how to write aws code visually.

---
## *Ops Responsibilities Recap

0. Security
1. Performance budgets and capacity planning
2. Systems monitoring
3. Issue triage and recovery

---
## Cloud Craft Principles Recap

- automation is key (automate builds, tests, lints, deploys)
- continuous delivery vs continuous deployment 
- infrastructure as code
