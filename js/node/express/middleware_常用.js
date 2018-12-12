const express = require("express")
const querystring = require("querystring") //还有一个qs可以解析深层次的如a[m]=b&a[n]=c  ==>{a:{m:b,n:c}}

app = express()

//例如当http请求方法为delete时，因为电信会拦截该方法，所以一般会在x-http-method-override上传方法名
app.use(function overriteMethod(req, res, next) {
  if (req.headers['x-http-method-override']) {
    req.method = req.headers['x-http-method-override'].toUpperCase()
  }
  next()
})

//解析客户端发送过来的内容，可以为json，或者表单提交
app.use(function bodyParse(req, res, next) {
  var body = ""
  req.on("data", function(data) {
    body += data.toString()
  })
  req.on("end", function() {
    if (req.headers["content-type"] === "application/json") {
      req.body = JSon.parse(body)
    } else if (req.headers["content-type"] == 'application/x-www-form-urlencoded') { //表单提交类型
      req.body = querystring.parse(body)
    } else {
      req.body = body
    }
    next()
  })
})

//cookie转换为对象
app.use(function cookieParse(req, res, next) {
  var cookieString = req.headers.cookie
  var cookies = querystring.parse(cookieString, "; ")
  req.cookies = cookies
  next()
})

//记住登录者
app.use(function logUser(req, res, next) {
  if (req.cookies["loginName"]) {
    var username = req.cookies["loginName"]
    req.user = username
      // getUserInfoFromDatabase(username) //通过数据库方法异步得到用户数据
      //   .then(function(user) {
      //     req.user
      //   }, function(reason) {
      //     req.user = null
      //   })
    res.send(req.user)
  }
})

app.listen(8989, () => console.log("listening"))