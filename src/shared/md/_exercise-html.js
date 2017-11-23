var path = require('path')
var md = require('marked')
var glob = require('glob')
var fs = require('fs')

function up(s) {
  if (s === 'api') return 'API'
  if (s === 'url') return 'URL'
  if (s === 'json') return 'JSON'
  if (s === 'oauth') return 'oAuth'
  if (s === 'ddb') return 'DynamoDB'
  return s.charAt(0).toUpperCase() + s.slice(1)
}

module.exports = function _exerciseHTML(req) {
  var title = req.params.page.split('-').slice(1).map(up).join(' ').replace('/', '')
  var contents = glob.sync(`${path.join(__dirname, req.params.page.replace('/', ''))}/*`)
  var paths = c=> c.split('shared/md')[1].replace('.md', '')
  var menus = contents.map(paths).map(menu).join('')
  var body = ''
  contents.forEach(p=> {
    var bits = p.split('/')
    var last = bits[bits.length - 1].replace('.md', '')
    body += `<h1 id=${last}>${last.split('-').slice(1).map(up).join(' ')}</h1>`
    body += md(fs.readFileSync(p).toString())
  })

  function menu(p) {
    var bits = p.split('/')
    var last = bits[bits.length - 1].replace('.md', '')
    var fmt = p=> p.replace(req.params.page, '').split('-').slice(1).map(up).join(' ')
    var href = `#${last}`
    var title = fmt(p)
    return `<li><a href=${href}>${title}</a></li>`
  }
  var testing = false//process.env.NODE_ENV === 'testing'
  var bootstrap = testing? '/boostrap.css' : 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'
  var js = {
    jquery: testing? 'jquery.js' : 'https://code.jquery.com/jquery-1.12.0.min.js',
    bootstrap: testing? 'boostrap.js' : 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
    prism: testing? 'prism.js' : 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.8.4/prism.min.js'
  }
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset=utf-8>
  <meta name=viewport content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <link rel="stylesheet" href=${bootstrap}>
  <style>${style}</style>
</head>
<body>
<div class="wrapper">

  <nav id="sidebar">
    <div class="sidebar-header">
      <h3>${title}</h3>
    </div>
    <ul class="list-unstyled components">
    ${menus}
    </ul>
  </nav>

  <div id="content">
    <nav class="navbar navbar-default">
    <div class="container-fluid">
    <div class="navbar-header">
    <button type="button" id="sidebarCollapse" class="navbar-btn">
    <span></span>
    <span></span>
    <span></span>
    </button>
    </div>
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
    <ul class="nav navbar-nav navbar-right">
    <li><a href=/>🗓  Back to Schedule</a></li>
    <li><a href=https://github.com/arc-repos/arc-workshop>🔬 View Source on Github</a></li>
    </ul>
    </div>
    </div>
    </nav>
    ${body}
  </div>
</div>

<script src=${js.jquery}></script>
<script src=${js.bootstrap}></script>
<script src=${js.prism}></script>

<script>
$(document).ready(function() {
  $('#sidebarCollapse').on('click', function() {
    $('#sidebar').toggleClass('active')
    $(this).toggleClass('active')
  })
})
</script>
</body>
</html>
`
}

var style = `
@import "https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700";

body {
    font-family: 'Poppins', sans-serif;
    background: #fafafa;
}

p {
  margin:1em auto 1em auto;
}

#content p, #content li {
  font-family: 'Poppins', sans-serif;
  font-size: 1.4em;
  font-weight: 300;
  line-height: 1.7em;
  color: #999;
}
#content blockquote {
  font-size: .9em;
  margin: 1em 0; 
  padding:0 0 0 1em;
}

#content blockquote p {
  margin:0;padding:0
}

a, a:hover, a:focus {
    transition: all 0.3s;
}

.navbar {
    padding: 15px 10px;
    background: #fff;
    border: none;
    border-radius: 0;
    margin-bottom: 40px;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.navbar-btn {
    box-shadow: none;
    outline: none !important;
    border: none;
}

.line {
    width: 100%;
    height: 1px;
    border-bottom: 1px dashed #ddd;
    margin: 40px 0;
}

/* ---------------------------------------------------
    SIDEBAR STYLE
----------------------------------------------------- */
.wrapper {
    display: flex;
    align-items: stretch;
    perspective: 1500px;
}

#sidebar {
    min-width: 250px;
    max-width: 250px;
    background: #2A2A2E;
    color: #75BFF2;
    transition: all 0.6s cubic-bezier(0.945, 0.020, 0.270, 0.665);
    transform-origin: bottom left;
}

