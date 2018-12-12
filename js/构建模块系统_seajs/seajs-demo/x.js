define('x', ['add', 'mod'], function(require, exports, module) {

  var add = require('./add')
  var mod = require('./mod')

  console.log(mod(add(11, 21), add(3, 4)))

})