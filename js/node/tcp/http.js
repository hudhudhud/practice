const net=require('net')
const port=8080
const server=net.createServer(function(conn){
  conn.on('data',data=>{
    console.log(data.toString())
  })
  conn.write("HTTP/1.1 200 OKK\r\n")
  conn.write("Content-Length:36\r\n")
  conn.write("Content-Type:text/html;charset=UTF-8\r\n")
  conn.write("\r\n")
  conn.write('<a href="http://www.baidu.com">百度</a>')
  conn.end()
})

server.listen(port,function(){
  console.log("listening on port",port)
})