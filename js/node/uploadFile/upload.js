var express = require('express')
var app = express()
var port = 8800
  //上传文件
var multer = require('multer')
var upload = multer({
  dest: './upload/'
})

app.use(express.static("./"))

//multer还支持多个文件，多组按钮上传
app.post('/foo', upload.single('imgimg'), function(req, res, next) {
  console.log(req.file)
  console.log(req.body)
  res.json({success:"ok"})
})

app.listen(port, () => console.log("listening on ", port))