//https://promisesaplus.com/ promiseA+标准
//当您从 then() 回调中返回某些内容时，如果返回一个值，则会以该值调用下一个 then()。
//但是，如果您返回类似于 promise 的内容，下一个 then() 则会等待，并仅在 promise 产生结果（成功/失败）时调用


//Promise构造函数内是操作函数，会立即执行，执行后面的then需要回调resolve或reject，否则就算return值也不会往后执行
//可以理解为request.send()之后的回调函数load与error


p.then(f2) //==>p成功则执行f2,f2若失败则执行f3;p失败也执行f3
  .catch(f3)

//如下
new Promise((res, rej) => {
    res(2)
  })
  .then(v => {
    throw v
  })
  .catch(v => console.log("rej" + v))

new Promise((res, rej) => {
    rej(2)
  })
  .then(v => console.log("res" + v))
  .catch(v => console.log("rej" + v))

p.then(f2, f3) //==>p成功则f2,失败则f3

//jquery中的promise ===> deferred
function get(url) {
  var deferred = $.Deferred()
  $.get(url, function(data) {
      deferred.resolve(data)
    },
    function(e) {
      deferred.reject(e)
    })
  return deferred.promise()
}

//实现jquey中的deferred
Promise.deferred = function(resolve, reject) {
  var deferred = {}
  deferred.promise = new Promise(function(resolve, reject) {
    deferred.resolve = resolve
    deferred.reject = reject
  })
  deferred.then = deferred.promise.then.bind(deferred.promise)
  return deferred
}

//promise的构造函数，所以如果在promise中直接throw，即reject throw的值，
//如果在异步函数里throw，promise没办法捕捉到该错误，因为throw是在程序运行了n行之后才执行的，所以不要这么做，直接在异步函数里reject就可
function promise(executor) {
  try {
    executor(resolve, reject)
  } catch (e) {
    reject(e)
  }
}

//封装Promise，方便直接调用之后的then内的resolve
Promise.resolve = function(value) {
  return new Promise(function(resolve) {
    resolve(value) //后没有then，resolve相当于调用了it=>it的函数，结果promise的值即为value
  })
}

//封装Promise，方便直接调用之后then内的reject
Promise.reject = function(reason) {
  return new Promise(function(_, reject) {
    reject(value) //后没有then，reject相当于调用了it=>throw it的函数，结果就是抛出异常value
  })
}

//图片一张一张下载可以写成即
function downloadImgPromise(url) {
  return new Promise(function(resolve, reject) {
    var img = new Image()
    img.onload = function() {
      resolve()
    }
    img.onerror = function(e) {
      reject(e)
    }
    img.src = url
  })
}

urls.reduce(function(promise, url) {
  return promise.then(function() {
    return downloadImgPromise(url) //需要返回,因为返回的是个promise，所以下个then的执行取决于这个promise什么时候执行完，否则会当成return undefined来立刻执行下一个then
  })
}, new Promise(resolve => resolve()))

//可改为
urls.reduce(function(promise, url) {
  return promise.then(function() {
    return downloadImgPromise(url)
  })
}, Promise.resolve())


