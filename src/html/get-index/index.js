var arc = require('@architect/functions')
var render = require('@architect/shared/md')

exports.handler = arc.html.get(render)
