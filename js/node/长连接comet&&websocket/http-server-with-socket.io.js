// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);

// app.get('/', function(req, res) {
//   res.sendFile(__dirname + '/index.html');
// });

// io.on('connection', function(socket) {
//   console.log('a user connected');

//   socket.on('aaa', msg => {
//     console.log(msg)
//   })

//   socket.on('bbb', msg => {
//     console.log(msg)
//   })
// });

// http.listen(3000, function() {
//   console.log('listening on *:3000');
// });



const express = require('express')
const app = express()
const server = require('http').createServer(app)
const socketIO = require('socket.io')
const io = socketIO(server)

app.use(express.static('./socket.io'))


io.on('connection', function(socket) {
  console.log('a user connected');
  // serialize 序列化
  // deserialize 反序列化
  socket.on('event name', msg => {
    console.log('event name', msg)
    socket.emit('x', msg)
  })

  socket.on('chat message', msg => {
    console.log('chat message', msg)
  })

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});


server.listen(8877, () => {
  console.log(8877)
})


// app = express()

// app.use()
// app.use()
// app.use()

// app.listen(3000)