//把函数转换为promise
Promise.promisify = function(f) {
  return function(...args) {
    return new Promise(function(resolve, reject) {
      f(...args, function(err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
}
readFile = Promise.promisify(fs.readFile)

//Promise.all的实现原理，传入的promises组中，每一个都成功执行才执行回调函数resolve，否则reject
Promise.all = function(promises) {
  return new Promise(function(resolve, reject) {
    var result = []
    var count = 0
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(function(value) {
        result[i] = value
        count++
        if (count === promises.length) {
          resolve(result)
        }
      }, function(reason) {
        reject(reason)
      })
    }
  })
}

//Promise.race的实现原理，传入的promises组中，一旦有一个成功则马上执行回调函数resolve，否则reject
Promise.race = function(promises) {
  return new Promise(function(resolve, reject) {
    var result = []
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(function(value) {
        resolve(value)
      }, function(reason) {
        reject(reason)
      })
    }
  })
}

//whenReady可以如下实现
var whenReady = (function() {
  var domReadyPromise = new Promise(function(resolve) { //立刻执行
    //resolve只会在第一次执行的时候有效，即以下只要任意一个事件被调用之后，其他事件就算完成了调用resolve也不会有效果
    document.addEventListener('DOMContentLoaded', function() {
      resolve()
    })
    document.addEventListener('readystatechange', function() {
      if (document.readyState === 'complete') {
        resolve()
      }
    })
    window.addEventListener('load', function() {
      resolve()
    })
  })

  return function whenReady(f) {
    domReadyPromise.then(f)
  }
}())



//用generator操作Promise来实现异步
//原理：next之后执行promise等到状态确定，即执行then表示完成，同时把promise的状态通过next传回到yield语句，然后返回到yield语句的左边
//手动操作
function* gen() {
  console.log(0)
  var a = yield Promise.resolve(1)
  console.log(a)
  var b = yield Promise.resolve(2)
  console.log(b)
}

var iter = gen()
p = iter.next().value //p为promise
p.then(function(value) { //value即为p成功执行后的值
  p = iter.next(value).value
})

//自动化  
function run(genFn) {
  return new Promise(function(resolve) {
    var iter = genFn();
    (function x(value) {
      var gened = iter.next(value) //把promise中成功执行的值传给next，这样yield返回的值即为该参
      if (!gened.done) {
        gened.value.then(x, //gened的value是个promise，如果执行成功，则即默认把value传给x然后执行x,x内参数即为成功执行的值
          function(e) { //失败
            gened.throw(e)
          })
      } else {
        resolve(gened.value)
      }
    }())
  })
} //返回promiss,后继续then

//or
function run(g) {
  return new Promise((resolve, reject) => {
    var iter = g()
    x()

    function x(val) {
      var gened = iter.next(val)
      if (gened.done) {
        resolve(gened.value)
      } else {
        if (gened.value instanceof Function) {
          gened.value(x)
        } else {
          gened.value.then(x, y)
        }
      }
    }

    function y(reason) {
      var gened = iter.throw(reason)
      if (gened.done) {
        resolve(gened.value)
      } else {
        if (gened.value instanceof Function) {
          gened.value(x)
        } else {
          gened.value.then(x, y)
        }
      }
    }
  })
}

function getVal(val, timeout) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve(val)
    }, timeout)
  })
}

//执行
run(function*() {
    try {
      var a = yield getVal(1, 3000)
      console.log(a)
    } catch (e) {
      console.log(e)
    }
    var b = yield getVal(2, 5000)
    console.log(b)
  })
  .then(
    function(val) {
      console.log(val)
    },
    function(val) {
      console.log(val)
    })

//callback实现了promise,genrator实现了async

// async function
// 异步函数，返回promise对象，await后接promise对象,也可接async函数
// 相对于用then代码看起来更像同步代码，容易维护，且内部的变量都可以访问
// generator run的封装,先执行，同步到不能同步的地方，先执行异步函数外的代码，同generate原理
async function f() {
  console.log(1)
  var imgs = await Promise.all([p1, p2, p3, p4]) //多个图片同时下载

  var a = await new Promise(resolve => {
    setTimeout(function() {
      resolve(2)
    }, 3000)
  })
  console.log(a)
}
f()
console.log(3)

// 1
// 3
// 2

//封装XMLHttpRequest
function get(url) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest()
    req.open('GET', url)

    req.onload = function() {
      if (req.status == 200) {
        resolve(req.response)
      } else {
        reject(Error(req.statusText));
      }
    }
    req.onerror = function() {
      reject(Error("Network Error"))
    }
    req.send()
  })
}

function getJSON(url) {
  return get(url).then(JSON.parse)
}

async function x(url) {
  var json = await getJSON(url)

}


//示例1
new Promise((resolve, reject) => {
  reject(1)
}).then(value => {
  console.log(value)
}).catch(reason => {
  console.log(reason)
  Promise.resolve(3).then(value => {
    console.log(value)
  })
}).then(value => {
  console.log(value)
}, reason => {
  console.log(reason)
})

// 输出：
// 1
// 3
// undefined

//示例2
function getValueAfter(v, d) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve.bind(null, v), d)
  })
}
async function f1() {
  var a = await getValueAfter(4, 1000)
  var b = await getValueAfter(5, 1000)
  return a + b
}
async function f2() {
  var a = getValueAfter(4, 1000)
  var b = getValueAfter(5, 1000)
  return await a + await b
}
f1().then(v => {
  console.log(v)
})
f2().then(v => {
    console.log(v)
  })
  // 1 s后f2输出 9
  // 2 s后f1输出 9