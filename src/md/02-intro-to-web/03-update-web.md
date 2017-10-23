---
## 03.0 Update Web

```bash
mkdir arc-workshop
cd src/html/get-index
npm i @architect/arc-workshop-data --save
```

> You can substitute @architect/arc-workshop-data for your own module published in 02.01 DB CRUD

---
# 0301 Update Web

```javascript
var arc = require('@architect/functions')

function index(req, res) {
  data.heartbeats.query({
  
  }, 
  function _query(err, result) {
    if (err) throw err
    res({
      html: result.Items.map(b=> `<li>${b.utcDate} ${b.utcTime}</li>`).join('')
    })
  })
}

exports.handler = arc.html.get(index)
```
