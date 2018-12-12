var http = require("http")
  //Post
var request = http.request({
  hostname: "localhost",
  port: 8900,
  method: "POST", //提交数据
}, function(response) {
  response.on("data", function(chunk) {
    //process.stdout.write(chunk.toString()) //标准输出流，控制台
    chunk.pipe(process.stdout)
  })
})
request.write("hello server") //提交数据
request.end()


//Get
// var request = http.request({
//   hostname: "localhost",
//   path: "",
//   method: "GET",
//   headers: {
//     Accept: "text/html"
//   }
// }, function(response) {
//   console.log("server responded with status code", response.statusCode)
// })
// request.end()