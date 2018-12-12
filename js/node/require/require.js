 // 循环引用解决方案：
 // 在模块开始解析之前， 就把表示模块的对象放入模块缓存中， 即使模块还没解析完， 就开始解析另一个模块，
 // 另一个模块又依赖了刚刚没有解析完的模块的话， 再次解析前一个模块就会直接从缓存中返回
 var fs = require("fs")
 global.myrequire = function myrequire(name) {
   if (name in myrequire.cache) {
     console.log("i m from cache " + name)
     return myrequire.cache[name]
   }
   var code = new Function('exports,module', fs.readFileSync('.\/' + name + ".js"))
     //当模块内部要返回多个函数或变量时，模块一般在对象exports上增加属性，否则若为直接量如函数无法把引用给exprots
   var exports = {}
     //当模块内部只有简单的一个函数或变量时，直接把module.exports指向该函数,
     //这样就避免了简单的一个函数还要放在其属性上的麻烦
   var module = {
       exports: exports
     }
     //先放缓存再执行code以防止循环引用，之后的修改直接是对缓存里的对象的修改
   myrequire.cache[name] = module.exports
   code(exports, module)

   return module.exports
 }

 //创建空原型的对象，防止cache中key值跟对象原型上的方法名称相同而出错，如Object.create({})["toString"]
 myrequire.cache = Object.create(null)
 var m = myrequire("week-day")
 console.log(m.name(m.number("Sunday")))
 console.log(m.monthName(m.monthNumber("March")))
 console.log(myrequire.cache)
   //console.log(requireName)
 m = myrequire("week-day")
 console.log(m.name(m.number("Sunday")))
   // var sum=myrequire("add")
   // console.log(sum(100,100))