#sidebar.active {
    margin-left: -250px;
    transform: rotateY(100deg);
}

#sidebar .sidebar-header {
  padding: 20px;
  background: #40444D;
  color:#F07AE9;
  text-align:center;
}

#sidebar ul.components {
    padding: 20px 0;
}

#sidebar ul p {
    color: #fff;
    padding: 10px;
}

#sidebar ul li a {
  text-align:right;
    padding: 10px 40px 10px;
    font-size: 1.1em;
    display: block;
    color: inherit;
    text-decoration: none;
}
#sidebar ul li a:hover {
    color: #A985F2;
    background: black;
}

#sidebar ul li.active > a, a[aria-expanded="true"] {
    color: #fff;
    background: #6d7fcc;
}


a[data-toggle="collapse"] {
    position: relative;
}

a[aria-expanded="false"]::before, a[aria-expanded="true"]::before {
    content: '\e259';
    display: block;
    position: absolute;
    right: 20px;
    font-family: 'Glyphicons Halflings';
    font-size: 0.6em;
}
a[aria-expanded="true"]::before {
    content: '\e260';
}

ul ul a {
    font-size: 0.9em !important;
    padding-left: 30px !important;
    background: #6d7fcc;
}

ul.CTAs {
    padding: 20px;
}

ul.CTAs a {
    text-align: center;
    font-size: 0.9em !important;
    display: block;
    border-radius: 5px;
    margin-bottom: 5px;
}

a.download {
    background: #fff;
    color: #7386D5;
}

a.article, a.article:hover {
    background: #6d7fcc !important;
    color: #fff !important;
}

#content {
    padding: 20px;
    min-height: 100vh;
    transition: all 0.3s;
}

#sidebarCollapse {
    width: 40px;
    height: 40px;
    background: #f5f5f5;
}

#sidebarCollapse span {
    width: 80%;
    height: 2px;
    margin: 0 auto;
    display: block;
    background: #555;
    transition: all 0.8s cubic-bezier(0.810, -0.330, 0.345, 1.375);
    transition-delay: 0.2s;
}

#sidebarCollapse span:first-of-type {
    transform: rotate(45deg) translate(2px, 2px);
}
#sidebarCollapse span:nth-of-type(2) {
    opacity: 0;
}
#sidebarCollapse span:last-of-type {
    transform: rotate(-45deg) translate(1px, -1px);
}


#sidebarCollapse.active span {
    transform: none;
    opacity: 1;
    margin: 5px auto;
}


@media (max-width: 768px) {
    #sidebar {
        margin-left: -250px;
        transform: rotateY(90deg);
    }
    #sidebar.active {
        margin-left: 0;
        transform: none;
    }
    #sidebarCollapse span:first-of-type,
    #sidebarCollapse span:nth-of-type(2),
    #sidebarCollapse span:last-of-type {
        transform: none;
        opacity: 1;
        margin: 5px auto;
    }
    #sidebarCollapse.active span {
        margin: 0 auto;
    }
    #sidebarCollapse.active span:first-of-type {
        transform: rotate(45deg) translate(2px, 2px);
    }
    #sidebarCollapse.active span:nth-of-type(2) {
        opacity: 0;
    }
    #sidebarCollapse.active span:last-of-type {
        transform: rotate(-45deg) translate(1px, -1px);
    }

}

pre {
  background: black;
  color: #7CC4A9;
  border: 1px solid green;
  border-radius: 10px;
}
pre code.lang-javascript {
  background: black;
}

.token.comment,
  .token.block-comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
      color: #999;
  }

.token.punctuation {
    color: #ccc;
}

.token.tag,
  .token.attr-name,
  .token.namespace,
  .token.deleted {
      color: #e2777a;
  }

.token.function-name {
    color: #6196cc;
}

.token.boolean,
  .token.number,
  .token.function {
      color: #f08d49;
  }

.token.property,
  .token.class-name,
  .token.constant,
  .token.symbol {
      color: #f8c555;
  }

.token.selector,
  .token.important,
  .token.atrule,
  .token.keyword,
  .token.builtin {
      color: #cc99cd;
  }

.token.string,
  .token.char,
  .token.attr-value,
  .token.regex,
  .token.variable {
      color: #7ec699;
  }

.token.operator,
  .token.entity,
  .token.url {
      color: #67cdcc;
  }

.token.important,
  .token.bold {
      font-weight: bold;
  }
.token.italic {
    font-style: italic;
}

.token.entity {
    cursor: help;
}

.token.inserted {
    color: green;
}

.token.function {
  color:rgb(117, 191, 242);;
}

code {
  color: #F07AE9;
}

`

