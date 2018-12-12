const http = require('http')
const WebSocket = require('faye-websocket')
const ws = require('ws')

const server = http.createServer()

// 请求响应模型的请求
// connect，upgrade请求不在此事件里处理
server.on('request', function(req, res) {
  console.log(req.method, req.url)
  res.end('hello world')
})

const wss = new ws.Server({
  server,
})

wss.on('connection', (ws, req) => {
  req.headers
  req.url
  console.log('ws connected')
  ws.on('message', msg => {
    console.log(msg)
    ws.send(msg.toUpperCase())
  })
  ws.on('close', () => {
    console.log('ws closed')
  })
})

// server.on('upgrade', function(req, sock, buf) {
//   sock.on('data', data => {
//     console.log(data)
//   })
//   if (WebSocket.isWebSocket(req)) {
//     var ws = new WebSocket(req, sock, buf)
//     ws.send('hello websocket')

//     ws.on('message', event => {
//       // console.log(1, event.data)
//       ws.send(event.data.toUpperCase())
//     })

//     ws.on('close', event => {
//       ws = null
//     })
//   }
// })

server.listen(8899, () => {
  console.log(8899)
})