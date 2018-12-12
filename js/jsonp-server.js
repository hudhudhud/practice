const net = require('net')
const url = require('url')

const port = 9090
  //服务器
net.createServer(conn => {
  conn.on('data', data => {
    var lines = data.toString().split('\r\n')
    var firstLine = lines[0]

    // firstLine = 'GET /laskjdf.html HTTP/1.1'

    var [, path] = firstLine.split(' ')

    /**
     * parsedUrl = {
     *   host:
     *   hostname:
     *   protocol:
     *   port:
     *   query: {
     *     a: 1,
     *     b: 2,
     *     callback: 'xxx',
     *   }
     * }
     */
    var parsedUrl = url.parse(path, true)

    var callbackName = parsedUrl.query.callback

    conn.write('HTTP/1.1 200 OOOOOOK\r\n')
    conn.write('Content-Type: application/javascript\r\n')
    conn.write('\r\n')
    conn.write(`${callbackName}(${JSON.stringify([1,2,3,4,5])})`)
    conn.end()
  })
})



.listen(port, function() {
  console.log('listening on', port)
})


//通过客户端给页面中添加一个script标签来请求某个js文件的数据，并在路径中指定callback的函数名称
//服务器接收到该请求后，会返回一个带回调函数名且参数为返回数据的字符串作为js内容
//作为js文件响应后，即立刻执行该回调函数，即实现了跨域请求的目的
//客户端
// 处理超时
// 处理错误
// 处理网络错误
// JSONP能不能发POST请求？？？不能！
function jsonp(url, option, successCb, timeoutCb, errorCb) {
  //保证回调函数名称在全局中唯一
  var cbName = '____JSONP_CALLBACK___' + Date.now() + Math.random().substr(2)
    //以防因successCB运行超时而导致执行下面的失败超时，所以加载成功即删除下面的超时操作
  window[cbName] = function(data) {
      clearTimeout(timerid)
      try {
        successCb(data)
      } finally {
        delete window[cbName]
        document.body.removeChild(script)
      }
    }
    // http://www.example.com/api?a=b&c=d&callback=?&e=f
  url = url + '?callback=' + cbName

  var script = document.createElement('script')
  script.src = url
  script.onerror = function() { //处理js内容加载错误或网络出错
    errorCb()
  }
  var timerid = setTimeout(function() { //处理加载超时
    timeoutCb()
    delete window[cbName]
    document.body.removeChild(script)
  }, 3e4)
  document.head.append(script)
}

// ____JSONP_CALLBACK_$$$_$$$___12345([1,2,3,4,5])


/**
- send jsonp request
- @param {String} url 需要请求的url
- @param {Object} params 请求时的参数，将会转换为querystring附带在url上
- @return {Promise} 返回一个Promise，成功的话传入请求到的数据，失败的话传入失败原因
  */
function jsonp2(url, params) {
  //回调函数名保证万一在很短的时间内连续调用两次，而函数名称被覆盖，所以用时间戳加随机数，随机数因为前两位为0.导致函数名不合法，所以截取后面的
  return new Promise((resolve, reject) => {
    var cbName = '____JSONP_CALLBACK___' + Date.now() + Math.random().substr(2)
    window[cbName] = function(data) {
      //服务器返回cbName({a:1,b:2})字符串，直接调用,所以在此调用resolve
      resolve(data)
      delete window[cbName]
    }
    var script = document.createElement("script")
    script.onerror((e) => {
      reject(e)
    })
    script.src = url.indexOf("?") < 0 ?
      url + "?callback=cbName&" + jQuery.param(params) :
      url + "&" + "?callback=cbName&" + jQuery.param(params)
    document.head.append(script)
  })
}