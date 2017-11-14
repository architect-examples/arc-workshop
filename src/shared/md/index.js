var fs = require('fs')
var path = require('path')
var md = require('marked')

function _render(filename) {
  return md(fs.readFileSync(path.join(__dirname, filename)).toString())
}

module.exports = function render(req, res, next) {
  res({
    html: req.path === '/'? _render('index.md') : _render(req.path)
  })
}
