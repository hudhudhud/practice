const app = require('express')()

const cookieParser = require('cookie-parser')

var sessions = {

}

app.use(cookieParser())

app.use(function(req, res, next) {
  if (sessions[req.cookies.sessionid]) {
    req.session = sessions[req.cookies.sessionid]
  } else {
    var id = uuid()
    res.cookie('sessionid', id)
    req.session = sessions[id] = {}
  }
  next()
})

//统计用户访问该页面次数
app.use(function(req, res, next) {
  if (req.session.pv) {
    req.session.pv++
  } else {
    req.session.pv = 1
  }
  next()
})

app.use(function(req, res, next) {
  res.send(req.session.pv.toString()).end()
})

app.listen(8888)