var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const db = new Sequelize('sqlite://./blog.db');
const User = db.define('user', {
  'name': {
    type: Sequelize.STRING,
    unique: true
  },
  'password': Sequelize.STRING,
  'email': Sequelize.STRING,
})


router.get('/', function(req, res, next) {
  res.render("registe")
})

router.post('/', async(req, res, next) => {
  await db.sync()
  var user = await User.findOne({
    where: {
      name: req.body.name
    }
  })

  if (user) {
    res.render("registe", {
      error: "用户名已存在！"
    })
  } else {
    await User.create({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email
    })
    var user = await User.findOne({
      where: {
        name: req.body.name
      }
    })
    if (user) {
      //req.user = user
      res.cookie("blogUser", user.id, {
        signed: true
      })
      if (!req.session.users) {
        req.session.users = {}
      }
      req.session.users[user.id] = user
      res.redirect("/")
    } else {
      res.render("registe", {
        error: "注册失败！"
      })
    }
  }
})

module.exports = router