const net = require('net')
const fs = require("fs")
  //建立并返回一个表示该连接的对象
  //建立成功后调用回调函数
let conn = net.connect(6060, '192.168.31.223', function() {
  // conn.write('hello111')
  //   //当连接上有数据发过来的时候，调用回调函数
  //   //函数调用时会接收一个表示收到的数据的参数
  // conn.on('data', function(data) { //收到数据时调用
  //   console.log(data.toString())
  // })
  conn.pipe(fs.createWriteStream("aaaa.js"))
})