Databases in the past few years have evolved into fully managed cloud services. DynamoDB is an extremely powerful product with very desirable characteristics for a persistent data storage solution. In this section we will fully exploring building for DynamoDB using JSF Architect.

In these exercises we will design a small microblogging service. Through these exercises we will model different data relationships, create local and deployment infrastructure. We will use test driven development to guide these exercises as they are less visually oriented. 

---
### 1. Setup

Database design is super fun. Lets create a new project for our data layer:

```bash
mkdir arc-workshop-data
mkdir arc-workshop-data/test
cd arc-workshop-data
npm init --yes
```

Add some deps:

```
npm i @architect/data --save
npm i @architect/workflows run-parallel run-waterfall tape tap-spec --save-dev
```

And some starter files:

```bash
touch index.js
touch test/env-test.js
touch .arc
```

---
### 2. Setup `npm run` Workflows

Edit `package.json` `scripts`:

```javascript
{
  "scripts": {
    "create": "AWS_PROFILE=personal AWS_REGION=us-east-1 arc-create",
    "test": "NODE_ENV=testing AWS_PROFILE=personal AWS_REGION=us-east-1 tape test/*-test.js | tap-spec",
    "start": "NODE_ENV=testing AWS_PROFILE=personal AWS_REGION=us-east-1 arc-repl"
  }
}
```

---
### 3. Define Tables in `.arc`

Edit the `.arc` file. Note we want the same `@app` so the tables are namespaced correctly.

```.arc
@app
arc-workshop

@tables
posts
  postID *String
  #slug
  #title
  #body
  #tags
  #ts

reactions
  postID *String
  emoji **String
  #count
```

This `.arc` file defines two tables:

- `posts`
- `reactions`

Things to notice:

- Table columns are indented by two spaces
- The first column is called the `primary partition key`; it is also sometimes reffered to as the `hash key`
- The `partition key` type with JSF Architect defined tables is either `*String` or `*Number`
- The second column is, optionally, a `sort key`; also sometimes called a `range key`
- The `sort key` can be either `**String` or `**Number`
- Additional columns aren't really part of the table schema; just comments to help future programmers think about the model!

Tips
- It is good form to give tables a plural name
- DynamoDB columns read best (in JavaScript) with camelCase notation

---
### 4. Create Tables

Execute `npm run create` to create the tables. This can take a minute.

JSF Architect creates two tables for every table defined in the `.arc` file. One for `staging` and one for `production`.

In DynamoDB the tables would follow the naming convention: `appname-production-tablename` so for the exmaple above we will see the tables created:

- `arc-workshop-production-posts`
- `arc-workshop-staging-posts`
- `arc-workshop-production-reactions`
- `arc-workshop-staging-reactions`

Further to this isolation we will also use a local sandbox for development.

---
