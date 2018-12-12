// seajs/requirejs
// AMD
// CMD
// CommonJS
// 
return function mod(a, b) {
  return a % b
}



function reload(fns) {

}

var Complex = reload([
  function a(nReal, nImage) {
    this.re = nReal
    this.im = nImage
  },
  function b(sComplex) {
    var a = parse()
    var b = parse()
    this.re = a
    this.im = b
  },
  function c(oComplex) {
    this.re = oComplex.re
    this.im = oComplex.im
  }
])
a = new Complex(1, 2) //a
b = new Complex(a) //c
c = new Complex('2+3i') //b



// a.js
var b = require('./b.js')

setTimeout(b.x, 50000)

// b.js
var a = require('./a.js')