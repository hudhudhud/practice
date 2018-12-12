require('./app.css')

var div = require('./testDiv.js')()

window.onload = function(...args) {
  //es6转化
  //babel转化成for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {  args[_key] = arguments[_key]; }

  console.log(args)
  document.querySelector('body').appendChild(div)
  document.documentElement.style.fontSize = "13px"
  var a = "hello"
  console.log(`123 ${a} 321`) //babel转化为console.log('123 ' + a + ' 321')

  console.log(args)
  console.log('hello world')
};