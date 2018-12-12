const express = require("express")
const fs = require("fs")

var app = new express()
var port = 9090


app.use(express.static('./'))

app.use((req, res, next) => { //当客户端请求的url无法匹配到任何资源时，就打开index页面
  //res.sendFile(path.join(__dirname, '/app/index.html'))
  res.set({
    'Content-Type': 'text/html; charset=utf8',
  }).send(fs.readFileSync('./app/index.html'))

})

app.listen(port, () => console.log("listing on ", port))