const http = require("http")
const fs = require("fs")
const zlib = require('zlib')
const port = 9090
const gzip = zlib.createGzip()

//压缩文件，gzip为双工流，即可写入，也可读
fs.createReadStream('http_server.js')
  .pipe(gzip)
  .pipe(fs.createWriteStream('x.js.gz'))


var server = http.createServer()
server.on("request", (request, response) => {

  var readStream = fs.createReadStream("./http_server.js")

  readStream.on('error', () => response.end())

  //同on data，on end,但是没发出之前就不再读数据，所以比on data快
  //可读流传到可写流
  //双工流 duplx  可读可写，如tcp
  readStream.pipe(response)

  //copy操作
  var writeStream = fs.createWriteStream("x.js")
  readStream.pipe(writeStream)

  // readStream.on('data', data => response.write(data)) //每收到64kb数据就触发该事件，一边接数据一边写，类似下载视频一边看一边下载
  readStream.on('end', () => {
    response.end()
    writeStream.end()
  })
})
server.listen(port, () => console.log("listening on port ", port))