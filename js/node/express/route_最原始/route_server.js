const http = require("http")
const fs = require("fs")
const url = require("url")
const path = require("path")
const handlebars = require("handlebars")
const querystring = require("querystring")

const port = 8000

var server = http.createServer(f)
server.listen(port, () => console.log("listening on ", port))

function f(request, response) {
  var pathName = url.parse(request.url).pathname

  var type = pathName.length > 1 ? path.extname(pathName).substr(1) : "html"
  if (type != "css" && type != "js") {
    type = "html"
  }
  response.writeHead(200, "OK", {
    "Content-Type": `text/${type};charset=utf-8`
  })

  if (pathName == "/") {
    var src = fs.readFileSync("./index.html", "utf8")
    var templet = handlebars.compile(src.toString())
    var cookie = querystring.parse(request.headers.cookie, ";")
    var user = Users.filter(user => user.name == cookie.loginName)
    var htm = templet({
      user: user[0],
      questions: Questions,
    })
    response.end(htm)
    return
  }

  if (pathName == "/login.html") {
    var src = fs.readFileSync("./login.html", "utf8")
    var templet = handlebars.compile(src.toString())
    var htm = templet({})
    response.end(htm)
  }

  if (pathName == "/logining" && request.method == "POST") {
    var postContent = ""
    request.on("data", data => {
      postContent += data.toString()
    })
    request.on("end", () => {
      postContent = querystring.parse(postContent)
      var user = Users.filter(user => user.name == postContent.name && user.password == postContent.password)
      if (user.length > 0) {
        response.writeHead(301, {
          location: "/",
          'Set-Cookie': 'loginName=' + user[0].name,
        })
        response.end("登录成功！")
      } else {
        var src = fs.readFileSync("./login.html", "utf8")
        var templet = handlebars.compile(src.toString())
        var htm = templet({
          errorMsg: "用户名或密码错误!"
        })
        response.end(htm)
      }
    })
    return
  }

  var questionId
  if (questionId = pathName.match(/^\/question\/([^\/]+)$/)) {
    questionId = questionId[1]
    var src = fs.readFileSync("./question.html", "utf8")
    var templet = handlebars.compile(src.toString())
    var question = Questions.filter(item => item.id.toString() == questionId)
    var from = Users.filter(item => item.name == question[0].from)
    var answers = Answers.filter(item => item.toId.toString() == questionId)
    var htm = templet({
      question: question[0],
      from: from[0],
      answers
    })
    response.end(htm)
    return
  }

  var otherPath = path.join(".", pathName) //一个页面上的所有请求都会按顺序一次次往服务器发送，比如css，js引用等
  try {
    fs.createReadStream(otherPath).pipe(response)
  } catch (e) {
    console.log(e)
    res.end("not fond")
  }
}



var Users = [{
  name: "hd",
  password: "123",
}, {
  name: "dh",
  password: "123"
}]

var Questions = [{
  id: 1,
  title: "abc",
  content: "i m abc",
  from: "hd"
}, {
  id: 2,
  title: "def",
  content: "i m def",
  from: "dh"
}]

var Answers = [{
  id: 1,
  content: "just abc",
  from: "dh",
  toId: 1
}]