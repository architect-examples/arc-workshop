var _empty = require('./_empty-html')
var _presentation = require('./_presentation-html')
var _exercise = require('./_exercise-html')

module.exports = function render(req, res, next) {
  console.log(JSON.stringify(req, null, 2))
  var html = ''
  if (req.path === '/') html = _empty('index.md')
  else if (req.params.page.startsWith('00') || req.params.page.startsWith('01')) html = _presentation(req)
  else html = _exercise(req)
  res({html})
}
