## Preface: Mental Models

In physics we describe light in terms of particles and waves. Neither of these things are precisely true but both are useful *models* for thinking about how light works.


---
## Preface: Mental Models
A mental model is way of approaching thinking around a how a particular idea or topic works. It is a technique of self directed empathy to aide in understanding complex systems better and make better decisions for creating desirable outcomes in those systems.

---
## Preface: Mental Models
Awesome links:

- https://en.wikipedia.org/wiki/Mental_model
- https://www.farnamstreetblog.com/mental-models/


---
## Primitives not Framworks

![](http://www.allthingsdistributed.com/images/wvlogo.jpg)

This is a fantastic mental model for the serverless renaissance introduced by Werner Vogals, CTO of Amazon.

---
## AWS Primitives

- Compute
- Blob storage
- Database persistence
- HTTP gateway
- Messaging

---
## Primitives

- **Compute** &rarr; runtime for all your business logic
- **Blog storage** &rarr; static assets, coldstorage of data, etc
- **Database persistence** &rarr; structured data
- **HTTP gateway** &rarr; talk to the world
- **Messaging** &rarr; background tasks

---
## Primitives as a Service

A better PaaS? *
<style>
table#c tr th {
  font-size:.6em;
}
table#c tr td {
  font-size:.6em;
}
</style>
<table width=100% id=c>
<tr>
  <th style=width:150px;>Primitive</th>
  <th style=width:150px;>Product</th>
</tr>
<tr>
  <td>Compute</td>
  <td>Lambda</td>
</tr>
<tr>
  <td>Blob storage</td>
  <td>S3</td>
</tr>
<tr>
  <td>Compute</td>
  <td>Lambda</td>
</tr>
<tr>
  <td>Database</td>
  <td>DynamoDB</td>
</tr>
<tr>
  <td>HTTP gateway</td>
  <td>API Gateway, CloudFront, Route53</td>
</tr>
<tr>
  <td>Messaging</td>
  <td>SNS</td>
</tr>
</table>

<blockquote style=width:100%;font-size:.5em;>
* PaaS in popular tech culture meant Platform as a Service; an idea that predicated Lambda
</blockquote>

---
## Managed vs Unmanged

- Transparent vs Opaque
- Security
- Performance
- Scale

Can your business commoditize these vectors faster and cheaper than AWS?

---
## Mental Model

<style>
table#b tr th {
  font-size:.6em;
}
table#b tr td {
  font-size:.6em;
}
</style>
<table id=b>
<tr>
  <th style=width:150px;>Primitive</th>
  <th style=width:150px;>Self Managed</th>
  <th style=width:200px;>Fully Managed</th>
  <th>&nbsp;</th>
</tr>
<tr>
  <td>Compute</td>
  <td>Heroku</td>
  <td>Lambda</td>
  <td>Transparent upgrading, Auto Scaling pay per use</td>
</tr>
<tr>
  <td>Blob Store</td>
  <td>Filesystem</td>
  <td>S3 </td>
  <td>Transparent upgrading, Auto Scaling pay per use    </td>
</tr>
<tr>
  <td>Database</td>
  <td>Postgres</td>
  <td>DyanmoDB </td>
  <td>Configured auto scaling pay reads/writes provisioned capacity</td>
</tr>
<tr>
  <td>HTTP</td>
  <td>Express</td>
  <td>API Gateway</td>
  <td>Completely transparent pay per use</td>
<tr>
  <td>Messaging</td>
  <td>Redis</td>
  <td>SNS</td>
  <td>Pay per use</td>
</tr>
</table>

---
## Important!

AWS is much more serverless than just these services:

- Lambda
- S3
- DynamoDB
- API Gateway, CloudFront, Route53
- SNS

---
### Patterns are Mental Models
<style>.high {background:yellow;}</style>
- Introduced in the new well worn GoF
- Sometimes differ between languages/runtimes and/or get built-in
- <span class=high>Underlying principle: we can follow a pattern to solve a particular class of problem</span>

---
<h4 style=width:100%;>🔑  Patterns are Composed of Primitives</h4>

<style>
table#d tr th {
  font-size:.6em;
}
table#d tr td {
  font-size:.6em;
}
</style>
<table width=100% id=d>
<tr>
  <th>Pattern</th>
  <th>Primitive</th>
  <th>Product</th>
</tr>
<tr>
  <td style=width:150px;>Model</td>
  <td style=width:150px;>Database</td>
  <td style=width:150px;>DynamoDB</td>
</tr>
<tr>
  <td>View</td>
  <td>Blob Storage</td>
  <td>S3</td>
</tr>
<tr>
  <td>Controller</td>
  <td>HTTP Gateway</td>
  <td>API Gateway</td>
</tr>
</table>

---
## Old Patterns are New Again
<a href=http://freecontent.manning.com/patterns-for-solving-problems-in-serverless-architectures>
<img src=http://freecontent.manning.com/wp-content/uploads/Sbarski_PiSA_00.png width=300px>
</a>

---
### Composition over Inheritance
<div style=padding-left:150px;font-size:.6em;text-align:left;>
✅  Primitives are flexible and compose to powerful solutions<br>
✅  Frameworks tradeoff flexibility for deliberate constraint<br>
✅  <span class=high>**Frameworks** are composed of **Primitives** implementing **Patterns**</span><br>
</div>
---
## Primitives &rarr; Patterns &rarr; App

Building an **App** is building a non generalized **Framework** for your **Product**

---
### Spoiler: *Ops: Still A Thing

<div style=padding-left:150px;font-size:.6em;text-align:left;>
✅  Devops is about shattering the barrier between dev and delivery<br>
✅  Cloud tech brings delivery right to the doorstep of dev<br>
✅  Loose collection of principles and ever-changing implementing practices *<br>
<blockquote style=width:100%;border:none;background:none;font-size:.6em;>
* The cloud does not negate principles; it's just a new player in our ever-changing implementing practices
</blockquote>
</div>
