---
## 1.0 Database CRUD

Create a new project for our data layer:

```bash
mkdir arc-workshop-data
cd arc-workshop-data
touch index.js
touch .arc
npm init --yes
npm i @architect/data --save
npm i @architect/workflows --save-dev
```

---
## 1.1 Database CRUD

Add `create` to `package.json` `scripts`:

```javascript
{
  "scripts": {
    "create": "AWS_PROFILE=personal AWS_REGION=us-west-1 arc-create",
    "start": "AWS_PROFILE=personal AWS_REGION=us-west-1 arc-repl"
  }
}
```

---
## 1.2 Database CRUD

Edit the `.arc` file. Note we want the same `@app` so the tables are namespaced correctly.

```.arc
@app
arc-workshop

@tables
heartbeats
  utcDate *String
  utcTime **String
```

And execute `npm run create` to ensure the tables are created.

---
## 1.3 Database CRUD

We'll use `@architect/data` to generate a DynamoDB client. Add the following to `index.js`:

```javascript
// index.js
const data = require('@architect/data')
module.exports = data()
```

---
## 1.4 Database CRUD

Test drive the REPL.

---
## 1.5 Database CRUD

Lets write some tests.

---
## 1.6 Database CRUD

Add lint checker.


---
## 1.7 Database CRUD

Add code coverage.

---
## 1.8 Database CRUD

Publish your module.


---
## 1.9 Database CRUD

Extra Credit

- Continuous Integration
- Greenkeeper
- Bithound


