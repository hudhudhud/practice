const path = require('path')

module.exports = {
  baseUrl:"/",
  outputDir:"dist",
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
    if (process.env.NODE_ENV === 'production') {//num run build默认模式为production
      // 为生产环境修改配置...
    } else {//num run serve默认模式为development 
      // 为开发环境修改配置...
    }
  },
  configureWebpack: {
    //outputDir:"build",
    plugins: [
      //new MyAwesomeWebpackPlugin()
    ],
    module: {
      // rules: [
      //   {
      //     test: /\.js$/, // Check for all js files
      //     exclude: /node_modules\/(?!(dom7|ssr-window|swiper)\/).*/,
      //     loader: 'babel-loader'
      //   },
      // ]
    },
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