var fs = require('fs')

global.imports = function imports(name) {
  var code = new Function('exports, module', fs.readFileSync(name))
  var module = {
    exports: {}
  }
  var result = code(module.exports, module)
  return module.exports
}

var weekDay = imports('./week-day.js')

console.log(weekDay.number(weekDay.name(13)))