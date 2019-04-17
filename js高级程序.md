#####defer async
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>test</title>
  </head>
  <body>
    <div id="app">hello</div>
    <!--defer 这个属性的用途是表明脚本在执行时不会影响页
        面的构造。也就是说，脚本会被延迟到整个页面都解析完毕后再运行。因此，在<script>元素中设置
        defer 属性，相当于告诉浏览器立即下载，但延迟执行,将延迟
        到浏览器遇到</html>标签后再执行 -->
    <script src='a.js' defer></script>
    <!-- 指定 async 属性的目的是不让页面等待两个脚本下载和执行，从而异步加载页面其他内容。
        为此，建议异步脚本不要在加载期间修改 DOM。
        异步脚本一定会在页面的 load 事件前执行，但可能会在 DOMContentLoaded 事件触发之前或之
        后执行。 -->
    <script src='b.js' ></script>
    <script>
        
    </script>
  </body>
</html>

```
typeof null 
"object"

//基本数据类型包括 Undefined、 Null、 Boolean、 Number 和 String。

null==undefined 
true

NaN==NaN
false

isNaN(NaN) //内部参数不能转换为数字则为true
true

011 //八进制
9

0xf //16进制
15

Number(0xf) //如果字符串是十六进制格式，例如"0xf"，则将其转换为相同大小的十进制整数值；
15

Number('22xx')
NaN

parseInt('22xx')  //parseInt()函数在转换字符串时，更多的是看其是否符合数值模式。它会忽略字
22                  符串前面的空格，直至找到第一个非空格字符。如果第一个字符不是数字字符或者负号， parseInt()
                    就会返回 NaN；也就是说，用 parseInt()转换空字符串会返回 NaN（Number()对空字符返回 0）。
                    
                    如果第一个字符是数字字符，parseInt()会继续解析第二个字符，直到解析完所有后续字符或者遇到了
                    一个非数字字符。

parseInt('0xf')  //不指定基数意味着让 parseInt()决定如何解析输入的字符串，因此为了避免错误的解析，我们建议无论在什么情况下都明确指定基数。
15

parseInt('0xf',10)
0

parseFloat('0.123.443') //字符串中的第一个小数点是有效的，而第二个小数点就是无效的了，因此它后面的字符串将被忽略
0.123

parseFloat("0908.5"); //它始终都会忽略前导的零
908.5

parseFloat('0x123.33') //十六进制格式的字符串则始终会被转换成 0
0

parseFloat("3.125e7") //如果字符串包含的是一个可解析为整数的数（没有小数点，或者小数点后
31250000                都是零）， parseFloat()会返回整数

(10).toString(2) //数值、布尔值、对象和字符串值（没错，每个字符串也都有一个 toString()方法，该方法返回字
1010              符串的一个副本）都有 toString()方法。通过传递基数， toString()可以输出以二进制、八进制、十六进制

null.toString()  //但 null 和 undefined 值没有这个方法
Cannot read property 'toString' of null

String(null)  //够将任何类型的值转换为字符串,不至于报错
'null'

//在对非数值应用一元加操作符时，该操作符会像 Number()转型函数一样对这个值执行转换
var s1 = "01";
var s2 = "1.1";
var s3 = "z";
var b = false;
var f = 1.1;
var o = {
  valueOf: function() {
    return -1;
  }
};
s1 = +s1; // 值变成数值 1
s2 = +s2; // 值变成数值 1.1
s3 = +s3; // 值变成 NaN
b = +b; // 值变成数值 0
f = +f; // 值未变，仍然是 1.1
o = +o; // 值变成数值-1

==  相等和不相等——先转换再比较 
=== 全等和不全等——仅比较而不转换
var result1 = ("55" == 55); //true，因为转换后相等
var result2 = ("55" === 55); //false，因为不同的数据类型不相等
null == undefined  //true
null === undefined //false
0==''  //true
0==='' //false

//逗号操作符，在用于赋值时，逗号操作符总会返回表达式中的最后一项
var num = (5, 1, 4, 8, 0); // num 的值为 0

//label语句
 var num = 0;
  outPoint:
  for (var i = 0 ; i < 5 ; i++){
    for (var j = 0 ; j < 5 ; j++){
        if( i == 2 && j == 2 ){
          break outPoint; //跳出双层循环
        }
      num++;
    }
  }
  console.log(num); //12

  //switch
    如果省略 break 关键字，
    就会导致执行完当前 case 后，继续执行下一个 case。最后的 default 关键字则用于在表达式不匹配前
    面任何一种情形的时候，执行机动代码（因此，也相当于一个 else 语句）。

    从根本上讲， switch 语句就是为了让开发人员免于编写像下面这样的代码：
    if (i == 25){
      alert("25");
    } else if (i == 35) {
      alert("35");
    } else if (i == 45) {
      alert("45");
    } else {
      alert("Other");

    }
    而与此等价的 switch 语句如下所示：
    switch (i) {
      case 25:
        alert("25");
        break;
      case 35:
        alert("35");
        break;
      case 45:
        alert("45");
        break;
      default:
        alert("Other");
    }

//arguments
因为 arguments
对象中的值会自动反映到对应的命名参数，所以修改 arguments[0]，也就修改了 m，结果它们的
值都会变成 2。不过，这并不是说读取这两个值会访问相同的内存空间；它们的内存空间是独立的，但
它们的值会同步。严格模式下则不同步
    function a(m,n){
      arguments[0]=2
      console.log(m,n)
    }
    a(1,2) // 2 2
    
    "use strict"
    function a(m,n){
      arguments[0]=2
      console.log(m,n)
    }
    a(1,2) // 1 2


//访问变量有按值和按引用两种方式，而参数只能按值传递。
为了证明对象是按值传递的，我们再看一看下面这个经过修改的例子：
function setName(obj) {
    obj.name = "Nicholas";
    obj = new Object();
    obj.name = "Greg";
}
var person = new Object();
setName(person);
alert(person.name); //"Nicholas"
这个例子与前一个例子的唯一区别，就是在 setName()函数中添加了两行代码：一行代码为 obj
重新定义了一个对象，另一行代码为该对象定义了一个带有不同值的 name 属性。在把 person 传递给
setName()后，其 name 属性被设置为"Nicholas"。然后，又将一个新对象赋给变量 obj，同时将其 name
属性设置为"Greg"。如果 person 是按引用传递的，那么 person 就会自动被修改为指向其 name 属性值
为"Greg"的新对象。但是，当接下来再访问 person.name 时，显示的值仍然是"Nicholas"。这说明
即使在函数内部修改了参数的值，但原始的引用仍然保持未变。实际上，当在函数内部重写 obj 时，这
个变量引用的就是一个局部对象了。而这个局部对象会在函数执行完毕后立即被销毁。


//类型检测
typeof 1  //基本类型
person instanceof Object  //引用类型

//在 Web 浏览器中，全局执行环境被认为是 window 对象，因
此所有全局变量和函数都是作为 window 对象的属性和方法创建的。

某个执行环境中的所有代码执行完毕后，该环境被销毁，
保存在其中的所有变量和函数定义也随之销毁（全局执行环境直到应用程序退
出——例如关闭网页或浏览器——时才会被销毁）。

每个函数都有自己的执行环境。当执行流进入一个函数时，函数的环境就会被推入一个环境栈中。
而在函数执行之后，栈将其环境弹出，把控制权返回给之前的执行环境


每个环境都可以向上搜索作用域链，以查询变量和函数名；
但任何环境都不能通过向下搜索作用域链而进入另一个执行环境。

JavaScript 没有块级作用域，即
if (true) {
  var color = "blue";
}
alert(color); //"blue"
其他语言都只能在if块内部才能访问到color

如果初始化变量时没有使用 var 声明，该变量会自动被添加到全局环境

#####作用域链
当在某个环境中为了读取或写入而引用一个标识符时，必须通过搜索来确定该标识符实际代表什
么。搜索过程从作用域链的前端开始，向上逐级查询与给定名字匹配的标识符。如果在局部环境中找到
了该标识符，搜索过程停止，变量就绪。如果在局部环境中没有找到该变量名，则继续沿作用域链向上
搜索。搜索过程将一直追溯到全局环境的变量对象。如果在全局环境中也没有找到这个标识符，则意味
着该变量尚未声明。


#####垃圾回收：
  ######标记回收（mark-and-sweep）：
    当变量进入环境（例如，在函数中声明一个变量）时，就将这个变量标记为“进入环境”。从逻辑上讲，永远不能释放进入环境的变
    量所占用的内存，因为只要执行流进入相应的环境，就可能会用到它们。而当变量离开环境时，则将其标记为“离开环境”。
    垃圾收集器在运行的时候会给存储在内存中的所有变量都加上标记（当然，可以使用任何标记方式）。
    然后，它会去掉环境中的变量以及被环境中的变量引用的变量的标记。而在此之后再被加上标记
    的变量将被视为准备删除的变量，原因是环境中的变量已经无法访问到这些变量了。最后，垃圾收集器
    完成内存清除工作，销毁那些带标记的值并回收它们所占用的内存空间。
  ######引用计数（reference counting）：（有循环引用问题）
    跟踪记录每个值被引用的次数。当声明了一个变量并将一个引用类型值赋给该变量时，则这个值的引用次数就是 1。
    如果同一个值又被赋给另一个变量，则该值的引用次数加 1。相反，如果包含对这个值引用的变量又取
    得了另外一个值，则这个值的引用次数减 1。当这个值的引用次数变成 0 时，则说明没有办法再访问这
    个值了，因而就可以将其占用的内存空间回收回来。这样，当垃圾收集器下次再运行时，它就会释放那
    些引用次数为零的值所占用的内存。

优化内存占用的最佳方式，就是为执行
中的代码只保存必要的数据。一旦数据不再有用，最好通过将其值设置为 null 来释放其引用——这个
做法叫做解除引用（dereferencing）。这一做法适用于大多数全局变量和全局对象的属性。局部变量会在
它们离开执行环境时自动被解除引用，
函数中的局部变量在函数执行完毕后就离开了其执行环境，因此无需我们显式地去为它解除引用。

解除一个值的引用并不意味着自动回收该值所占用的内存。解除引用的真正作用是让值脱离
执行环境，以便垃圾收集器下次运行时将其回收。

离开作用域的值将被自动标记为可以回收，因此将在垃圾收集期间被删除。
“标记清除”是目前主流的垃圾收集算法，这种算法的思想是给当前不使用的值加上标记，然
后再回收其内存。


数组的 length 属性很有特点——它不是只读的
var colors = ["red", "blue", "green"]; // 创建一个包含 3 个字符串的数组
colors.length = 2;
alert(colors[2]); //undefined


如果数组中的某一项的值是 null 或者 undefined，那么该值在 join()、
toLocaleString()、 toString()和 valueOf()方法返回的结果中以空字符串表示。

[null,1,undefined].join()
",1,"

ary.push(item1,item2)   =>返回ary数组长度
ary.pop()               =>返回弹出的最后一项
ary.shift()             =>返回弹出的第一项
ary.unshift(item1,item2) =>返回ary数组长度

sort()方法会调用每个数组项的 toString()转型方法！！！！，然后比较得到的字符串，以
确定如何排序。即使数组中的每一项都是数值， sort()方法比较的也是字符串，如下所示。
var values = [0, 1, 5, 10, 15];
values.sort();
alert(values); //0,1,10,15,5

//若要数值类型比较，则需自己定义比较函数
比较函数接收两个参数，如果第一个参数应该位于第二个之后则返回一个正数,否则返回一个负数
function compare(value1, value2) {
  if (value1 < value2) {
    return -1;
  } else if (value1 > value2) { //大的在后面
    return 1;
  } else {
    return 0;
  }
}
或
function compare(value1, value2){
  return value2 - value1;
}

values.sort(compare);
alert(values); //0,1,5,10,15

concat()  不改变原数组，返回新数组
slice(index,len)   不改变原数组，返回新数组
splice(index,len,replace)  改变原数组，返回删除的项数组，若没有删除的项，返回空数组
 
Date 类型的 valueOf()方法，不返回字符串，而是返回日期的毫秒表示。因此，可以
方便使用比较操作符（小于或大于）来比较日期值。请看下面的例子。

```js
var date1 = new Date(2007, 0, 1); //"January 1, 2007"
var date2 = new Date(2007, 1, 1); //"February 1, 2007"
alert(date1 < date2); //true
alert(date1 > date2); //false
```

正则 开启s标志匹配任意字符
/./.test('\n')
false
/./s.test('\n')
true


由于 RegExp 构造函数的模式参数是字符串，所以在某些情况下要对字符进行双重转义。所有元字符都必须双重转义，那
些已经转义过的字符也是如此，例如\n（字符\在字符串中通常被转义为\\，而在正则表达式字符串中就
会变成\\\\）。下表给出了一些模式，左边是这些模式的字面量形式，右边是使用 RegExp 构造函数定义
相同模式时使用的字符串。

字面量模式          等价的字符串
/\[bc\]at/         "\\[bc\\]at"
/\.at/             "\\.at"
/name\/age/        "name\\/age"
/\d.\d{1,2}/       "\\d.\\d{1,2}"
/\w\\hello\\123/   "\\w\\\\hello\\\\123"

```js
//例：
a=new RegExp("\\[bc\\]at")
a.toString()  //==>"/\[bc\]at/"
a.test('[bc]at')// ==》true
```

####函数

解析器会率先读取函数声明，并使其在执行
任何代码之前可用（可以访问）；至于函数表达式，则必须等到解析器执行到它所在的代码行，才会真
正被解释执行。请看下面的例子。

```js
alert(sum(10,10)); //20
function sum(num1, num2){
    return num1 + num2;
}

