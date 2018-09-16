let arc = require('@architect/functions')
let fs = require('fs')

let cache = {}

function read(file) {
  if (!cache[file])
    cache[file] = fs.readFileSync(`${__dirname}/${file}`).toString()
  return cache[file]
}

function route(req, res) {
  let js = read(req.params.file)
  res({js})
}

exports.handler = arc.js.get(route)
