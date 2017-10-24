
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



- a caveat! I think you should learn the AWS Console inside and out. its your IDE and you are only fucking yourself over by not mastering it no matter how much of a peice of shit you think it is
    - learning the console makes you a master of scripting AWS itself; it leads to deeper understanding of what the APIs so cryptically described in docs are actually capable of; if I didn't know how API Gateway works visually I most-fucking-definitely would not have been able to write arc abstraction for it; seriously have a look at those docs and tell me you have any clue wtf they're talking about. its an api for creating apis ffs. how *could* you document that?! visually thats how. and thats the genius of what the console does. it teaches you how to write aws code visually.


