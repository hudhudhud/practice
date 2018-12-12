//模块中的代码放在define中为了防止文件因为跨域问题而获取不到，
//所以seajs实现了一个define（ 把传给他的参数放到一个全局变量以便后续执行完后在script
//标签的onload事件里放入缓存以及继续加载他的依赖项） 
//方法以及load（ 通过创建srcipt标签加载依赖文件）
// 方法， 通过最开始的入口文件加载完成之后， 立即执行了define函数即得到传给他的参数（ 即模块内容）， 然后通过调用script标签的onload事件（ 现代浏览器script的onload事件会在脚本执行完后立即调用），
//通过将函数变成字符串得到函数内部依赖的文件， 从而继续load这些文件
//所以模块中的依赖文件的路径也只能写成静态的，不能有运算符之类的，否则无法解析依赖文件
(function() {
  var moduleFnCache = {}
  var moduleCache = {}

  window.require = function require(name) {
    if (moduleCache[name]) {
      return moduleCache[name].exports
    }

    var module = moduleCache[name] = {
      exports: {}
    }

    moduleFnCache[name](require, module, module.exports)

    return module.exports
  }

  require.moduleFnCache = moduleFnCache
  require.moduleCache = moduleCache

  window.ocean = {}

  ocean.use = function(entry) {
    load(entry).then(() => {
      require(entry)
    })
  }

  var currModuleFn

  window.define = function define(moduleFn) {
    // 之所以可以这么写是因为在现代浏览器中
    // script的onload事件会在脚本执行完后立即调用,没有事件循环，没有时间间隔
    // 相当onload在脚本的最后
    currModuleFn = moduleFn
  }

  function load(path) {
    return new Promise(resolve => {
      if (require.moduleFnCache[path]) {
        return resolve()
      }
      var script = document.createElement('script')
      script.src = path
      document.body.appendChild(script)
      script.onload = function() {
        script.parentNode.removeChild(script)
        require.moduleFnCache[path] = currModuleFn
        var moduleSrc = currModuleFn.toString()
        var requireCalls = moduleSrc
          .match(/require *\( *'([^'"]+)' *\)/g)

        var dependences = requireCalls && requireCalls.map(requireCall => {
          return requireCall.match(/'([^'"]+)'/)[1]
        })

        if (dependences) {
          Promise.all(dependences.map(dep => load(dep)))
            .then(() => {
              resolve()
            })
        } else {
          resolve()
        }
      }
    })
  }
}())