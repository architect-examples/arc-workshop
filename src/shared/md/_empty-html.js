var fs = require('fs')
var path = require('path')
var md = require('marked')

module.exports = function _emptyHTML(filename) {
  var html =  md(fs.readFileSync(path.join(__dirname, filename)).toString())
  var css = fs.readFileSync(path.join(__dirname, 'index.css'))
  return `
<!doctype html>  
<html>
<head>
<style>${css}</style>
</head>
<body>${html}</body>
</html>`
}
