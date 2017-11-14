var fs = require('fs')
var path = require('path')
var md = require('marked')

function _render(filename) {
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

module.exports = function render(req, res, next) {
  res({
    html: req.path === '/'? _render('index.md') : _render(req.path)
  })
}
