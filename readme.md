# Master AWS on Easy Mode with https://arc.codes

Cloud functions have taken the tech industry by storm. Always available, scale transparently, only pay for the compute you use (100% utilization) and deploy instantly with zero downtime. However gettin started is frought with complexity and configuration. In this workshop you will quickly learn all the angles of 'serverless' technology using Amazon Web Services with JSF Architect. 

JSF Architect tames AWS complexity. The workshop will explore end to end development and deployment of four exercises:

- Website on a custom domain with user authentication and state 
- Function that executes on an interval updating a database record
- A basic JSON API for doing typical database CRUD
- Slack app that responds to slash commands or @ mentions

### Prerequisites

- Experience with Node
- Node 6.10.x and npm 3.10.x installed
- npm account (ideally private modules)
- Github account (ideally private repos)
- Codeship account
- Amazon Web Services account
- AWS `~/.aws/credentials` setup
- Willingness to buy a domain on Route53

## Schedule

| Start | End   | Runtime   | Slides                                                           |
| ----- | ----- | --------- | ---------------------------------------------------------------- | 
|  8:30 |  9:00 |  .5 hour  | (A Brief Introduction to Amazon Web Services)[/00-intro-to-aws]  | 
|  9:00 |  9:30 |  .5 hour  | (Introduction to JSF Architect)[/01-intro-to-arc]                | 
|  9:30 | 10:30 |   1 hour  | * (Replace CRON Forever)[/02-replace-cron]                       | 
| 10:30 | 11:00 |  .5 hour  | Coffee Break                                                     |
| 11:00 | 12:30 | 1.5 hours | * (Author a Stateful Web App)[/03-stateful-web]                  | 
| 12:30 |  1:30 |   1 hour  | Lunch                                                            |
|  1:30 |  2:30 | 1.5 hours | * (Deploy a Stateless JSON API)[/04-rpc-json-api]                | 
|  2:30 |  3:00 |  .5 hour  | Coffee Break                                                     |
|  3:00 |  4:30 | 1.5 hours | * (Build a Slackbot)[/05-slackbot-api]                           | 
|  4:30 |  5:00 |  .5 hour  | * (Closing Thoughts and Next Steps)06-closing-thot               | 

## Code

| Repo              | Description                      | `.arc` 
| ----------------- | -------------------------------- | ---------------
| arc-workshop      | This repo                        | @app, @domain, @html
| arc-workshop-app  | Workshop blog                    | @app, @domain, @html, @json
| arc-workshop-data | Workshop blog data access layer  | @app, @tables, @indexes
| arc-workshop-bot  | Workshop blog bot                | @app, @slack

#### Author Bio

In 2007ish Brian created https://wtfjs.com and later in 2009 at the first JSConf introduced PhoneGap. In 2012 he stewarded the creation of Cordova at the Apache Software Foundaton as Principle Scientist at Adobe Systems. Currently he is the CTO and cofounder of begin.com from which https://arc.codes was extracted and donated to the JS Foundation in July 2017.

