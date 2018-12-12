const path = require('path')
const PrerenderSpaPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSpaPlugin.PuppeteerRenderer;

module.exports = {
  baseUrl:"/",
  outputDir:path.join(__dirname,"dist"),
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
    if (process.env.NODE_ENV === 'production') {//num run build默认模式为production
      // 为生产环境修改配置...
    } else {//num run serve默认模式为development 
      // 为开发环境修改配置...
    }
  },
  configureWebpack:{
    //outputDir:"build",
    plugins: [
      //new MyAwesomeWebpackPlugin()
      new PrerenderSpaPlugin({
        staticDir: path.join(__dirname, 'dist'),
        outputDir:path.join(__dirname, 'dist'),
        indexPath:path.join(__dirname, 'dist','/index.html'),
        routes: ['/'],//适合不需要检查登陆就能跳转的页面，否则因为生成html时并不会等待异步请求操作，将不会生成的页面的html
                      // 首页预加载，一旦js加载完成即会去更新动态数据，而不是显示静态的html了
                      //让后端CORS
        minify: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          decodeEntities: true,
          keepClosingSlash: true,
          sortAttributes: true,
        },
        postProcess (renderedRoute) {
          renderedRoute.html = renderedRoute.html.replace(/<script.*src=".*[0-9]+\.[0-9a-z]*\.js"><\/script>/,'')
          return renderedRoute
        },
        renderer:new Renderer({
          renderAfterTime:5000,
          headless:false
        })
      })
    ],
    //module: {
      // rules: [
      //   {
      //     test: /\.js$/, // Check for all js files
      //     exclude: /node_modules\/(?!(dom7|ssr-window|swiper)\/).*/,
      //     loader: 'babel-loader'
      //   },
      // ]
    // },
  },
  // css: {
  //   loaderOptions: {
  //     // 给 less-loader 传递选项
  //     less: {
  //       // @/ 是 src/ 的别名
  //       data: `@import "@/styles/common.less";`
  //     }
  //   }
  // }
  devServer: {
     proxy: 'http://172.16.6.34:12345'
  }
}

function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/styles/common.less'),
      ],
    })
}