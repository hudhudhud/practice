ary.entries()  返回新数组对象，键值对
concat
Symbol.iterator

function.apply等同于...展开运算符
  如：Math.max.apply(null,[1,2,3])  ===》Math.max(...[1,2,3])

[1,2,3,4].map(obj.f,obj);//[0,0,0,0]，指定第二个参数为上下文的this

isEqual是深对比，a===b是浅对比
深对比  deep copy，对比值
浅对比  shallow copy  ，对比指针，在内存在是否为同一地址


concat  降维连接
slice  返回新数组，并不会改变原数组，即直接 return ary.concat(1) 或 return ary.slice()


排序算法！
插入排序


Object.getPrototypeOf(obj) ==> obj.__proto__  
Object.setPrototypeOf(obj,Function.prototype)

//两个构造函数实现继承，共享父类原型中的方法
Object.setPrototypeOf(Man.prototype,People.prototype)
Man.prototype.__proto__==People.prototype
Man.prototype=new People()
Man.prototype=Object.create(People.prototype)


Object.prototype.hasOwnProperty.call(object,key)

Object.getOwnPropertyDescriptor(obj, prop) 
Object.defineProperties() 
obj.hasOwnProperty("toString")

function f(a){this.a=a}
Object.defineProperty(f.prototype,"length",{enumerable:false,get(){return 2}})
a=new f(2)
a.length
==>2


图片格式

清除浮动的原因：
浮动元素的父元素高度塌陷，后来的元素会当浮动元素不存在
所以需要闭合浮动，即在浮动元素的父元素后增加块级伪元素，且clear:both，让其撑起父元素高度，使其不影响后来的元素的布局；或者触发BFC




restful!!
express
移动端怎么测试
photoshop


express 原理
app.use 即依次把后面的函数放到next部分，把所有函数组合成一个函数执行
即如果把所有要执行的函数依次放入一个数组里，且函数需要有个next参数，表示下一个执行的函数，且需要在函数内调用该next，那么，就是向右reduce，依次把数组项放入上一个数组的参数中并调用，并且返回一个新函数