alert(sum(10,10));//sum is not a function
var sum = function(num1, num2){
  return num1 + num2;
};

//函数的名字仅仅是一个包含指针的变量而已
//用arguments.callee消除函数与factorial名称的紧密偶尔，
function factorial(num){
  if (num <=1) {
   return 1;
  } else {
   return num * arguments.callee(num-1)
  }
}
```

在函数内部，有两个特殊的对象： arguments 和 this。
每个函数都包含两个属性： length 和 prototype
对于ECMAScript 中的引用类型而言， prototype 是保存它们所有实例方法的真正所在。换句话说，诸如
toString()和 valueOf()等方法实际上都保存在 prototype 名下，只不过是通过各自对象的实例访
问罢了。


#####基本包装类型 Boolean、 Number 和 String
每当读取一个基本类型值的时候，后台就会创建一个对应的基本包装类型的对象，从而让我们
能够调用一些方法来操作这些数据
```js
var s1 = "some text";
var s2 = s1.substring(2);
```
在运行第二行代码时，后台已经自动完成了一系列的处理
(1) 创建 String 类型的一个实例；
(2) 在实例上调用指定的方法；
(3) 销毁这个实例。
可以将以上三个步骤想象成是执行了下列 ECMAScript 代码。
```js
var s1 = new String("some text");
var s2 = s1.substring(2);
s1 = null;
```

引用类型与基本包装类型的主要区别就是对象的生存期。使用 new 操作符创建的**引用类型的实例**，
(所以就算是```new Boolean(false)```，因为返回的是object，所以也是true)
在执行流离开当前作用域之前都一直保存在内存中。而自动创建的基本包装类型的对象，则只存在于一
行代码的执行瞬间，然后立即被销毁。这意味着我们不能在运行时为基本类型值添加属性和方法。
```js
var s1 = new String("some text")
s1.color='123'
s1.color   //==> "123"

