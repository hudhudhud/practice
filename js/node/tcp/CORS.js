const net = require('net')

net.createServer(function(conn) {
  conn.on('data', data => {
    var firstLine = data.toString().split('\r\n')[0]
    console.log(firstLine)
    var [method, path] = firstLine.split(' ')
    
    if (method === 'OPTIONS') {
      conn.write('HTTP/1.1 200 OK\r\n')
      conn.write('Access-Control-Allow-Headers: X-PINGOTHER, Content-Type\r\n')
      conn.write('Access-Control-Allow-Origin: *\r\n')
      conn.write('Access-Control-Max-Age: 120')
      conn.end()
    } else {
      conn.write('HTTP/1.1 200 OK\r\n')
      conn.write('Access-Control-Allow-Origin: *\r\n')
      conn.write('Content-Length: 4\r\n')
      conn.write('\r\n')
      conn.write('aaaa')
      conn.end()
    }
  })
}).listen(8082)
