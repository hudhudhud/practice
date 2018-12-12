//调试时需要往浏览器cookie写入一个cookie，如id=a,
//然后发送消息格式为 a imok!
const express = require("express")
const cookieParse = require("cookie-parser")
const readline = require('readline')

const app = express()
const cacheMsg = []
const cacheReq = []
const port = 8000

app.use(cookieParse())

//模拟给客户端发信息，以user msg的格式输入
//一旦输入回车，去缓存找是否有对该cookie用户的响应，有则把信息发送给客户端
//没有则把该信息存到缓存，以便下次客户端请求的时候马上发送
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "input msg>>"
})

rl.on("line", input => {
  var [to, msg] = input.split(" ")
  if (cacheReq[to]) {
    cacheReq[to].json({
      msg: msg
    })
    delete cacheReq[to]
  } else {
    cacheMsg[to] = input
  }
  rl.prompt()
})

//服务器接收到请求则去缓存里找是否有对应cookieid的消息，有则直接发送
//否则把该次响应体放进缓存，以便下次有消息时用这个响应返回给客户端消息
//发送完成后删掉缓存信息
//超时30s都没有消息则直接end这个请求
app.get("/msg", (req, res, next) => {
  var id = req.cookies.id
  if (cacheMsg[id]) {
    res.json({
      msg: cacheMsg[id]
    })
    delete cacheMsg[id]
  } else {
    cacheReq[id] = res
    setTimeout(() => {
      delete cacheReq[id]
      res.end()
    }, 30000)
  }
})

//客户端发请求，待服务器响应之后立即再次发出请求，以时刻准备接收服务器的响应
app.use((req, res, next) => {
  //fetch中配置为了使请求体带上cookie
  res.send(`
    <h1>you see me</h1>
    <script>
      function getMsg(){
        fetch("/msg",{credentials:"include"}) 
        .then(res=>res.json())
        .then(console.log)
        .then(getMsg)
      }
      getMsg()
    </script>
    `)
})

app.listen(port, () => {
  console.log("listening on " + port)
  rl.prompt()
})