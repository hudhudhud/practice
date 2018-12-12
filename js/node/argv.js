console.log(process.argv)// node argv.js 1 2 3 4

//证明当前代码是运行在一个函数里
console.log(arguments.callee.toString())
var a=1
console.log(global.a)  //undefined，说明作用域只在该函数内有用
return a  //return 没报错，说明是在函数里运行