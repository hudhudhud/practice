//要求模块中的代码放在define中为了防止文件因为跨域问题而获取不到
define(function(require, module, exports) {
  //且路径不能为动态，即只能写死
  require('b.js')
  module.exports = function() {
    console.log(11111111)
  }
})