var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const db = new Sequelize('sqlite://./blog.db');
const User = db.define('user', {
  'name': Sequelize.STRING,
  'password': Sequelize.STRING,
  'email': Sequelize.STRING,
})

router.get('/', function(req, res, next) {
  res.render("login")
})

router.get('/out', function(req, res, next) {
  if (req.session.users && req.session.users[req.signedCookies.blogUser]) {
    delete req.session.users[req.signedCookies.blogUser]
  }
  console.log("useroooooooooooooooooo", req.session.users)
  res.clearCookie('blogUser')
  res.redirect('/')
})

router.post('/', async(req, res, next) => {
  await db.sync()
  var user = await User.findOne({
    where: {
      name: req.body.name,
      password: req.body.password,
    }
  })

  if (user) {
    //req.user = user
    res.cookie("blogUser", user.id, {
      signed: true
    })
    console.log("usersssssssssssssssssss", req.session)
    if (!req.session.users) {
      req.session.users = {}
    }
    console.log("useriiiiiiiiiiiiiiiiiii", req.session.users)
    req.session.users[user.id] = user
    console.log(req.session.users)
    res.redirect('/')
  } else {
    //req.user = null
    res.render("login", {
      error: "登录失败！"
    })
  }
})

module.exports = router