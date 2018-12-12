var fs=require("fs")
var fns=[
 function(cb){
  setTimeout(function(){
    console.log(1)
    cb()
  },1000)
 },
 function(cb){
  setTimeout(function(){
    console.log(2)
    cb()
  },1000)
 },
 function(cb){
  setTimeout(function(){
    console.log(3)
    cb()
  },1000)
 },
]
var async={
  series:function(fns){//按顺序执行fns,即同步
    function*g(){
      for(fn of fns){
        yield fn
      }
    }
    var ger=g()
    d()
    function d(){
      var next=ger.next()
      if(typeof next.value=="function"){
        next.value(d)
      }
    }
  },
  parallel:function(fns,callback){//同时执行fns，执行完之后callback
    var okcount=0
    for(fn of fns){
      fn(function(){
        okcount++
        if(okcount==fns.length){
          callback()
        }
      })
    }
  },
  filter:function(col,iteratee,callback){//异步迭代col里所有项，iteratee是异步函数
    var ary=[]
    var completed=0
    for(let i=0;i<col.length;i++){
      iteratee(col[i],function(err, result) {
        if(result){
          //ary[i]=result
          ary.push(col[i])//此处用i没问题，因为for中的i为let，所以每次的i都在自己的闭包里
        }
        completed++
        if(completed==col.length){
          callback(null,ary)
          //callback(null,col.filter((item,index)=>ary[index]))
        }
      })
    }
  },
  map:function(col,iteratee,callback){//异步迭代col里的所有项，完成后callback，返回新数组
      var results=[]
      var completed = 0
      for(let i = 0;i<col.length; i++){
        iteratee(col[i], function(err, res) {
          results[i] = res
          completed++
          if(completed === col.length) {
            callback(null, results)
          }
        })
      }
  }
}
// async.series(fns)
// async.map(['test.html','bind.html','test.js'], fs.stat, function(err, results) {
//     console.log(results)
// });
async.filter(['test.html','bind1.html','test.js'], function(filePath, callback) {
    fs.access(filePath, function(err) {
        callback(null, !err)
    });
}, function(err, results) {
     console.log(results)
});