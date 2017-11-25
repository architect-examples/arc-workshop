### 🌩  Cloud Ethos

<div style=padding-left:150px;font-size:.6em;text-align:left;>
👉  &nbsp; Focus on delivering **business value** not **infrastructure maintenance**<br>
👉  &nbsp; Using guiding **principles** to inform dev **practices**<br>
</div>

---
## *Ops

- Ops *is not* about a particular tool or even skillset
- Ops *is* the unifiation of the operations, reliability, and qa teams with engineering
- Devops taught us ops should *not* be a siloed team 

---
### Bottom Line 🎯

<span class=high>
As with performance and security, ops is not a line item you can just add to the schedule.
</span>

---
## *Ops

0. Security
1. Performance budgets and capacity planning
2. Systems monitoring
3. Issue triage and recovery

---
# Security
The land of acronyms. 

<style>table#d {font-size:.7em; }</style>
<table id=d>
<tr>
  <th>Concept</th>
  <th>Name</th>
  <th>Acronym</th>
<tr>
   <td>Role based security</td>
   <td>Identity Access Management</td>
   <td>IAM </td>
</tr>
<tr>
  <td>Certificate Authority</td>
  <td>AWS Certificate Manager</td>
   <td>ACM</td>
</tr>
<tr>
  <td>Key management</td>
  <td>Key Management Service</td>
  <td>KMS </td>
</tr>
</table>

---

<span class=high>This is everyone's ethical responsibility to respect the security and privacy of our customers, our colleagues and ourselves.</span>

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

---
Use declarative formats for setup automation, to minimize time and cost for new developers joining the project;

---
Have a clean contract with the underlying operating system, offering maximum portability between execution environments;

---
Are suitable for deployment on modern cloud platforms, obviating the need for servers and systems administration;

---
Minimize divergence between development and production, enabling continuous deployment for maximum agility;

---
And can scale up without significant changes to tooling, architecture, or development practices.

> https://12factor.net

---
## AWS Lambda is a commodification of 12factor principles

---
## A Wild Caveat Appears

<span class=high>Learn the AWS Console inside and out</span>

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
