const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const sqlite = require('sqlite')

const db = sqlite.open('./db/msg.db', {
  Promise: Promise
})

const port = 8080

const app = express()

app.locals.pretty = true

app.set('views', './tpl')
app.set('view engine', 'pug')

app.use('/static', express.static('./static'))

// req.cookies
// req.signedCookies
app.use(cookieParser('foobar'))

// req.body
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

// login middleware
app.use(async(req, res, next) => {
  var userid = req.signedCookies.userid || req.cookies.userid
  if (userid) {
    req.user = await sqlite.get('SELECT * FROM users WHERE id=' + userid)
    console.log(req.user)
    next()
  } else {
    req.user = null
    next()
  }
})

// GET /?page=3 HTTP/1.1
app.get('/', async(req, res, next) => {
  var page = req.query.page || 1
  var pageSize = 10
  var msgs = await sqlite.all('select messages.id as mid, leaveAt, leaveBy, replyTo, content, name from messages join users on users.id=leaveBy ORDER BY leaveAt DESC LIMIT ? OFFSET ?;', pageSize, (page - 1) * pageSize)
  var allMsgCount = (await sqlite.get('SELECT count(*) as count from messages;')).count
  console.log(msgs)
  res.render('index', {
    msgs,
    user: req.user,
    pages: Math.ceil(allMsgCount / pageSize),
    currPage: page,
  })
})

app.route('/login')
  .get(async(req, res, next) => {
    if (req.user) {
      res.redirect('/')
    } else {
      res.render('login')
    }
  })
  .post(async(req, res, next) => {
    console.log(req.body)
    var user = await sqlite.get(`SELECT * FROM users WHERE name=? AND password=?`, req.body.name, req.body.password)
    if (user) {
      res.cookie('userid', user.id, {
        signed: true
      })
      res.redirect('/')
    } else {
      res.render('login', {
        status: '登陆失败'
      })
    }
  })

app.post('/leave-msg', async(req, res, next) => {
  if (req.user) {
    await sqlite.run('INSERT INTO messages VALUES (null, ?,?,null, ?)', Date.now(), req.user.id, req.body.message)
    res.redirect('/')
  } else {
    res.status(403).end()
  }
})

app.get('/delete/:id', async(req, res, next) => {
  console.log(req.params.id)
    // req.params /delete/:id
    // req.query ?a=b&c=d
    // req.cookies/signedCookies
    // req.headers.cookie
    // req.body
  var msg = await sqlite.get('SELECT * FROM messages WHERE id=?', req.params.id)
  if (msg && req.user && req.user.id === msg.leaveBy) {
    await sqlite.run('DELETE FROM messages WHERE id=?', msg.id)
    res.redirect('/')
  } else {
    res.send(401)
  }
})

app.route('/register')
  .get(async(req, res, next) => {
    res.render('register')
  })
  .post(async(req, res, next) => {
    try {
      await sqlite.run('INSERT INTO users VALUES (null, ?, ?)', req.body.name, req.body.password)
      var user = await sqlite.get('SELECT * FROM users WHERE name=?', req.body.name)
      res.cookie('userid', user.id, {
        signed: true
      })
      res.redirect('/')
    } catch (e) {
      console.log(e)
      res.render('register', {
        status: '注册失败'
      })
    }
  })

app.get('/logout', async(req, res, next) => {
  res.clearCookie('userid')
  res.redirect('/')
})
db.then(done => {
  app.listen(port, () => {
    console.log('listening on port', port)
  })
}).catch(e => {
  throw e
})