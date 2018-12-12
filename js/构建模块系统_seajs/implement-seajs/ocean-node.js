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

    moduleFnCache[name](require, module.exports, module)

    return module.exports
  }

  require.moduleFnCache = moduleFnCache
  require.moduleCache = moduleCache

  window.ocean = {}

  ocean.use = function(entry) {
    load(entry).then(() => {
      debugger
    })
  }

  var currModuleFn

  // window.define = function define(moduleFn) {
  //   // 之所以可以这么写是因为在现代浏览器中
  //   // script的onload事件会在脚本执行完后立即调用
  //   // 相当onload在脚本的最后
  //   currModuleFn = moduleFn
  // }

  function load(path) {
    return new Promise(resolve => {
      if (require.moduleFnCache[path]) {
        return resolve()
      }
      var xhr = new XMLHttpRequest()
      xhr.open('GET', path)
      xhr.send()

      // var script = document.createElement('script')
      // script.src = path
      // document.body.appendChild(script)

      xhr.onload = function() {
        // script.parentNode.removeChild(script)
        var moduleSrc = xhr.responseText
        require.moduleFnCache[path] = new Function('require, exports, module', moduleSrc)
          // var moduleSrc = currModuleFn.toString()
        var requireCalls = moduleSrc
          .match(/require *\( *'([^'"]+)' *\)/g)

        var dependences = requireCalls && requireCalls.map(requireCall => {
          return requireCall.match(/'([^'"]+)'/)[1]
        })

        if (dependences) {
          Promise.all(dependences.map(dep => load(dep + '.js')))
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