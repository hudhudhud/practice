var express = require("express")

var route = express.Router()

route.use((req, res, next) => {
  console.log(req.baseUrl) // 得到/detail,调用其的根目录
  console.log(222)
  next()
})

route.get("/", (req, res, next) => {
  res.send("i m detail")
})

route.get("/a", (req, res, next) => {
  res.send("i m a")
})

route.get('/b', (req, res, next) => {
  res.send('i m b')
})

module.exports = route