const http = require("http")
const port = 8000
const server = http.createServer((request, response) => {
  console.log(request.method, request.url)
  response.writeHead(200, {
    "Content-Type": "text/plain"
  })
  request.on("data", function(chunk) {
    response.write(chunk.toString().toUpperCase())
  })
  request.on("end", function() {
    response.end()
  })
})

server.listen(port, err => {
  console.log('server listening on port', port)
})