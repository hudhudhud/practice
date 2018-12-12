var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const db = new Sequelize('sqlite://./blog.db');
const Blog = db.define('blog', {
  'title': Sequelize.STRING,
  'content': Sequelize.STRING,
  'userId': Sequelize.INTEGER,
})


router.get('/', function(req, res, next) {
  console.log("lalalala:" + req.signedCookies.blogUser)
  if (req.signedCookies.blogUser) {
    res.render('add', {
      title: 'blog',
      user: req.session.users ? req.session.users[req.signedCookies.blogUser] : null
    })
  } else {
    res.redirect('/login')
  }
})

router.post('/', async(req, res, next) => {
  if (req.signedCookies.blogUser) {
    await db.sync()
    await Blog.create({
      title: req.body.title,
      content: req.body.content,
      userId: req.signedCookies.blogUser
    })
    res.redirect(302, '/')
  } else {
    res.redirect('login')
  }
})

router.get('/:id', async(req, res, next) => {
  await db.sync()
  var blog = await Blog.findById(req.params.id)
  res.render("add", {
    id: blog.id,
    blog: blog,
    user: req.session.users ? req.session.users[req.signedCookies.blogUser] : null
  })
})

router.post('/:id', async(req, res, next) => {
  await db.sync()
  var blog = await Blog.findById(req.params.id)
  blog.title = req.body.title
  blog.content = req.body.content
  await blog.save()
  res.redirect('/blog/' + req.params.id)
})
module.exports = router;