//查看当浏览器访问某个地址时，发送给服务了一些什么内容
//这里以本地8080端口为地址
//http://localhost:8080/
const net=require('net')//tcp
const port=8080
let server=net.createServer(function(conn){
  var addr=conn.address()
  console.log('received a client from ip:'+addr.address+" port:"+addr.port)
  console.log('received a client from ip:'+addr.remoteAddress+" port:"+addr.remotePort)
  conn.on('data',data=>{//服务器接收到客户端的消息后回调函数
    console.log(data.toString())
    // http协议是明文协议，存文本，在tcp协议上发送,所以说http是建立在tcp的基础上
    // Get / HTTP/1.1
    // Host: localhost:8080
    // Connection: keep-alive
    // Cache-Control: max-age=0
    // Upgrade-Insecure-Requests: 1
    // User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36
    // Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
    // Accept-Encoding: gzip, deflate, sdch, br
    // Accept-Language: zh-CN,zh;q=0.8

  })
  //以http响应的格式返回回去
  conn.write('HTTP/1.1 200 OK\r\n')          //http协议版本  返回状态码 
  conn.write('Date:2017/06/12 16:04:05.333z\r\n') //协议头，回车
  conn.write('\r\n')             //回车
  conn.write('<h1>Hello World!</h1>')  //页面内容
  conn.write((new Date()).toString())

  conn.end()

  conn.on('error',function(){})
})
server.on('error',function(){})
server.listen(port,function(){//监听
  console.log(`listening on port ${port}...`)
})