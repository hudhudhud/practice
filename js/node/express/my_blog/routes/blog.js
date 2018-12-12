var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const db = new Sequelize('sqlite://./blog.db');
const Eval = db.define('eval', {
  'content': Sequelize.STRING,
  'userId': Sequelize.STRING,
  'blogId': Sequelize.INTEGER,
})

const Blog = db.define('blog', {
  'title': Sequelize.STRING,
  'content': Sequelize.STRING,
  'userId': Sequelize.STRING,
})

const User = db.define('user', {
  'name': Sequelize.STRING,
  'password': Sequelize.STRING,
  'email': Sequelize.STRING,
})

Blog.belongsTo(User)
Eval.belongsTo(User)

router.get('/:id', async(req, res, next) => {
  console.log("ttttttttt:", req.ttt)
  await db.sync()
  var blog = await Blog.findById(req.params.id)
  var evals = await Eval.findAll({
    include: [User],
    where: {
      blogId: req.params.id
    },
    order: [
      ["createdAt", "desc"]
    ]
  })
  res.render("blog", {
    blog: blog,
    evals: evals,
    user: req.session.users ? req.session.users[req.signedCookies.blogUser] : null
  })
})

router.post('/:id', async(req, res, next) => {
  await db.sync()
  await Eval.create({
    content: req.body.content,
    userId: req.signedCookies.blogUser,
    blogId: req.params.id,
  })
  res.redirect(302, '/blog/' + req.params.id)
})

router.get('/delete/:id', async(req, res, next) => {
  var user = req.session.users ? req.session.users[req.signedCookies.blogUser] : null
  if (user && blog.id == user.id) {
    await db.sync()
    var blog = await Blog.findById(req.params.id)
    await blog.destroy()
    res.render("blog", {
      message: "删除成功！"
    })
  } else {
    if (user) {
      res.render("blog", {
        message: "您无权删除！"
      })
    } else {
      setTimeout(res.redirect(302, '/login'), 5000)
    }
  }
})

module.exports = router