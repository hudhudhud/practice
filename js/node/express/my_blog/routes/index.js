var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const db = new Sequelize('sqlite://./blog.db');
const Blog = db.define('blog', {
  'title': Sequelize.STRING,
  'content': Sequelize.STRING(1234),
  //'by': Sequelize.STRING,
  'userId': Sequelize.STRING,
})
const User = db.define('user', {
  'name': Sequelize.STRING,
  'password': Sequelize.TEXT,
  'email': Sequelize.STRING,
})
const pageSize = 8

Blog.belongsTo(User)


/* GET home page. */
router.get('/', async(req, res, next) => {
  await db.sync()
  blogs = await Blog.findAndCountAll({
    include: [User],
    order: [
      ["createdAt", "desc"]
    ],
    offset: pageSize * (req.query.page ? req.query.page - 1 : 0),
    limit: pageSize
  })
  res.render('index', {
    title: "blog",
    blogs: blogs.rows,
    user: req.session.users ? req.session.users[req.signedCookies.blogUser] : null,
    allCount: blogs.count,
    currentPage: req.query.page ? req.query.page - 0 : 1,
    pageCount: Math.ceil(blogs.count / pageSize)
  })
})

router.get('/getList', async(req, res, next) => {
  await db.sync()
  blogs = await Blog.findAndCountAll({
    include: [User],
    order: [
      ["createdAt", "desc"]
    ],
    offset: pageSize * (req.query.page ? req.query.page - 1 : 0),
    limit: pageSize
  })
  user = await User.findById(req.signedCookies.blogUser)
  var obj = {
    title: "blog",
    blogs: blogs.rows,
    user: user,
    allCount: blogs.count,
    currentPage: req.query.page ? req.query.page - 0 : 1,
    pageCount: Math.ceil(blogs.count / pageSize)
  }
  res.json(obj)
})
module.exports = router;