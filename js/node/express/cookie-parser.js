const express = require('express')
const cookieParse = require('cookie-parser')

var app = express()

app.use(cookieParse("123")) //加密密码
app.use((req, res, next) => {
  console.log(req.cookies, req.signedCookies) //此时前者只有未加密的cookie项，后者为加密的cookie项，浏览器中cookie为加密后的值
  res.cookie("aa", "bb", {
    signed: true
  })
  next()
})

app.use((req, res, next) => {
  res.cookie('mm', 'tt', {
    expires: new Date(Date.now() + 3600000), //cookie过期时间为1个小时，时间为毫秒，控制台上显示的是utc时间,需要加8个小时为本地时间
    //domain: a.com, //把cookie设置到该域下，下次访问该域下的页面就会自动带上这个cookie
    httpOnly: true, //只有http请求才可以获取到cookie,以防止植入js盗取cookie数据
    path: "/a/b", //只在该路径下才有该cookie
  })
  res.send("cookie")
})

app.listen(1000, () => console.log('listening'))