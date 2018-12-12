//   var APP_ID = '1UHv40hnphEODjDaa7eOWR2q-gzGzoHsz';
//   var APP_KEY = 'YNbTneQAz6RVilCPMTlJyF1N';

//   AV.init({
//     appId: APP_ID,
//     appKey: APP_KEY
//   });
//   var TestObject = AV.Object.extend('Article');
//   var testObject = new TestObject();
//   testObject.save({
//     title: 'hello123',
//     content: `<p>ThreadLocal是什么 早在JDK 1.2的版本中就提供Java.lang.ThreadLocal，ThreadLocal为解决多线程程序的并发问题提供了一种新的思路。使用这个工 具类可以很简洁地编写出优美的多线程程序。 当使用ThreadLocal维护变量时，ThreadLocal为每个使用该变量的线程提供独立的变量副本，所以每一个线程都可以独立地改变自己的副本，而不会影响其它线程所对应的副本。 　</p><p>　从线程的角度看，目标变量就象是线程的本地变量，这也是类名中“Local”所要表达的意思。 　</p><p>　所以，在Java中编写线程局部变量的代码相对来说要笨拙一些，因此造成线程局部变量没有在Java开发者中得到很好的普 及。 ThreadLocal的接口方法 ThreadLocal类接口很简单，只有4个方法，我们先来了解一下： void set(Object value)设置当前线程的线程局部变量的值 。 public Object get()该方法返回当前线程所对应的线程局部变量。 public void remove()将当前线程局部变量的值删除，目的是为了减少内存的占用，该方法是JDK 5.0新增的方法。需要指出的是，当线程结束后，对应该线程的局部变量将自动被垃圾回收，所以显式调用该方法清除线程的局部变量并不是必须的操作，但它可以加快内存回收的速度。 protected Object initialValue()返回该线程局部变量的初始值，该方法是一个protected的方法，显然是为了让子类覆盖而设计的。这个方法是一个延迟调用方法，在线程第1次调用get()或set(Object)时才执行，并且仅执行1次。ThreadLocal中的缺省实现直接返回一个null。 值得一提的是，在JDK5.0中，ThreadLocal已经支持泛型，该类的类名已经变为ThreadLocal。API方法也相应进行了调整，新版本的API方法分别是void set(T value)、T get()以及T initialValue()。&nbsp;</p><p>　　ThreadLocal是如何做到为每一个线程维护变量的副本的呢？其实实现的思路很 简单：在ThreadLocal类中有一个Map，用于存储每一个线程的变量副本，Map中元素的键为线程对象，而值对应线程的变量副本。我们自己就可以提供一个简单的实现版本：</p>
// <p>&nbsp; &nbsp; &nbsp; &nbsp;算起来已经足足两个半月没有更新文章，这段时间过得比较忙：夜间跑步计划、卖房买房以及工作上各种事情都凑到一块 了。实际上，最近也并没有忙到完全抽不出时间写博客这种地步，根本原因可能还是变懒了，这样不好。</p><p>&nbsp; &nbsp; &nbsp; &nbsp;几个月前， 我决定开始写一系列有关「移动 WEB 通用优化」的文章，介绍「面向所有主流移动端浏览器（包括各种 APP 嵌入的通用 Webview）」的前端优化策略，本 文是这个系列第二篇。&nbsp;</p>`
//   }).then(function(object) {
//     console.log('LeanCloud Rocks!');
//   }).catch((e) => console.log(e))