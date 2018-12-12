var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')

var index = require('./routes/index')
var add = require('./routes/add')
var blog = require('./routes/blog')
var login = require('./routes/login')
var registe = require('./routes/registe')
var user = require('./routes/user')

var app = express()

app.locals.pretty = true

app.use(session({
  secret: 'hddh',
  resave: false,
  saveUninitialized: true,
  expires: 10 * 60 * 1000, //过期时间10分钟
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cookieParser('dhhd'))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  req.ttt = "123"
  next()
})

app.use('/', index)
app.use('/add', add)
app.use('/blog', blog)
app.use('/login', login)
app.use('/registe', registe)
app.use('/user', user)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})
app.listen(1000, () => console.log("listening"))

//module.exports = app 去掉该句再执行npm start就会出问题，因为www里文件里有调用该app模块,不过可以用node app.js