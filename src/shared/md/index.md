# Master AWS on Easy Mode with https://arc.codes

> Cloud functions have taken tech by storm! 

- Scale transparently with no concept of clusters or load balancing or infra provisioning
- Isolated logic so debugging is super easy and side effects constrained
- Only pay for the compute you use (100% utilization)
- Deploy instantly with zero downtime

However getting started is frought with complexity and configuration. In this workshop you will quickly learn all the angles of 'serverless' technology using Amazon Web Services tamed with JSF Architect. 

This workshop explores end to end development and deployment of four exercises:

- Website on a custom domain with user authentication and state 
- Function that executes on an interval updating a database record
- A basic JSON API for doing typical database CRUD
- Slack app that responds to slash commands or @ mentions

### Prerequisites

- Comfortable with JavaScript
- Experience with the Node runtime
- Node `8.9.1` and npm `5.5.1` (NOTE: Lambda currently runs Node `6.10.x`)
- npm account (ideally private modules)
- Github account (ideally private repos)
- Codeship account (free tier is 🆒)
- Amazon Web Services account
- AWS `~/.aws/credentials` setup
- Willingness to buy a domain on Route53

## Schedule

| Start | End   | Slides                                                              | Notes                                                                 |
| ----- | ----- | ------------------------------------------------------------------- | --------------------------------------------------------------------- |
|  8:30 |  9:00 | 🎺  (A Brief Introduction to Amazon Web Services)[/00-intro-to-aws]  | &nbsp;                                                                |
|  9:00 |  9:30 | 🎺  (Introduction to JSF Architect)[/01-intro-to-arc]                | &nbsp;                                                                |
|  9:30 | 10:00 | 🌟  Intro web dev; HTML and JSON with API Gateway                    | `GET` hello worlds; `req._url`; shared layouts                        |
| 10:00 | 10:30 | 🌟  Intro web dev; setup a custom domain with Route53 DNS            | `POST` counter to save state in session                               |
| 10:30 | 11:00 | _Coffee Break_                                                      | &nbsp;                                                                |
| 11:00 | 11:30 | 🌟  Test driven intro to DyanmoDB; setup and db design               | keys, one-to-many, many-to-many, reate tables, sandbox; list tables   | 
| 11:30 | 12:00 | 🌟  Test driven intro to DyanmoDB; reads                             | indexes, query, scan, get, batchRead                                  |
| 12:00 | 12:30 | 🌟  Test driven intro to DyanmoDB; writes                            | put, update, delete, backWrite                                        |
| 12:30 |  1:30 | _Lunch_                                                             | &nbsp;                                                                |
|  1:30 |  2:00 | 🌟  Scheduled functions                                              | ping your domain every five mins and save to dynamo                   | 
|  2:00 |  2:30 | 🌟  Build and deploy a JSON API                                      | impl local restish crud actions                                       |
|  2:30 |  3:00 | _Coffee Break_                                                      | &nbsp;                                                                | 
|  3:00 |  3:30 | 🌟  Build and deploy a Slackbot; setup and Slack API primer          | creds; signin vs addtoslack; actions, options, events and slash urls  |
|  3:30 |  4:00 | 🌟  Build and deploy a Slackbot; slash and mentions                  | &nbsp;                                                                |
|  4:00 |  4:30 | 🌟  Build and deploy a Slackbot; buttons and menus                   | &nbsp;                                                                |
|  4:30 |  5:00 | 🌟  Closing Thoughts and Next Steps                                  | &nbsp;                                                                |

- 🎺  Presentation
- 🌟  Presentation &amp; Class Exercise

#### Author Bio

In 2007ish Brian created https://wtfjs.com and later in 2009 at the first JSConf introduced PhoneGap. In 2012 he stewarded the creation of Cordova at the Apache Software Foundaton as Principle Scientist at Adobe Systems. Currently he is the CTO and cofounder of begin.com from which https://arc.codes was extracted and donated to the JS Foundation in July 2017.

