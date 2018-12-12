var express = require('express')
var cookieParser = require('cookie-parser')
var uuid = require('uuid')
var bodyParser = require('body-parser')

var app = express()

var sessions = {
  '8e0b8685-0243-400a-9b47-ec8b414777df': {
    pv: 8
  }
}

app.use((req, res, next) => {
  console.log(req.method, req.url)
  next()
})

app.use(express.static('./'))

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))

//统计用户浏览页面次数，pageview
app.use(function session(req, res, next) {
  var sessionid = req.cookies.sessionid
  if (sessions[sessionid]) {
    req.session = sessions[sessionid]
    next()
  } else {
    sessionid = uuid()
    res.cookie('sessionid', sessionid)
    req.session = sessions[sessionid] = {
      pv: 1,
    }
    next()
  }
})

app.use((req, res, next) => {
  req.session.pv++
    //res.send(req.session.pv)
    next()
})

// 图形验证码
app.get('/recaptcha-img', function(req, res, next) {
  req.session.recaptcha = Math.random() * 1000000 | 0

  // 生成一张画有这个数字的图片
  res.set({
    'Content-Type': 'image/svg+xml'
  }).end(`<?xml version="1.0"?>
      <svg width="100" height="15" version="1.1"
xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="15">${req.session.recaptcha}</text>
    </svg>
  `)
})

// 手机验证
app.post('/mobile', function(req, res, next) {
  req.session.mobile = Math.random() * 1000000 | 0
  sendMsg(req.body.phoneNumber, 'mobile.tpl', req.session.mobile)
  res.json({
    done: true
  })
})

app.post('/register', function(req, res, next) {
  if (req.session.recaptcha == req.body.recaptcha) {
    res.send('验证码正确')
  } else {
    res.json({
      code: 8,
      msg: '验证码错误'
    })
  }
})

//页面放一个验证码的图片，加载页面的时候自动请求图片，生成一个验证码并放到该请求的session里，
//等提交时，用户输入的与该session里的做对比
app.use(function(req, res, next) {
  res.send(`
    <form action="/register" method="post">
      <input type="text" name="recaptcha" />
      <img width="30" height="15" src="/recaptcha-img" alt="" />
      <button>submit</button>
    </form>
  `)
})


//上传文件
var multer = require('multer')
var upload = multer({
  dest: './upload/'
})

app.post('/foo', upload.single('foofile'), function(req, res, next) {
  console.log(req.file)
  console.log(req.body)
})



app.listen(8899)