const {
  Readable,
  Writable,
  Duplex,
  Transform
} = require('stream')

const fs = require('fs')


class ReadableCounterStream extends Readable {
  constructor(n) {
    super()
    this.n = n
    this.current = 0
  }

  // 外界需要从此流中读取数据
  // 在必要的时候，流的调度系统会调用这个函数
  // 此函数只需调用this.push(data)
  // 把想要提供给使用的数据放入流的缓存区
  _read(size) {
    console.log('_read')
    if (this.current < this.n) {
      this.push((this.current++).toString() + 'a')
    } else {
      this.push(null)
    }
  }
}

var counterStream = new ReadableCounterStream(10)
counterStream.on('data', function(data) {
  console.log(data.toString())
})


// stream = fs.createWriteStream('a.txt')
// stream.write('aaa')


class FileWriter extends Writable {
  constructor(filename) {
    super();
    this.filename = filename
  }

  // 外界会往此流中写入数据
  // 此流必须要把这些数据处理掉
  // 在必要的时候（如流的缓存区满）
  // 流的调度系统会调用这个函数并传入数据
  // 此函数处理完这些数据后调用cb以告知调度系统
  // 此段数据已处理完成
  _write(chunk, encoding, cb) {
    fs.appendFile(this.filename, chunk, function() {
      cb()
    })
  }
}

var fileWriter = new FileWriter('a.txt')
fileWriter.write('aaa\n')
fileWriter.write('bbbb\n')
fileWriter.end()


class ToUpperStream extends Transform {
  constructor() {
    super()
  }

  _transform(chunk, encoding, cb) {
    var transformd = chunk.toString().toUpperCase()
    cb(null, transformd)
  }
}

new ReadableCounterStream(100)
  .pipe(new ToUpperStream())
  .pipe(new FileWriter('b.txt'))

// var counter = new ReadableCounterStream(100)
// console.log(counter.read())


class ObjectStream extends Readable {
  constructor() {
    super({
      objectMode: true
    })
    this.n = 0
  }

  _read() {
    if (this.n < 10) {
      this.push({
        value: this.n++
      })
    } else {
      this.push(null)
    }
  }
}

// new ObjectStream()
//   .on('data', function(obj) {
//     console.log(obj)
//   })

var readable = new Readable({
  read() {
    this.push(Math.random() < 0.7 ? '2' : null)
  }
})

readable.on('data', data => {
  console.log(data)
})