a="222"
a.bbb='ccc'
a.bbb  //==> undefined //问题的原因就是第二行创建的 String 对象在执行第三行代码时已经被销毁了。
                       //第三行代码又创建自己的 String 对象，而该对象没有 color 属性
```
Object 构造函数也会像工厂方法一样，根据传入值的类型返回相应基本包装类型的实例。例如：
var obj = new Object("some text");
alert(obj instanceof String); //true
把字符串传给 Object 构造函数，就会创建 String 的实例；而传入数值参数会得到 Number 的实
例，传入布尔值参数就会得到 Boolean 的实例。

使用 new 调用基本包装类型的构造函数，与直接调用同名的转型函数是不一样的。
```js
var value = "25";
var number = Number(value); //转型函数
alert(typeof number); //"number"
var obj = new Number(value); //构造函数
alert(typeof obj); //"object
```

indexOf(str,startIndex)
lastIndexOf(str,startIndex)

```
'a' in obj   //对象自身包括原型
for key in obj   //对象自身包括原型所有可枚举的属性
obj.hasOwnProperty('a')  //a是不是对象自身的属性
Object.keys(obj)  //对象自身所有可枚举的属性，不含原型
Object.getOwnPropertyNames(obj) //对象自身所有实例属性，无论是否可枚举
```
####创建对象
#####原型模式的最大问题是由其共享的本性所导致的
######组合使用构造函数模式与原型模式
```js
/*创建自定义类型的最常见方式，就是组合使用构造函数模式与原型模式。构造函数模式用于定义实
例属性，而原型模式用于定义方法和共享的属性。结果，每个实例都会有自己的一份实例属性的副本，
但同时又共享着对方法的引用，最大限度地节省了内存。另外，这种混成模式还支持向构造函数传递参
数；可谓是集两种模式之长。下面的代码重写了前面的例子。*/
function Person(name, age, job){
this.name = name;
this.age = age;
this.job = job;
this.friends = ["Shelby", "Court"];
}
Person.prototype = {
constructor : Person,
sayName : function(){
alert(this.name);
}
}
var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");
person1.friends.push("Van");
alert(person1.friends); //"Shelby,Count,Van"
alert(person2.friends); //"Shelby,Count"
alert(person1.friends === person2.friends); //false
alert(person1.sayName === person2.sayName); //true
/*
在这个例子中，实例属性都是在构造函数中定义的，而由所有实例共享的属性 constructor 和方
法 sayName()则是在原型中定义的。而修改了 person1.friends（向其中添加一个新字符串），并不
会影响到 person2.friends，因为它们分别引用了不同的数组。
这种构造函数与原型混成的模式，是目前在 ECMAScript 中使用最广泛、认同度最高的一种创建自
定义类型的方法。可以说，这是用来定义引用类型的一种默认模式*/
```
#######动态原型模式
```js
function Person(name, age, job){
    //属性
    this.name = name;
    this.age = age;
    this.job = job;
    //方法
    //加上if后，只在new第一个实例时才会定义sayName方法，之后new其他就不会重新定义了
    //if 语句检查的可以是初始化之后应该存在的任何属性或方法——不必用一大堆if 语句检查每个属性和每个方法；只要检查其中一个即可
    //  要么它们全都还没有定义(new第一个实例时)，要么已经全都定义了(new其他实例后)，即它们的存在性是一致的，用同一个判断就可以了，而不需要分别对它们进行判断
    if (typeof this.sayName != "function"){
        Person.prototype.sayName = function(){
           alert(this.name);
        };
        Person.prototype.sayBye = function() {
           alert('bye');
        };
    }
}
var friend = new Person("Nicholas", 29, "Software Engineer");
friend.sayName();
```
#####确定原型和实例的关系
```js
//使用 instanceof 操作符，只要用这个操作符来测试实例与原型链中出现过的构造函数，结果就会返回 true
instance instanceof Object     //true
instance instanceof SuperType  //true
//isPrototypeOf()方法。同样，只要是原型链中出现过的原型，都可以说是该原型链所派生的实例的原型，因此 isPrototypeOf()方法也会返回 true
Object.prototype.isPrototypeOf(instance)  //true
```


```js
//每个构造函数都有一个原型对象f.prototype，
function  f() {
  this.m=1
}
//原型对象都包含一个指向构造函数的指针f.prototype.constructor，
//而实例都包含一个指向原型对象的内部指针obj.__proto__。
obj=new f()
```
那么，假如我们让原型对象等于另一个类型的实例，结果会怎么样呢？
```js
f.prototype=new f1()//此时f拥有了f1下所有的实例以及原型上的属性和方法
```
显然，此时的原型对象将包含一个指向另一个原型的指针f.prototype===f1.prototype，相应地，另一个原型中也包含着一个指向另一个构造函数
的指针。假如另一个原型又是另一个类型的实例，那么上述关系依然成立，如此层层递进，就构成了实
例与原型的链条。

####继承
组合继承（combination inheritance），有时候也叫做伪经典继承，指的是将原型链和借用构造函数的
技术组合到一块，从而发挥二者之长的一种继承模式。其背后的思路是使用原型链实现对原型属性和方
法的继承，而通过借用构造函数来实现对实例属性的继承。这样，既通过在原型上定义方法实现了函数
复用，又能够保证每个实例都有它自己的属性。
```js
function SuperType(name){
this.name = name;
this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function(){
alert(this.name);
}
function SubType(name, age){
  //继承属性
  //每个实例都具有自己的属性,不在共享
  SuperType.call(this, name);
  this.age = age;
}
//继承方法
SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function(){
  alert(this.age);
};
var instance1 = new SubType("Nicholas", 29);
instance1.colors.push("black");
alert(instance1.colors); //"red,blue,green,black"
instance1.sayName(); //"Nicholas";
instance1.sayAge(); //29
var instance2 = new SubType("Greg", 27);
alert(instance2.colors); //"red,blue,green"
instance2.sayName(); //"Greg";
instance2.sayAge(); //27
```

#####函数声明和函数表达式的主要区别就是函数声明会提升

######闭包会携带包含它的函数的作用域，因此会比其他函数占用更多的内存
###### this 对象是在运行时基于函数的执行环境绑定的：
在全局函数中， this 等于 window；
当函数被作为某个对象的方法调用时， this 等于那个对象；
不过，匿名函数的执行环境具有全局性，因此其 this 对象通常指向 window
```js
var name = "The Window";
var object = {
    name : "My Object",
    getNameFunc : function(){
        return function(){
            return this.name;
        };
    }
};
alert(object.getNameFunc()()); //"The Window"（在非严格模式下）
```
每个函数在被调用时都会自动取得两个特殊变量： this 和 arguments。
内部函数在搜索这两个变量时，只会搜索到其活动对象为止，
因此永远不可能直接访问外部函数中的这两个变量
不过，把外部作用域中的 this 对象保存在一个闭包能够访问
到的变量里，就可以让闭包访问该对象了，
```js
var name = "The Window";
var object = {
    name : "My Object",
    getNameFunc : function(){
      var that = this;
      return function(){
         return that.name;
      };
    }
 };
 alert(object.getNameFunc()()); //"My Object"
```
