---
## 00 Setup an `.arc` project

Make sure you have `.aws/credentials` setup.

---
## 01 Setup an `.arc` project

```bash
mkdir arc-workshop
cd arc-workshop
touch .arc
npm init --yes
```

---
## 02 Setup an `.arc` project

Open `package.json` in your fav text editor and add run `scripts`:

```javascript
{
  "scripts": {
    "create": "AWS_PROFILE=personal AWS_REGION=us-west-1 arc-create",
    "deploy": "AWS_PROFILE=personal AWS_REGION=us-west-1 arc-deploy",
    "start": "NODE_ENV=testing AWS_PROFILE=personal AWS_REGION=us-west-1 arc-sandbox",
    "dns": "AWS_PROFILE=personal AWS_REGION=us-west-1 arc-dns"
  }
}
```

---
## 03 Setup an `.arc` project

Open `.arc` up in your editor.

```.arc
@app
arc-workshop

@html
get /
```

Save `.arc` and in your terminal invoke `npm run create`. 

---
## 04 Setup an `.arc` project

Buy a domain in the AWS Console &rarr; Route 53 &rarr; Domains. 

---
## 05 Setup an `.arc` project

Edit `.arc` file with a `@domain` as below.

```.arc
@app
arc-workshop

@domain
your-domain-here.com

@html
get /
```

And `npm run dns`. Follow the instructions. You will need to re-run this command as you verify certificates.

