const express = require("express")
const path = require("path")
const detail = require("./detail")
const port = 9100

app = express()

console.log(process.cwd()) //node运行工作目录
console.log(__dirname) //文件当前目录
  //需要考虑content-type
function static(dir) {
  return function(req, res, next) {
    var file = path.join(dir, req.url)
    try {
      fs.accessSync(file)
      fs.createReadStream(file).pipe(res)
    } catch (e) {
      next()
    }
  }
}

//app.use(static('/asset'))支持高阶函数，即返回函数给他

//已考虑content-type,默认找路径下的index.html,若找不到，则到下一个static找，否则不处理
app.use(express.static(path.join(__dirname, 'public'))) //文件当前目录，否则都为相对node命令运行的路径
  // app.use(express.static("public"))
  //app.use("/xxx", express.static("mypublic")) //虚拟路径xxx，输入路径时需要输入xxx,不需要输入mypublic
app.use(express.static("mypublic"))

//在该路径下执行中间件
// app.use("/xx", function(req, res, next) {})

// app.use(function(req, res, next) {
//   if (req.url == "/favicon.ico") {
//     return
//   }
//   console.log(req.url)
//   next()
// })


app.use((req, res, next) => {
    if (req.url == "favicon.ico") {
      return
    }
    console.log(req.url)
    next()
  })
  //get中可以用正则
  //:后只匹配([A-Za-z0-9_])，即\w
  //id只允许为整数，所以后面增加(\\d+)，双重转义
app.get("/news/:id(\\d+)/:name", (req, res, next) => {
  res.send(req.params.id + " " + req.params.name)
})

app.get("/fly/:from-:to", (req, res, next) => {
  req.from = req.params.from
  req.to = req.params.to
    //console.log(res.send.toString())
  res.send(req.params.from + " " + req.params.to)
  next()
}, (req, res, next) => {
  console.log(req.from, req.to)
})

//Content-Disposition:attachment; filename="download.txt"
app.get("/download/1", (req, res, next) => {
  console.log("download")
  res.download("./public/1.txt", "download.txt") //需要加"."，因为下载的根目录是从当前工作盘，即C盘开始
})

// typeof xxx === 'function' && xxx({"a":1,"b":2});
// 可以用作api接口
app.get("/weather", (req, res, next) => {
  res.jsonp({
      'a': 1,
      'b': 2,
    })
    // res.json({
    //   'a': 1,
    //   'b': 2,
    // })
})

//模块化，将detail路径下的操作都放到一个模块下去
app.use("/detail", detail)


app.use("/login",(req,res,next)=>{
  res.jsonp({
      'a': 1,
      'b': 2,
    })
})

app.use(function(req, res, next) {
  next(new Error())
})

app.use(function(error, req, res, next) {
  res.redirect(302, '/default.html') //相对当前url的根
})

app.listen(port, () => {
  console.log("listening on port", port)
})

