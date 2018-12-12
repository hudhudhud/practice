var express = require('express')
var router = express.Router()
const Sequelize = require('sequelize')
const db = new Sequelize('sqlite://./blog.db')
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

router.get('/:id', async(req, res, next) => {
  await db.sync()
  user = await User.findById(req.params.id)
  blogs = await Blog.findAndCountAll({
    where: {
      userId: req.params.id
    },
    include: [User],
    order: [
      ["createdAt", "desc"]
    ],
    offset: 5 * (req.query.page ? req.query.page - 1 : 0),
    limit: 5,
  })
  res.render('user', {
    blogs: blogs.rows,
    user: user,
    allCount: blogs.count,
    currentPage: req.query.page ? req.query.page - 0 : 1,
    pageCount: Math.ceil(blogs.count / 5)
  })
})

router.get('/:id/getUserBlog', async(req, res, next) => {
  await db.sync()
  user = await User.findById(req.params.id)
  blogs = await Blog.findAndCountAll({
    where: {
      userId: req.params.id
    },
    include: [User],
    order: [
      ["createdAt", "desc"]
    ],
    offset: 5 * (req.query.page ? req.query.page - 1 : 0),
    limit: 5,
  })
  var obj = {
    blogs: blogs.rows,
    user: user,
    allCount: blogs.count,
    currentPage: req.query.page ? req.query.page - 0 : 1,
    pageCount: Math.ceil(blogs.count / 5)
  }
  res.json(obj)
})
module.exports = router;