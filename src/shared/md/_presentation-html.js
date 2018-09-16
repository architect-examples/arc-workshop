var fs = require('fs')
var path = require('path')
var md = require('marked')
var glob = require('glob')

module.exports = function _presentationHTML(req) {
  // check for folder
  var folderPath = path.join(__dirname, req.params.page)
  if (!fs.existsSync(folderPath)) {
    var e = Error('missing page')
    e.code = 404
    throw e
  }
  else {
    var wrap = x=> `<section>${x}</section>`
    var html = ''
    glob.sync(`${folderPath}/*`).sort().forEach(name=> {
      html += fs.readFileSync(name).toString().split('---').map(x=> md(x)).map(wrap).join('')
    })
    return _layout(html)
  }
}

var testingAssets = `
<link rel="stylesheet" href="/css/reveal.css">
<link rel="stylesheet" href="/css/white.css">
<link rel="stylesheet" href="/css/default.css">
<script src="/js/reveal.js"></script>
<script src="/js/highlight.js"></script>
<script src="/js/highlight_002.js"></script>
<script src="/js/notes.js"></script>
`

var liveAssets = `
<link rel="stylesheet" href=https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.5.0/css/reveal.min.css>
<link rel="stylesheet" href=https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.5.0/css/theme/white.css>
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css">
<script src=https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.5.0/js/reveal.min.js></script>
<script src=https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js></script>
<script src=https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.5.0/plugin/highlight/highlight.js></script>
<script src=https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.5.0/plugin/notes/notes.js></script>
`

function _layout(slides) {
  return `
<!doctype html>
<html>
<head>${process.env.NODE_ENV === 'testing'? testingAssets : liveAssets}</head>
<body>
<div class=reveal><div class=slides>${slides}</div></div>
<!--
# demos

0. authoring .arc file
1. provisioning infra
2. working offline
3. deploying
4. managing deps
5. testing and ci
6. logging and monitoring
7. extending .arc
8. open source project and foundation
9. roadmap and 'get involved bit'
-->
<script>
Reveal.initialize({
  showNotes:false,
  history:true,
  progress: true,
  slideNumber: true,
})
hljs.initHighlightingOnLoad()
</script>
</body>
</html>
`
}
