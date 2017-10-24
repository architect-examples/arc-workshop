---
## Primitives not Framworks

This is a fantastic mental model for the serverless renaissance 

---
## Primitives

- Compute
- Blob storage
- Database persistence
- HTTP gateway
- Messaging

---
## Primitives as a Service

A better PaaS?

| Compute              | Lambda
| Blob storage         | S3
| Database persistence | DynamoDB
| HTTP gateway         | API Gateway, CloudFront, Route53
| Messaging            | SNS

---
## Important!

AWS is much more serverless than just these services:

- Lambda
- S3
- DynamoDB
- API Gateway, CloudFront, Route53
- SNS

However even with just these primatives one can compose very powerful solutions!

---
## Spoiler Alert *Ops: Still A Thing

security
performance budgets and capacity planning
monitoring
bug triage
disaster recovery


tools of the ops-y cloud trade

scheduled functions are a very ops-y thing achieved with cloudwatch events
cloudwatch logs for bug triage and monitoring
xray for detailed service metrics
cloudformation and SAM for 'infrastructure as code'




---
# Security

A land of acronyms. 

| Role based security   | IAM (Identity Access Management) is required
| Certificate Authority | ACM (AWS Certificate Manager) is your friend
| Key management        | KMS (Key Management Service) is super awesome


