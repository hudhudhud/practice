const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')
const util = require('util')
const mime = require('mime')

fs.stat = util.promisify(fs.stat)
fs.readdir = util.promisify(fs.readdir)
fs.readFile = util.promisify(fs.readFile)

// var mimeMap = {
//   '.jpg': 'image/jpeg',
//   '.txt': 'text/plain',
//   '.html': 'text/html',
//   '.js': 'application/javascript',
//   '*': 'application/octet-stream'
// }

const port = 9090

const root = process.cwd()

const server = http.createServer(async function(request, response) {
  console.log(request.method, request.url)
  var pathname = url.parse(request.url).pathname
  var finalPath = path.join(root, pathname)

  try {
    var stat = await fs.stat(finalPath)
    if (stat.isFile()) {
      response.writeHead(200, {
        'Content-Type': mime.lookup(finalPath)
      })
      response.end(await fs.readFile(finalPath))
    } else if (stat.isDirectory()) {
      response.writeHead(200, {
        'Content-Type': mime.lookup('a.html')
      })
      var files = await fs.readdir(finalPath)
      response.end(files.map(file => {
        var isDir = fs.statSync(path.join(finalPath, file)).isDirectory()
        return `<a href="${file}${isDir?'/':''}">${file}</a><br>`
      }).join(''))
    }
  } catch (e) {
    response.writeHead(404, {
      'Content-Type': mime.lookup('a.html')
    })
    response.end('404 Not Found')
  }
})

server.listen(port, err => {
  console.log('Server listening on port', port)
})